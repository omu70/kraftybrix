"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/store/recently-viewed";

/** Records the current product as "recently viewed". Renders nothing. */
export function TrackRecentlyViewed({ id }: { id: string }) {
  const add = useRecentlyViewed((s) => s.add);
  useEffect(() => { add(id); }, [id, add]);
  return null;
}
