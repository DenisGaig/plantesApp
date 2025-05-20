export default function Home() {
  console.log("HOME bien monté");
  return (
    <div className="home">
      <h1>Apprends à lire le sol grâce aux plantes bio-indicatrices </h1>
      <p className="home__text">
        Bienvenue sur la première application dédiée au diagnostic de sol par
        l'observation des plantes spontanées. <br />
        Grâce à une base de données riche de centaines d'espèces
        bio-indicatrices, identifiables en quelques clics, mon outil vous aidera
        à mieux comprendre les messages de votre sol.
        <br /> Que vous soyez jardinier curieux, agriculteur en quête
        d'autonomie ou botaniste de terrain, cette application vous offre une
        approche innovante, à la croisée de la botanique et de l'agronomie.
        <br />
        Chaque diagnostic repose sur une méthodologie inspirée des travaux de
        Gérard Ducerf et propose de manière expérimentale, des pistes
        d’amélioration agroécologique adaptées à votre contexte.
        <br />
        <br />
        Explorez, apprenez, testez : la nature vous parle. Écoutez-la.
      </p>
    </div>
  );
}
