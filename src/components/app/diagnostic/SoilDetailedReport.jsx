const SoilDetailedReport = ({ detailedReport, selectedContext }) => {
  if (!detailedReport) {
    return (
      <div className="detailed-report--empty">
        <p>Aucun rapport détaillé disponible.</p>
      </div>
    );
  }

  // Contexte formaté pour l'affichage
  const formattedContext =
    {
      maraichageBio: "maraîchage biologique",
      grandesCultures: "grandes cultures",
      jardinage: "jardinage",
      prairiesAgricoles: "prairie agricole",
      viticulture: "viticulture",
      arboriculture: "arboriculture",
      agroforesterie: "agroforesterie",
      permaculture: "permaculture",
    }[selectedContext] || selectedContext;

  return (
    <div className="detailed-report">
      <div className="detailed-report__header">
        <h2 className="detailed-report__title">Rapport d'Analyse de Sol</h2>
        <p className="detailed-report__context">
          Contexte : <span>{formattedContext}</span>
        </p>
      </div>

      <section className="detailed-report__section">
        <h3 className="detailed-report__section-title">Introduction</h3>
        <p className="detailed-report__text">{detailedReport.introduction}</p>
      </section>

      {detailedReport.indicatorAnalyses.length > 0 && (
        <section className="detailed-report__section">
          <h3 className="detailed-report__section-title">
            Analyse des Indicateurs Clés
          </h3>
          {detailedReport.indicatorAnalyses.map((analysis, index) => (
            <div
              className="detailed-report__subsection"
              key={`indicator-${index}`}
            >
              <h4 className="detailed-report__subsection-title">
                {analysis.title}
              </h4>
              <p className="detailed-report__text">{analysis.text}</p>
            </div>
          ))}
        </section>
      )}

      <section className="detailed-report__section">
        <h3 className="detailed-report__section-title">
          État des Critères de Fertilité
        </h3>
        {Object.entries(detailedReport.criteriaStatuses).map(
          ([key, status], index) => (
            <div className="detailed-report__subsection" key={`status-${key}`}>
              <h4 className="detailed-report__subsection-title">
                {status.title}
              </h4>
              <p className="detailed-report__text">{status.text}</p>
            </div>
          )
        )}
      </section>

      {detailedReport.recommendations.length > 0 && (
        <section className="detailed-report__section">
          <h3 className="detailed-report__section-title">Recommandations</h3>
          <p className="detailed-report__text">
            {detailedReport.recommendationsIntro}
          </p>
          <div className="detailed-report__recommendations-list">
            {detailedReport.recommendations.map((rec, index) => (
              <div
                className="detailed-report__recommendation"
                key={`rec-${index}`}
              >
                <h4 className="detailed-report__subsection-title">
                  {index + 1}. {rec.title}
                </h4>
                <p className="detailed-report__text">{rec.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="detailed-report__footer">
        <p className="detailed-report__footer-text">
          Ce rapport est généré à partir des plantes bio-indicatrices présentes
          dans votre sol. Pour des résultats plus précis, contactez des
          spécialistes en pédologie et en écologie du sol.
        </p>
      </div>
    </div>
  );
};

export default SoilDetailedReport;
