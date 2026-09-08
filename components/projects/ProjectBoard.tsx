"use client";
import Link from "next/link";
import { useState } from "react";
import { villageProjects } from "@/data/village-projects";

const filters = [["all", "Tous"], ["listening", "À écouter"], ["documenting", "À documenter"], ["mobilizing", "Mobilisation"], ["active", "En cours"]] as const;

export default function ProjectBoard() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? villageProjects : villageProjects.filter(project => project.statusKey === filter);
  return <><nav className="projects-filters" aria-label="Filtrer les projets">{filters.map(([key,label]) => <button key={key} onClick={() => setFilter(key)} aria-pressed={filter === key}>{label}</button>)}</nav><div className="projects-board" aria-live="polite">{visible.map((project,index) => <article key={project.slug}>
    <header><span>{String(index + 1).padStart(2,"0")}</span><small>{project.domain}</small><i className={project.statusKey}>{project.status}</i></header><h2>{project.title}</h2><p>{project.text}</p><div><small>Ce qui peut aider maintenant</small><ul>{project.needs.map(need => <li key={need}>{need}</li>)}</ul></div><Link href={`/contribuer?category=events_village_life&title=${encodeURIComponent(project.title)}#envoyer`}>Apporter quelque chose <span aria-hidden="true">↗</span></Link>
  </article>)}</div></>;
}
