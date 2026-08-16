"use client";

import { useEffect, useState } from "react";

export default function MotionControlClient() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", paused);
  }, [paused]);

  useEffect(
    () => () => {
      document.documentElement.classList.remove("motion-paused");
    },
    [],
  );

  return (
    <button
      type="button"
      className="motion-control"
      aria-pressed={paused}
      onClick={() => setPaused((current) => !current)}
    >
      {paused
        ? "Reprendre les animations"
        : "Mettre les animations en pause"}
    </button>
  );
}
