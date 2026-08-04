import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Live visitor counts for the admin. online = active in last 5 min. */
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ online: 0, today: 0, db: false });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const [online, today] = await Promise.all([
      prisma.liveVisitor.count({ where: { updatedAt: { gte: fiveMinAgo } } }),
      prisma.liveVisitor.count({ where: { updatedAt: { gte: startOfDay } } }),
    ]);
    return NextResponse.json({ online, today, db: true });
  } catch {
    return NextResponse.json({ online: 0, today: 0, db: false });
  }
}
