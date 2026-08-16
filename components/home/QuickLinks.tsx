import { quickLinks } from "@/data/home";

export default function QuickLinks() {
  return (
    <aside className="quick-links" aria-label="Accès rapides">
      {quickLinks.map((item) => (
        <a href={item.href} key={item.number}>
          <span>{item.number}</span>
          <b>{item.label}</b>
          <i aria-hidden="true">↗</i>
        </a>
      ))}
    </aside>
  );
}
