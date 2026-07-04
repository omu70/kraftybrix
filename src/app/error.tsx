"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="container-wide grid min-h-screen place-items-center pt-28 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-gradient-red">Oops</p>
        <h1 className="h-display mt-4 text-3xl">Something went wrong</h1>
        <p className="mt-3 text-black/55">A gremlin got into the engine. Give it another go — this usually fixes it.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link href="/"><Button variant="secondary">Back to home</Button></Link>
        </div>
      </div>
    </div>
  );
}
