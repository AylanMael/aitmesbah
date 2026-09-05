"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/layout/Brand";
import { mainNavigation } from "@/data/navigation";

function MenuIcon({ type }: { type?: "committee" | "sport" | "judo" | "culture" }) {
  if (type === "committee") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="9" r="4"/><circle cx="8" cy="17" r="3"/><circle cx="24" cy="17" r="3"/><path d="M9 27c.5-5 3-8 7-8s6.5 3 7 8M3 27c.3-3.5 2-5.5 5-5.5M29 27c-.3-3.5-2-5.5-5-5.5"/></svg>;
  if (type === "sport") return <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="21" cy="7" r="3.2"/><path d="m18 12-5 7 6 4 4-6 5 5m-10-10 7 3 5-2M19 23l-6 10m10-16 1 9 6 6"/><circle cx="33" cy="31" r="4"/><path d="m31 28 3 1 1 3-3 2-3-2 .5-3.5"/></svg>;
  if (type === "judo") return <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="12" cy="7" r="3"/><circle cx="27" cy="8" r="3"/><path d="m10 12-5 7 5 3 4-6 7 5m8-8 5 7-5 3-5-7-7 4m-3-7 5 3 5-3M11 22l-2 11m5-10 5 10m9-10 3 10m-7-10-5 10"/><path d="M13 17c3 4 7 5 12 1M8 35h7m10 0h8"/></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 7c5-1 9 .5 12 4v16c-3-3.5-7-5-12-4V7Zm24 0c-5-1-9 .5-12 4v16c3-3.5 7-5 12-4V7Z"/><path d="m23 10 .8 1.8 1.9.2-1.4 1.3.4 1.9-1.7-.9-1.7.9.4-1.9-1.4-1.3 1.9-.2.8-1.8Z"/></svg>;
}

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
          <div className={`${item.children ? "nav-item nav-item-with-submenu" : "nav-item"}${item.href === "/agir" ? " nav-item-highlight" : ""}`} key={item.href}>
            <a href={item.href} onClick={closeMenuAndRestoreFocus} aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "page" : undefined}>
              {item.label}{item.children && <span className="nav-chevron" aria-hidden="true">⌄</span>}
            </a>
            {item.children && <div className="nav-submenu" aria-label={`Sous-menu ${item.label}`}>
              {item.children.map((child) => <a href={child.href} key={child.href} onClick={closeMenuAndRestoreFocus}>
                <span className="nav-submenu-icon"><MenuIcon type={child.icon} /></span>
                <span className="nav-submenu-copy"><strong>{child.label}</strong>{child.description && <small>{child.description}</small>}</span>
                <span className="nav-submenu-arrow" aria-hidden="true">↗</span>
              </a>)}
            </div>}
          </div>
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
