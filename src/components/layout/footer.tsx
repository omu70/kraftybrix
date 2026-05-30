import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Twitter, Facebook } from "lucide-react";

const cols = [
  {
    title: "Shop",
    links: [
      ["All Models", "/collection"],
      ["Hypercars", "/collection?category=Hypercars"],
      ["Smoking Cars", "/collection?category=Smoking+Cars"],
      ["Limited Editions", "/collection?category=Limited+Editions"],
      ["Gift Cards", "/gift-cards"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Shipping & Delivery", "/shipping"],
      ["Returns", "/returns"],
      ["Build Help", "/support"],
      ["Track Order", "/account/orders"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Brand",
    links: [
      ["Our Story", "/about"],
      ["The Build Process", "/#build"],
      ["Community", "/#community"],
      ["Careers", "/careers"],
      ["Wholesale", "/wholesale"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-ink-900">
      <div className="container-wide py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center" aria-label="KraftyBrix home">
              <Image
                src="/logo.png"
                alt="KraftyBrix"
                width={200}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-black/55">
              Premium brick-built automotive collectibles for enthusiasts who
              never stop dreaming. Build the garage you've always dreamed of.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Youtube, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-black/60 transition hover:border-brand-red hover:text-brand-red"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-black/55 transition hover:text-zinc-900">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-8 text-xs text-black/45 sm:flex-row">
          <p>© {new Date().getFullYear()} KraftyBrix. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-900">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-900">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-zinc-900">Sitemap</Link>
          </div>
          <p className="flex items-center gap-2">
            Secured by Razorpay · COD available
          </p>
        </div>
      </div>
    </footer>
  );
}
