"use client";

import { useEffect, useState } from "react";
import Brand from "@/components/layout/Brand";
import { mainNavigation } from "@/data/navigation";

export default function SiteHeaderClient() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(scrollY > 40);
    f();
    addEventListener("scroll", f);
    return () => removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`site-header ${scrolled || menu ? "solid" : ""}`}>
      <Brand />
      <nav className={menu ? "open" : ""} onClick={() => setMenu(false)}>
        {mainNavigation.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <span className="lang">FR</span>
        <a className="contribute small" href="#contribuer">
          Contribuer ↗
        </a>
        <button
          className="menu-btn"
          onClick={() => setMenu(!menu)}
          aria-label="Menu"
        >
          {menu ? "×" : "☰"}
        </button>
      </div>
    </header>
  );
}
