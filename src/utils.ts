function DateFormater(date: Date): string {
  const newDate = new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return newDate;
}

function capitalize(str: string): string {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  } else {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export { capitalize, DateFormater };

function normalizeString(str: string): string {
  return str
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques
    .toLowerCase() // Convertit en minuscules
    .trim(); // Supprime les espaces en début et fin de chaîne
}
export { normalizeString };
