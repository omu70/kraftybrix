import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SP = { order?: string; demo?: string; paid?: string; due?: string };

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Confirmed({ searchParams }: { searchParams: SP }) {
  const order = searchParams.order ?? "KB000000";
  const paid = Number(searchParams.paid ?? 0);
  const due = Number(searchParams.due ?? 0);

  return (
    <div className="container-wide grid min-h-[70vh] place-items-center pt-28 text-center">
      <div className="max-w-md">
        <CheckCircle2 className="mx-auto text-green-400" size={64} />
        <h1 className="h-display mt-6 text-4xl">Order confirmed</h1>
        <p className="mt-3 text-black/60">
          Thank you! Your order <span className="font-semibold text-cream">{order}</span> is being
          prepared and ships within 24 hours. A confirmation email is on its way.
        </p>

        {due > 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-ink-800 p-5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-black/55">Paid online now</span>
              <span className="font-semibold text-green-500">{inr(paid)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-black/10 pt-2">
              <span className="text-black/55">Pay on delivery (cash)</span>
              <span className="font-semibold text-cream">{inr(due)}</span>
            </div>
            <p className="mt-3 text-xs text-black/45">Please keep {inr(due)} ready for the delivery partner.</p>
          </div>
        ) : paid > 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-ink-800 p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-black/55">Paid online</span>
              <span className="font-semibold text-green-500">{inr(paid)}</span>
            </div>
          </div>
        ) : null}

        {searchParams.demo && (
          <p className="mt-4 rounded-lg border border-brand-blue/40 bg-brand-blue/10 px-4 py-3 text-xs text-black/70">
            Test mode — this order was simulated because Razorpay keys aren’t added yet. Add your keys in Vercel to take real payments.
          </p>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/account"><Button variant="secondary">Track order</Button></Link>
          <Link href="/collection"><Button>Keep building</Button></Link>
        </div>
      </div>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  return (
    <Suspense>
      <Confirmed searchParams={sp} />
    </Suspense>
  );
}
