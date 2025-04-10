import { useEffect, useState } from "react";

const SoilQuery = ({ initialData, onDataChange }) => {
  const [formData, setFormData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("soilParameters");
  const tabs = [
    { id: "soilParameters", label: "Paramètres du sol" },
    { id: "soilQuery", label: "Informations complémentaires" },
  ];

  console.log("Initial data: ", initialData);

  // Mettre à jour le parent diagnostic.jsx lorsque les données changent
  useEffect(() => {
    onDataChange(formData);
  }, [formData]);

  // useEffect(() => {
  //   console.log("Updated formData:", formData);
  // }, [formData]);

  const handleInputChange = (section, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  return (
    <div className="soil-query">
      <div className="soil-query__header">
        <h2>Etape 3: Paramètres du sol</h2>
        <p>
          Afin d'enrichir l'analyse et d'améliorer les résultats, vous pouvez
          ajouter des informations sur votre parcelle basées sur vos
          observations et votre expérience.
        </p>
      </div>
      <div className="soil-query__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`soil-query__tab ${
              activeTab === tab.id ? "soil-query__tab--active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="soil-query__content">
        {activeTab === "soilParameters" && (
          <form>
            <div className="soil-query__content__form">
              <h3 className="soil-query__content__form__title">
                Caractéristiques physique
              </h3>
              <div className="soil-query__content__form__row">
                <label htmlFor="soilTexture">
                  Quelle est la texture du sol ?
                </label>
                <select
                  id="soilTexture"
                  name="soilTexture"
                  value={formData.soil.soilTexture}
                  onChange={(e) => handleInputChange("soil", e)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="sableux">Sableux</option>
                  <option value="argileux">Argileux</option>
                  <option value="limoneux">Limoneux</option>
                  <option value="equilibre">Equilibré</option>
                </select>
              </div>
              <div className="soil-query__content__form__row">
                <label htmlFor="soilColor">
                  La couleur du sol est-elle plutôt foncée (brun foncé à noire)
                  ?
                </label>
                <select
                  id="soilColor"
                  name="soilColor"
                  value={formData.soil.soilColor}
                  onChange={(e) => handleInputChange("soil", e)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="fonce">Oui</option>
                  <option value="clair">Non</option>
                </select>
              </div>
              <div className="soil-query__content__form__row">
                <label htmlFor="soilDrainage">
                  Comment décririez-vous le drainage de votre sol après de
                  fortes pluies ?
                </label>
                <select
                  id="soilDrainage"
                  name="soilDrainage"
                  value={formData.soil.soilDrainage}
                  onChange={(e) => handleInputChange("soil", e)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="rapide">
                    Très rapide (l'eau s'infiltre rapidement sans laisser de
                    traces)
                  </option>
                  <option value="bon">
                    Bon (l'eau s'infiltre en quelques heures)
                  </option>
                  <option value="lent">
                    Lent (l'eau reste visible pendant plusieurs heures voire une
                    journée)
                  </option>
                  <option value="tresLent">
                    Très lent (l'eau stagne pendant plus d'une journée)
                  </option>
                </select>
              </div>
              <div className="soil-query__content__form__row">
                <label htmlFor="soilWorkability">
                  Le sol est-il facile à travailler (meuble, s'émiette
                  facilement) ?
                </label>
                <select
                  id="soilWorkability"
                  name="soilWorkability"
                  value={formData.soil.soilWorkability}
                  onChange={(e) => handleInputChange("soil", e)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="facile">Facile</option>
                  <option value="moyen">Moyen</option>
                  <option value="difficile">Difficile</option>
                </select>
              </div>
            </div>
            <div className="soil-query__content__form">
              <h3 className="soil-query__content__form__title">Vie du sol</h3>
              <div className="soil-query__content__form__row">
                <label htmlFor="soilOrganisms">
                  Observez-vous une grande quantité de vers de terre et d'autres
                  organismes vivants dans le sol ?
                </label>
                <select
                  id="soilOrganisms"
                  name="soilOrganisms"
                  value={formData.soil.soilOrganisms}
                  onChange={(e) => handleInputChange("soil", e)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="forte">En abondance</option>
                  <option value="moderee">En quantité modérée</option>
                  <option value="faible">En faible quantité</option>
                  <option value="aucune">Aucune</option>
                </select>
              </div>
            </div>
          </form>
        )}
        {activeTab === "soilQuery" && (
          <form>
            <div className="soil-query__content__form">
              <h3 className="soil-query__content__form__title">
                Historique de la parcelle
              </h3>
              <div className="soil-query__content__form__row">
                <label htmlFor="soilHistory">
                  Quelle est la culture précédente ?
                </label>
                <select
                  id="soilHistory"
                  name="soilHistory"
                  value={formData.history.soilHistory}
                  onChange={(e) => handleInputChange("history", e)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="cereales">Céréales</option>
                  <option value="maraichage">Maraîchage</option>
                  <option value="prairie">Prairie</option>
                  <option value="vigne">Vigne</option>
                  <option value="arboriculture">Arboriculture</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="soil-query__content__form__row">
                <label htmlFor="soilWork">
                  Le sol a t'il été travaillé récemment ?
                </label>
                <select
                  id="soilWork"
                  name="soilWork"
                  value={formData.history.soilWork}
                  onChange={(e) => handleInputChange("history", e)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="labour">Labour profond</option>
                  <option value="superficiel">Travail superficiel</option>
                  <option value="aucun">Non travail</option>
                </select>
              </div>
              <div className="soil-query__content__form__row">
                <label htmlFor="soilAmendement">
                  Quel amendement a t'il été apporté récemment ?
                </label>
                <select
                  id="soilAmendement"
                  name="soilAmendement"
                  value={formData.history.soilAmendement}
                  onChange={(e) => handleInputChange("history", e)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="fumier">Fumier</option>
                  <option value="compost">Compost</option>
                  <option value="engraisVert">Engrais vert</option>
                  <option value="brf">BRF</option>
                  <option value="aucun">Aucun</option>
                </select>
              </div>
              <div className="soil-query__content__form__row">
                <label htmlFor="soilPollution">
                  Y a-t-il eu des activités industrielles ou des déversements de
                  produits chimiques sur cette parcelle dans le passé ?
                </label>
                <select
                  id="soilPollution"
                  name="soilPollution"
                  value={formData.history.soilPollution}
                  onChange={(e) => handleInputChange("history", e)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default SoilQuery;
