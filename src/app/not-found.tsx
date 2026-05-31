import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-wide grid min-h-screen place-items-center pt-28 text-center">
      <div>
        <p className="font-display text-8xl font-bold text-gradient-red">404</p>
        <h1 className="h-display mt-4 text-3xl">This bay is empty</h1>
        <p className="mt-3 text-white/55">The model you're looking for has left the garage.</p>
        <Link href="/collection">
          <Button className="mt-8">Back to the collection</Button>
        </Link>
      </div>
    </div>
  );
}
