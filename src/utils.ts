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

// Normalisation des chaînes de caractères pour la recherche
function normalizeString(str: string): string {
  return str
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques
    .toLowerCase() // Convertit en minuscules
    .trim(); // Supprime les espaces en début et fin de chaîne
}
export { normalizeString };

// calcule la moyenne d'un tableau de nombres
function average(arr: number[]): number {
  if (!arr.length) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}
export { average };

// Calcule l'écart-type d'un tableau de nombres
function standardDeviation(arr: number[]): number {
  if (!arr.length) return 0;
  const avg = average(arr);
  const squareDiffs = arr.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}
export { standardDeviation };

// Calcule les percentiles
function calculatePercentiles(values: number[], percentiles = [25, 50, 75]) {
  const sortedValues = [...values].sort((a, b) => a - b);
  const results: Record<string, number> = {}; // ou { [key: `p${number}`]: number };

  percentiles.forEach((p) => {
    const index = Math.floor((sortedValues.length * p) / 100);
    results[`p${p}`] = sortedValues[index];
  });

  return results;
}
export { calculatePercentiles };
