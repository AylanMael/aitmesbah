import Image from "next/image";

export default function Brand() {
  return (
    <a href="#accueil" className="brand">
      <Image
        className="brand-logo"
        src="/logo-ait-mesbah.webp"
        width={48}
        height={48}
        alt=""
        aria-hidden="true"
      />
      <span>Aït Mesbah<small>Village kabyle</small></span>
    </a>
  );
}
