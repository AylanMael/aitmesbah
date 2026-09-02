"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/layout/Brand";
import { mainNavigation } from "@/data/navigation";

export default function SiteHeaderClient() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const f = () => setScrolled(scrollY > 40);
    f();
    addEventListener("scroll", f);
    return () => removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 981px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenu(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menu) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }, 80);

    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !navRef.current) return;
      const focusable = [
        ...navRef.current.querySelectorAll<HTMLAnchorElement>("a[href]"),
        menuButtonRef.current,
      ].filter(Boolean) as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    addEventListener("keydown", handleKeys);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      removeEventListener("keydown", handleKeys);
    };
  }, [menu]);

  function closeMenuAndRestoreFocus() {
    if (!menu) return;

    setMenu(false);
    requestAnimationFrame(() => {
      menuButtonRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <header className={`site-header ${scrolled || menu || pathname !== "/" ? "solid" : ""}`}>
      <Brand />
      <nav
        ref={navRef}
        id="navigation-principale"
        aria-label="Navigation principale"
        className={menu ? "open" : ""}
      >
        {mainNavigation.map((item) => (
          <a
            href={item.href}
            key={item.href}
            onClick={closeMenuAndRestoreFocus}
            aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <Link
          className="contribute small"
          href="/contribuer"
          aria-current={pathname === "/contribuer" ? "page" : undefined}
        >
          Contribuer <span aria-hidden="true">↗</span>
        </Link>
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
