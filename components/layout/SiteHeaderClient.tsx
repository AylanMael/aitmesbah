"use client";

import { useEffect, useRef, useState } from "react";
import Brand from "@/components/layout/Brand";
import { mainNavigation } from "@/data/navigation";

export default function SiteHeaderClient() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const f = () => setScrolled(scrollY > 40);
    f();
    addEventListener("scroll", f);
    return () => removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    if (!menu) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenu(false);
      menuButtonRef.current?.focus();
    };

    addEventListener("keydown", closeOnEscape);
    return () => removeEventListener("keydown", closeOnEscape);
  }, [menu]);

  function closeMenuAndRestoreFocus() {
    if (!menu) return;

    setMenu(false);
    requestAnimationFrame(() => {
      menuButtonRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <header className={`site-header ${scrolled || menu ? "solid" : ""}`}>
      <Brand />
      <nav
        id="navigation-principale"
        aria-label="Navigation principale"
        className={menu ? "open" : ""}
      >
        {mainNavigation.map((item) => (
          <a
            href={item.href}
            key={item.href}
            onClick={closeMenuAndRestoreFocus}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="contribute small" href="#contribuer">
          Contribuer <span aria-hidden="true">↗</span>
        </a>
        <button
          ref={menuButtonRef}
          type="button"
          className="menu-btn"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-controls="navigation-principale"
          aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {menu ? "×" : "☰"}
        </button>
      </div>
    </header>
  );
}
