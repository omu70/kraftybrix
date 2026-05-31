import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Confirmed({ searchParams }: { searchParams: { order?: string; demo?: string } }) {
  const order = searchParams.order ?? "KB000000";
  return (
    <div className="container-wide grid min-h-[70vh] place-items-center pt-28 text-center">
      <div className="max-w-md">
        <CheckCircle2 className="mx-auto text-green-400" size={64} />
        <h1 className="h-display mt-6 text-4xl">Order confirmed</h1>
        <p className="mt-3 text-white/60">
          Thank you! Your order <span className="font-semibold text-cream">{order}</span> is being
          prepared and ships within 24 hours. A confirmation email is on its way.
        </p>
        {searchParams.demo && (
          <p className="mt-4 rounded-lg border border-brand-blue/40 bg-brand-blue/10 px-4 py-3 text-xs text-white/70">
            Demo mode: no Razorpay keys configured. Add test keys in <code>.env</code> to take a real
            test payment.
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/account/orders"><Button variant="secondary">Track order</Button></Link>
          <Link href="/collection"><Button>Keep building</Button></Link>
        </div>
      </div>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; demo?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Suspense>
      <Confirmed searchParams={sp} />
    </Suspense>
  );
}
