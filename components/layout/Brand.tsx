import Image from "next/image";
import Link from "next/link";

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Aït Mesbah — accueil">
      <Image
        className="brand-logo"
        src="/logo-ait-mesbah.webp"
        width={48}
        height={48}
        alt=""
        aria-hidden="true"
      />
      <span>
        <span aria-hidden="true">
          A<span className="brand-i-diaeresis">ı</span>t Mesbah
        </span>
        <small>Village kabyle</small>
      </span>
    </Link>
  );
}
