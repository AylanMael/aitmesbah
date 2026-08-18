import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "Histoire et mémoire d’Aït Mesbah",
  description:
    "Explorez les premiers repères de l’histoire d’Aït Mesbah, de son organisation ancienne aux migrations du XXe siècle, dans une démarche documentaire progressive.",
  alternates: { canonical: "/histoire-memoire" },
};

type Status = "documented" | "local" | "oral";
const statusLabels: Record<Status, string> = { documented: "Fait documenté", local: "Mémoire locale", oral: "Tradition orale" };
const contents = [["Origines", "origines"], ["Aït Aïssi", "ait-aissi"], ["Conquête", "conquete"], ["1871", "1871"], ["Transformations", "transformations"], ["Migrations", "migrations"], ["Grande Guerre", "grande-guerre"], ["Amar Imache", "amar-imache"], ["Archives", "archives"]] as const;

function StatusLabel({ status }: { status: Status }) {
  return <span className={`history-status history-status-${status}`}>{statusLabels[status]}</span>;
}

function TimelineEntry({ id, period, title, status, children }: { id?: string; period: string; title: string; status: Status; children: React.ReactNode }) {
  return <article className="history-entry" id={id}><div className="history-entry-marker" aria-hidden="true" /><div className="history-entry-period">{period}</div><div className="history-entry-content"><StatusLabel status={status} /><h2>{title}</h2>{children}</div></article>;
}

