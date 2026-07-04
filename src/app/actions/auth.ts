"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

const hasDb = () => !!process.env.DATABASE_URL;
async function getDb() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

async function currentUser() {
  try {
    const session = await getServerSession(authOptions);
    return {
      email: session?.user?.email ?? null,
      id: (session?.user as { id?: string } | undefined)?.id ?? null,
    };
  } catch {
    return { email: null, id: null };
  }
}

/* ─────────────── Register ─────────────── */

const registerSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Use at least 6 characters"),
});

export async function registerUser(input: { name: string; email: string; password: string }) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid details." };
  if (!hasDb()) return { ok: false as const, error: "Accounts need the database — this works once your store is connected." };
  try {
    const prisma = await getDb();
    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { ok: false as const, error: "An account with this email already exists. Try signing in." };
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    await prisma.user.create({ data: { name: parsed.data.name, email, passwordHash } });
    return { ok: true as const };
  } catch (e) {
    console.error("[auth] register failed:", e);
    return { ok: false as const, error: "Could not create the account. Please try again." };
  }
}

/* ─────────────── Orders ─────────────── */

export type MyOrder = {
  id: string; orderNumber: string; total: number; amountPaid: number; codBalance: number;
  status: string; paymentMethod: string; createdAt: string; items: { name: string; quantity: number }[];
};

export async function getMyOrders(): Promise<MyOrder[]> {
  if (!hasDb()) return [];
  try {
    const { email, id } = await currentUser();
    if (!email && !id) return [];
    const prisma = await getDb();
    const or = [id ? { userId: id } : null, email ? { guestEmail: email } : null].filter(Boolean) as object[];
    const orders = await prisma.order.findMany({ where: { OR: or }, include: { items: true }, orderBy: { createdAt: "desc" } });
    return orders.map((o) => ({
      id: o.id, orderNumber: o.orderNumber, total: o.total, amountPaid: o.amountPaid, codBalance: o.codBalance,
      status: o.status, paymentMethod: o.paymentMethod, createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    }));
  } catch (e) {
    console.error("[auth] getMyOrders failed:", e);
    return [];
  }
}

/* ─────────────── Profile ─────────────── */

export async function updateProfile(input: { name: string }) {
  if (!hasDb()) return { ok: false as const, error: "Connect the database to save your profile." };
  try {
    const { email } = await currentUser();
    if (!email) return { ok: false as const, error: "Please sign in." };
    const prisma = await getDb();
    await prisma.user.update({ where: { email }, data: { name: input.name } });
    revalidatePath("/account");
    return { ok: true as const };
  } catch (e) {
    console.error("[auth] updateProfile failed:", e);
    return { ok: false as const, error: "Could not save." };
  }
}

/* ─────────────── Addresses ─────────────── */

export type MyAddress = {
  id: string; fullName: string; phone: string; line1: string; line2: string | null;
  city: string; state: string; pincode: string;
};

export async function listAddresses(): Promise<MyAddress[]> {
  if (!hasDb()) return [];
  try {
    const { id } = await currentUser();
    if (!id) return [];
    const prisma = await getDb();
    const rows = await prisma.address.findMany({ where: { userId: id }, orderBy: { isDefault: "desc" } });
    return rows.map((a) => ({ id: a.id, fullName: a.fullName, phone: a.phone, line1: a.line1, line2: a.line2, city: a.city, state: a.state, pincode: a.pincode }));
  } catch (e) {
    console.error("[auth] listAddresses failed:", e);
    return [];
  }
}

const addressSchema = z.object({
  fullName: z.string().min(2), phone: z.string().min(8), line1: z.string().min(3),
  line2: z.string().optional(), city: z.string().min(2), state: z.string().min(2), pincode: z.string().min(4),
});

export async function addAddress(input: unknown) {
  if (!hasDb()) return { ok: false as const, error: "Connect the database first." };
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Please fill in all address fields." };
  try {
    const { id } = await currentUser();
    if (!id) return { ok: false as const, error: "Please sign in." };
    const prisma = await getDb();
    await prisma.address.create({ data: { ...parsed.data, userId: id } });
    revalidatePath("/account");
    return { ok: true as const };
  } catch (e) {
    console.error("[auth] addAddress failed:", e);
    return { ok: false as const, error: "Could not save the address." };
  }
}

export async function deleteAddress(addressId: string) {
  if (!hasDb()) return { ok: false as const };
  try {
    const { id } = await currentUser();
    if (!id) return { ok: false as const };
    const prisma = await getDb();
    await prisma.address.deleteMany({ where: { id: addressId, userId: id } });
    revalidatePath("/account");
    return { ok: true as const };
  } catch (e) {
    console.error("[auth] deleteAddress failed:", e);
    return { ok: false as const };
  }
}
