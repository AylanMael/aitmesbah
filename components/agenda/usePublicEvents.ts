"use client";

import { useEffect, useState } from "react";
import type { PublicEvent } from "@/data/public-agenda";

export function usePublicEvents(initial: readonly PublicEvent[]) {
  const [events, setEvents] = useState<readonly PublicEvent[]>(initial);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/public/events", { signal: controller.signal }).then(response => response.ok ? response.json() : Promise.reject(new Error("agenda indisponible"))).then(value => { if (Array.isArray(value.events)) setEvents(value.events); }).catch(error => { if (error instanceof Error && error.name !== "AbortError") setEvents(initial); });
    return () => controller.abort();
  }, [initial]);
  return events;
}