export default function HistoryMemoryPage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
    <SiteHeaderClient />
    <main id="contenu-principal" className="history-page" tabIndex={-1}>
      <header className="history-hero">
        <p className="eyebrow light">Un patrimoine à documenter et à transmettre</p>
        <h1>Histoire et mémoire d’Aït Mesbah</h1>
        <p className="history-hero-lead">L’histoire d’Aït Mesbah s’est transmise à travers les récits familiaux, les traditions orales, les gestes artisanaux et les parcours de plusieurs générations. Cette page ouvre un travail documentaire progressif destiné à réunir, vérifier et préserver cette mémoire collective.</p>
        <p className="history-hero-note">Les informations publiées ici distinguent les faits documentés, les traditions orales et les témoignages qui restent à recouper.</p>
      </header>

      <section className="history-method" aria-labelledby="history-method-title"><div><p className="eyebrow">Méthode documentaire</p><h2 id="history-method-title">Lire les niveaux de connaissance</h2></div><dl><div><dt><StatusLabel status="documented" /></dt><dd>Information appuyée par une archive ou un travail historique identifiable.</dd></div><div><dt><StatusLabel status="local" /></dt><dd>Information transmise dans le village et restant à recouper.</dd></div><div><dt><StatusLabel status="oral" /></dt><dd>Récit transmis entre les générations, présenté comme tel.</dd></div></dl></section>

      <nav className="history-toc" aria-label="Sommaire de la page"><span>Parcourir la chronologie</span><ol>{contents.map(([label, id], index) => <li key={id}><a href={`#${id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}</a></li>)}</ol></nav>

      <section className="history-timeline" aria-label="Chronologie historique">
        <TimelineEntry id="origines" period="Origines" title="Des origines probablement anciennes" status="oral"><p>La fondation d’Aït Mesbah pourrait remonter au XVIe siècle. Cette datation demeure une hypothèse de travail : elle devra être confrontée aux traditions orales, aux généalogies familiales et aux sources historiques disponibles.</p><p>Le peuplement du village s’est vraisemblablement constitué progressivement autour de plusieurs groupes familiaux et des différents quartiers composant son territoire.</p><aside className="history-source-note"><strong>Tradition orale</strong><p>Selon une tradition orale rapportée localement, le nom du village serait associé à un premier habitant appelé Yahya ou Mesbah. Cette interprétation n’est pas encore établie par une source historique suffisamment précise.</p></aside></TimelineEntry>

        <TimelineEntry id="ait-aissi" period="Organisation ancienne" title="Aït Mesbah dans la confédération des Aït Aïssi" status="documented"><p>Aït Mesbah appartenait à la tribu des Aït Amar Oufayed, qui comprenait également Taguemount Oukerrouche et Icherdiouène. Cette organisation territoriale et politique s’inscrivait dans la confédération kabyle des Aït Aïssi.</p><p>Les Aït Aïssi occupaient le massif situé entre la vallée du Sébaou et la plaine des Ouadhias, face au Djurdjura.</p><ul className="history-name-list"><li>Aït Zmenzer</li><li>Ihasnaouène</li><li>Iferdiouène</li><li>Aït Douala</li><li>Aït Mahmoud</li><li>Aït Abdelmoumène</li><li>Aït Amar Oufayed</li></ul><p>Comme plusieurs confédérations de Haute Kabylie, les Aït Aïssi conservaient une large autonomie à l’égard de la Régence d’Alger. Leurs relations avec le pouvoir ottoman furent marquées par des périodes de tension et de confrontation.</p><aside className="history-source-note"><strong>À rapprocher des sources</strong><p>Cette organisation historique ne correspond pas aux divisions administratives actuelles. Sa composition, ses limites et la graphie des noms devront être rapprochées de sources historiques et cartographiques.</p></aside></TimelineEntry>

        <TimelineEntry period="1830" title="1830 — Les premiers affrontements" status="local"><p>Après le débarquement des troupes françaises en 1830, des combattants de la confédération des Aït Aïssi auraient répondu à l’appel de Mohamed Zamoum pour participer à la résistance contre l’expédition française, notamment lors des affrontements de Staouéli.</p><p>La participation précise des habitants d’Aït Mesbah reste à documenter à partir des archives militaires et des travaux historiques consacrés à cette période.</p></TimelineEntry>

        <TimelineEntry id="conquete" period="Juin 1857" title="1857 — La conquête de la Kabylie" status="documented"><p>La région fut soumise par l’armée française en juin 1857, pendant la campagne militaire qui entraîna la conquête de la Kabylie.</p><p>Pour Aït Mesbah et les villages voisins, cette rupture ouvrit une période de transformations profondes : installation de l’administration coloniale, modification des structures politiques, pression accrue sur les terres et affaiblissement progressif des formes traditionnelles d’autonomie.</p></TimelineEntry>

        <TimelineEntry id="1871" period="1871" title="1871 — Soulèvement et séquestre" status="documented"><p>En 1871, Aït Mesbah et sa région participèrent au vaste soulèvement qui toucha une grande partie de la Kabylie. Après l’échec de l’insurrection, le village fut frappé par les mesures de séquestre appliquées à de nombreuses communautés kabyles.</p><p>Les conséquences foncières exactes pour les familles du village restent à établir. Les dossiers de séquestre, les archives administratives et les documents fonciers devront permettre de préciser les terres concernées et les effets de ces mesures.</p></TimelineEntry>

        <TimelineEntry id="transformations" period="Fin du XIXe siècle" title="Pauvreté, crises sanitaires et état civil" status="local"><p>À la fin du XIXe siècle, Aït Mesbah fut confronté à une période de grande précarité. La pauvreté et les difficultés alimentaires auraient été aggravées par des crises sanitaires, notamment des épisodes de typhus rapportés dans les années 1890.</p><p>Au cours de cette période, l’administration coloniale développa progressivement l’état civil. Les familles reçurent des patronymes administratifs, introduisant une nouvelle manière d’enregistrer les personnes et les lignées.</p><aside className="history-source-note"><strong>Travail à poursuivre</strong><p>Les dates précises, les conséquences des crises sanitaires et les modalités d’attribution des patronymes devront être étudiées à partir des registres et des archives administratives.</p></aside></TimelineEntry>

        <TimelineEntry id="migrations" period="Fin XIXe — début XXe" title="De la fin du XIXe siècle aux premières migrations" status="documented"><p>La pauvreté, la pression foncière et la recherche de revenus poussèrent de jeunes hommes à quitter temporairement ou durablement le village dès la fin du XIXe siècle et au début du XXe siècle.</p><p>Certains partirent travailler à Tizi Ouzou ou à Alger. D’autres se rendirent dans la plaine de la Mitidja, où ils furent employés dans les exploitations agricoles coloniales.</p><p>Ces mobilités constituèrent les premières étapes d’un mouvement migratoire qui allait progressivement relier Aït Mesbah aux villes algériennes, puis à la France métropolitaine.</p></TimelineEntry>

        <TimelineEntry period="Début du XXe siècle" title="Les premières générations scolarisées" status="local"><p>De jeunes garçons du village commencèrent à fréquenter l’école coloniale installée dans le village voisin de Taguemount Oukerrouche. Certains obtinrent leur certificat d’études. Cette scolarisation demeurait limitée et inégalement accessible.</p><p>Amar Imache aurait obtenu son certificat d’études en 1910. Cette date devra être accompagnée d’une source biographique ou archivistique avant d’être présentée comme définitivement établie.</p></TimelineEntry>

        <TimelineEntry period="Début du XXe siècle" title="Les premiers travailleurs en France" status="local"><p>Au début du XXe siècle, l’émigration vers la France métropolitaine prit une place croissante. Des hommes originaires du village partirent travailler dans les mines du nord de la France, dans les Bouches-du-Rhône et surtout dans la région parisienne.</p><p>Cette migration de travail, temporaire ou plus durable selon les parcours, contribua à transformer l’économie des familles et à créer les premiers réseaux reliant Aït Mesbah à la France.</p></TimelineEntry>

        <TimelineEntry id="grande-guerre" period="1914–1918" title="1914–1918 — Les hommes mobilisés" status="local"><p>Pendant la Première Guerre mondiale, plusieurs jeunes hommes d’Aït Mesbah furent mobilisés dans l’armée française, comme de nombreux Algériens soumis à la conscription coloniale.</p><p>La mémoire locale rapporte qu’au moins quatre ou cinq hommes du village auraient péri sur les fronts de Verdun et de la Somme. Cette estimation doit encore être vérifiée à partir des registres matricules, des fiches militaires et des bases consacrées aux soldats morts pendant le conflit.</p></TimelineEntry>

        <TimelineEntry period="Mémoire quotidienne" title="Des gestes transmis entre les générations" status="local"><p>La mémoire du village ne repose pas uniquement sur les événements politiques et militaires. Elle demeure également dans les métiers, les gestes quotidiens, l’organisation collective et les savoir-faire transmis au sein des familles.</p><ul className="history-practices"><li>Couture de la robe kabyle</li><li>Poterie</li><li>Organisation et entraide villageoises</li></ul><p>L’histoire précise de ces pratiques reste à documenter à partir des objets, des photographies, des témoignages et des archives familiales.</p></TimelineEntry>
      </section>

      <section className="history-imache" id="amar-imache"><div><p className="eyebrow light">Une figure du village</p><h2>Amar Imache et le mouvement national</h2></div><div className="history-imache-content"><p className="history-imache-lead">Aït Mesbah est le village natal d’Amar Imache, personnalité importante du mouvement national algérien. Il a notamment exercé les fonctions de secrétaire général de l’Étoile nord-africaine et participé à la défense du droit des Algériens à disposer d’eux-mêmes.</p><p>Son parcours politique, intellectuel et militant fera l’objet d’un dossier distinct, fondé sur des archives et des sources historiques clairement identifiées.</p><h3>Futurs axes documentaires</h3><ul><li>naissance et enfance à Aït Mesbah ;</li><li>parcours migratoire et professionnel ;</li><li>engagement dans l’Étoile nord-africaine ;</li><li>participation au journal <em>El Ouma</em> ;</li><li>pensée politique ;</li><li>héritage historique et mémoriel.</li></ul></div></section>

      <section className="history-archives" id="archives"><div className="history-archives-heading"><p className="eyebrow">Archives du village</p><h2>Réunir les sources du village</h2></div><ul><li>Photographies anciennes</li><li>Actes et documents administratifs</li><li>Registres d’état civil</li><li>Dossiers fonciers et séquestres</li><li>Lettres et correspondances</li><li>Journaux et coupures de presse</li><li>Cartes et plans</li><li>Objets artisanaux</li><li>Témoignages enregistrés</li><li>Archives associatives et sportives</li><li>Documents relatifs à Amar Imache</li><li>Registres matricules et fiches militaires</li></ul><aside className="history-rights-note"><strong>Publication et droits</strong><p>La présence d’un document dans les archives du projet ne signifie pas automatiquement qu’il peut être publié. Sa provenance, son propriétaire, les personnes représentées, les données personnelles et les droits de diffusion devront être examinés.</p></aside></section>

      <section className="history-conclusion"><p className="eyebrow">Une démarche collective</p><h2>Documenter sans figer</h2><p>Préserver la mémoire d’Aït Mesbah ne consiste pas à imposer une version unique de son histoire. Le projet doit permettre de confronter les sources, d’identifier les incertitudes et de conserver la diversité des récits.</p><p>Les habitants, les familles, les associations, les chercheurs et les membres de la diaspora pourront progressivement participer à ce travail, selon des modalités qui seront annoncées ultérieurement.</p><p className="history-editorial-pledge">Aucun document ou témoignage ne sera publié sans vérification éditoriale et sans examen des autorisations nécessaires.</p><div className="history-actions"><Link className="primary" href="/village">Découvrir le village <span aria-hidden="true">↗</span></Link><Link className="history-secondary-link" href="/#contribuer">Comment contribuer</Link></div></section>
    </main>
    <SiteFooter />
  </>;
}
