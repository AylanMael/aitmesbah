"use client";

import { contributionTypes } from "@/data/home";

export default function ContributionFormClient() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>
        Je souhaite partager
        <select defaultValue="">
          <option value="" disabled>
            Choisir une contribution
          </option>
          {contributionTypes.map((type) => (
            <option key={type.label}>{type.label}</option>
          ))}
        </select>
      </label>
      <label>
        Mon adresse e-mail
        <input type="email" placeholder="votre@email.com" />
      </label>
      <button className="primary">Commencer ma contribution →</button>
      <small>
        Formulaire de démonstration — aucune donnée n’est envoyée.
      </small>
    </form>
  );
}
