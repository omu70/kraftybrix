"use client";

import Script from "next/script";

/**
 * Google Analytics 4 + Meta Pixel.
 * IDs come from env. Renders nothing if unset (safe in dev).
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1937440843807692";

  return (
    <>
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      )}
      {pixel && (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${pixel}&ev=PageView&noscript=1`} />
        </noscript>
      )}
    </>
  );
}

/** Internal event name → Meta Pixel standard event name. */
const META_EVENTS: Record<string, string> = {
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  add_payment_info: "AddPaymentInfo",
  purchase: "Purchase",
  view_item: "ViewContent",
  search: "Search",
};

/** Fire an ecommerce event to both Google Analytics and Meta Pixel. */
export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // @ts-expect-error gtag injected at runtime
  window.gtag?.("event", event, data);

  // Meta Pixel: use the exact standard event name so it attributes in Ads.
  const meta = META_EVENTS[event];
  const payload = data?.value != null ? { currency: "INR", ...data } : data;
  // @ts-expect-error fbq injected at runtime
  if (meta) window.fbq?.("track", meta, payload);
  // @ts-expect-error fbq injected at runtime
  else window.fbq?.("trackCustom", event, payload);
}
