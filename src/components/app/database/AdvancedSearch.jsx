import {
  Download,
  Grid3x3,
  List,
  Save,
  Split,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlantDatabase } from "../../../hooks/usePlantDatabase.js";
import Button from "../shared/Button";
import FilterBar from "../shared/GenericFilterBar.jsx";
import PlantList from "./PlantList";

/**
 * Composant AdvancedSearch pour effectuer des recherches avancées dans la base de données des plantes.
 * Permet de filtrer les plantes par différents critères et d'afficher les résultats sous forme de liste ou de grille.
 *
 */

const AdvancedSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeFilters, setActiveFilters] = useState({});
  const [searchLogic, setSearchLogic] = useState("AND");
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  // Ajout pour sauvegarder les recherches
  const [formValues, setFormValues] = useState({
    name: "",
    latinName: "",
    primaryBiotope: "",
    secondaryBiotope: "",
    family: "",
    isEdible: "",
    isMedicinal: "",
  });

  const {
    searchPlants,
    loading,
    filteredPlants,
    setSearchLogic: updateSearchLogic,
  } = usePlantDatabase();

  const popularSearches = [
    { name: "Comestibles", filters: { isEdible: true } },
    { name: "Médicinales", filters: { isMedicinal: true } },
    { name: "Forêt", filters: { primaryBiotope: "foret" } },
    { name: "Prairie", filters: { primaryBiotope: "prairie" } },
    {
      name: "Zone humide",
      filters: { primaryBiotope: "zone humide" },
    },
    {
      name: "Zone cultivée",
      filters: { primaryBiotope: "culture" },
    },
  ];

  // Définition des filtres disponibles pour la recherche avancée
  const advancedFilters = [
    {
      id: "name",
      label: "",
      type: "text",
      placeholder:
        "Rechercher le nom d'une plante en français (ex: Pissenlit...)",
    },
    {
      id: "latinName",
      label: "Nom latin",
      type: "text",
      placeholder: "Ex: Taraxacum officinale",
    },
    {
      id: "primaryBiotope",
      label: "Biotope principal",
      type: "select",
      options: [
        { value: "foret", label: "Forêt" },
        { value: "prairie", label: "Prairie" },
        { value: "zone humide", label: "Zone humide" },
        { value: "culture", label: "Zone cultivée" },
        { value: "friche", label: "Friche" },
        { value: "lisiere forestiere", label: "Lisière forestière" },
        { value: "clairiere forestiere", label: "Clairière forestière" },
        { value: "maquis garrigues", label: "Maquis et garrigues" },
        { value: "dunes littorales", label: "Dunes littorales" },
        { value: "vallees alluviales", label: "Vallées alluviales" },
        { value: "pelouses calcaires", label: "Pelouses calcaires" },
        { value: "oueds mediterraneens", label: "Oueds méditerranéens" },
        { value: "rochers eboulis", label: "Rochers et éboulis" },
        { value: "landes acides", label: "Landes acides" },
        { value: "bordures cours d'eau", label: "Bordures de cours d'eau" },
      ],
    },
    {
      id: "secondaryBiotope",
      label: "Biotope secondaire",
      type: "select",
      options: [
        { value: "haies", label: "Haies" },
        { value: "friches", label: "Friches" },
        { value: "pres bois", label: "Prés bois" },
        { value: "coupe bois", label: "Coupe de bois" },
        { value: "prairies agricoles", label: "Prairies agricoles" },
        { value: "terres remuees", label: "Terres remuées" },
        { value: "talus", label: "Talus" },
        { value: "bords chemins", label: "Bords des chemins et des routes" },
        { value: "vignes vergers", label: "Vignes et vergers" },
        { value: "parcs chevaux", label: "Parcs à chevaux" },
        { value: "fosses canaux", label: "Fossés et canaux" },
        { value: "terrains vagues", label: "Terrains vagues" },
        { value: "cultures irriguees", label: "Cultures irriguées" },
        { value: "golfs", label: "Golfs" },
        { value: "jardins", label: "Jardins" },
        { value: "maraichages", label: "Maraîchages" },
        { value: "cours de ferme", label: "Cours de ferme" },
        {
          value: "environ villages",
          label: "Environ des villages et des habitations",
        },
      ],
    },
    {
      id: "isEdible",
      label: "Comestible",
      type: "checkbox",
    },
    {
      id: "isMedicinal",
      label: "Médicinale",
      type: "checkbox",
    },
  ];

  useEffect(() => {
    // Récupérer les filtres actifs depuis l'URL
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};

    // Parcourir tous les paramètres et les ajouter aux filtres
    for (const [key, value] of searchParams.entries()) {
      // Convertir les valeurs booléennes
      if (value === "true") urlFilters[key] = true;
      else if (value === "false") urlFilters[key] = false;
      else urlFilters[key] = value;
    }
    // Récupérer la logique de recherche (AND/OR) depuis l'URL
    const urlLogic = searchParams.get("searchLogic") || "AND";
    // Supprimer la clé "searchLogic" de urlFilters
    delete urlFilters["searchLogic"];
    console.log("URL Filters:", urlFilters);
    // Si des filtres sont présents dans l'URL, les appliquer et mettre à jour l'état du formulaire
    if (Object.keys(urlFilters).length > 0) {
      setFormValues(urlFilters);
      setActiveFilters(urlFilters);
      setSearchLogic(urlLogic);
      // handleApplyFilters(urlFilters);
    }
  }, [location.search]);

  useEffect(() => {
    // Appliquer les filtres actifs lorsque le composant est monté ou que les filtres actifs changent
    if (Object.keys(activeFilters).length > 0) {
      handleApplyFilters(activeFilters);
    }
  }, [activeFilters, searchLogic]);

  // Applique les filtres et effectue la recherche
  const handleApplyFilters = async (filters) => {
    // Mettre à jour les valeurs du formulaire
    setFormValues(filters);

    // Conserver une copie locale des filtres actifs
    setActiveFilters(filters);

    console.log("Applying filters:", filters);

    // Filtrer les valeurs vides ou nulles et traiter spécialement isEdible
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        // Si c'est isEdible et que c'est false, on le considère comme vide
        if (key === "isEdible" && value === false) {
          return false; // Exclure ce filtre
        }
        return value !== "" && value !== null && value !== undefined;
      })
    );

    console.log("Valid filters being sent to search:", validFilters);

    // Si aucun filtre valide n'est appliqué, définir les résultats comme un tableau vide
    if (Object.keys(validFilters).length === 0) {
      console.log("No filters applied, setting empty results");
      setSearchResults([]);
      return;
    }
    // Mettre à jour la logique de recherche
    updateSearchLogic(searchLogic);

    // ------------------------------------------------------------------------
    // Construire les paramètres de recherche pour l'URL
    const params = new URLSearchParams();

    // Ajouter les filtres valides à l'URL
    Object.entries(validFilters).forEach(([key, value]) => {
      params.set(key, value);
    });

    // Ajouter la logique de recherche à l'URL
    params.set("searchLogic", searchLogic);
    // Mettre à jour l'URL avec les nouveaux paramètres sans recharger la page
    navigate(`/app/plants?${params.toString()}`, { replace: true });

    // ------------------------------------------------------------------------

    try {
      const results = await searchPlants({
        filters: validFilters,
        logic: searchLogic,
      });
      console.log("SET Search results");

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching plants:", error);
    }
  };

  const handlePopularSearchClick = (search) => {
    // Verifier si tous les filtres de cette recherche sont déjà actifs
    const isExactlyActive = Object.entries(search.filters).every(
      ([key, value]) => activeFilters[key] === value
    );
    // Si ce tag est déjà actif, on le désactive en supprimant les filtres
    if (isExactlyActive) {
      // Si les filtres sont déjà actifs, désactiver les filtres
      const updatedFilters = { ...activeFilters };
      // Supprimer les clés des filtres de la recherche populaire
      Object.keys(search.filters).forEach((key) => {
        delete updatedFilters[key];
      });
      console.log("Désactiver les filtres", updatedFilters);
      // Mettre à jour les valeurs du formulaire et les filtres actifs
      setFormValues(updatedFilters);
      setActiveFilters(updatedFilters);
      handleApplyFilters(updatedFilters);
      return;
    }

    // Obtenir les filtres actuels
    let updatedFilters = { ...activeFilters };

    if (searchLogic === "OR") {
      // Pour la logique OR, on peut simplement combiner les filtres
      // en préservant les valeurs existantes et en ajoutant les nouvelles
      Object.entries(search.filters).forEach(([key, value]) => {
        // Si le filtre est déjà présent et qu'il a une valeur différente dans la recherche populaire
        if (
          updatedFilters[key] !== undefined &&
          updatedFilters[key] !== value
        ) {
          // Pour les valeurs booléennes (comme isEdible, isMedicinal), on les active si l'un est true
          if (
            typeof value === "boolean" &&
            typeof updatedFilters[key] === "boolean"
          ) {
            updatedFilters[key] = updatedFilters[key] || value;
          }
          // Pour les valeurs textuelles, on pourrait les gérer différemment si nécessaire
          // (par exemple, les concaténer ou créer un tableau)
        } else {
          // Si le filtre n'existe pas encore, l'ajouter simplement
          updatedFilters[key] = value;
        }
      });
    } else {
      // Pour la logique AND, on peut soit remplacer les filtres existants
      // soit ajouter seulement les nouveaux filtres qui ne sont pas encore définis
      // Cela dépend de votre cas d'usage spécifique
      updatedFilters = { ...updatedFilters, ...search.filters };
    }

    console.log("Popular search clicked:", search);
    console.log("Combined filters:", updatedFilters);

    // Mettre à jour les valeurs du formulaire avec les filtres combinés
    setFormValues(updatedFilters);
    setActiveFilters(updatedFilters);

    // Appliquer immédiatement la recherche
    handleApplyFilters(updatedFilters);
  };

  // Réinitialise les filtres
  const handleResetFilters = () => {
    setFormValues({
      name: "",
      latinName: "",
      primaryBiotope: "",
      secondaryBiotope: "",
      family: "",
      isEdible: "",
      isMedicinal: "",
    });
    setSearchLogic("AND");
    setActiveFilters({});
    setSearchResults([]);
  };

  // Sauvegarde la recherche actuelle
  const saveCurrentSearch = () => {
    if (!searchName.trim()) return;

    const newSavedSearch = {
      id: Date.now(),
      name: searchName,
      filters: { ...activeFilters },
      logic: searchLogic,
    };

    setSavedSearches([...savedSearches, newSavedSearch]);
    setSearchName("");
  };

  // Charge une recherche sauvegardée
  const loadSavedSearch = (savedSearch) => {
    setFormValues(savedSearch.filters);
    setActiveFilters(savedSearch.filters);
    setSearchLogic(savedSearch.logic);

    // Appliquer immédiatement la recherche
    handleApplyFilters(savedSearch.filters);
  };

  return (
    <div className="advanced-search">
      {/* <div className="advanced-search__intuitive-search-bar">
        <Search />
        <input
          type="text"
          name=""
          id=""
          placeholder="Rechercher une plante ..."
        />
      </div> */}
      <div className="advanced-search__search-options">
        <div className="advanced-search__search-options__title">
          <Split />
          <span>Logique de recherche</span>
        </div>
        <div className="advanced-search__search-options__toggle-buttons">
          <button
            className={`toggle-button ${searchLogic === "AND" ? "active" : ""}`}
            onClick={() => setSearchLogic("AND")}
          >
            Toutes les conditions (ET)
          </button>
          <button
            className={`toggle-button ${searchLogic === "OR" ? "active" : ""}`}
            onClick={() => setSearchLogic("OR")}
          >
            Au moins une condition (OU)
          </button>
        </div>
      </div>
      <div className="advanced-search__popular-searches">
        <div className="advanced-search__popular-searches__title">
          <TrendingUp />
          <span>Recherches populaires</span>
        </div>
        <div className="advanced-search__popular-searches__tags">
          {popularSearches.map((search, index) => {
            const isActive = Object.entries(search.filters).every(
              ([key, value]) => activeFilters[key] === value
            );
            return (
              <button
                key={index}
                onClick={() => handlePopularSearchClick(search)}
                className={isActive ? "active" : ""}
              >
                {search.name} {isActive && <X />}
              </button>
            );
          })}
        </div>
      </div>
      <FilterBar
        filters={advancedFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        autoApply={false}
        initialValues={formValues}
        onChange={setFormValues}
      />
      {/* Actions de la barre de recherche */}
      <div className="advanced-search__view-actions">
        <div className="advanced-search__view-actions__view-mode">
          <button
            className={`toggle-button ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List />
          </button>
          <button
            className={`toggle-button ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 />
          </button>
        </div>
        <div className="advanced-search__view-actions__actions">
          <Save />
          <Download />
        </div>
      </div>
      {/* Sauvegarde et chargement des recherches */}
      <div className="advanced-search__saved-results">
        <h3>Recherches sauvegardées</h3>

        <div className="advanced-search__saved-results__save-new-search">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nom de la recherche"
          />
          <Button onClick={saveCurrentSearch} disabled={!searchName.trim()}>
            Sauvegarder cette recherche
          </Button>
        </div>

        {savedSearches.length > 0 && (
          <ul className="saved-search-list">
            {savedSearches.map((search) => (
              <li key={search.id} className="saved-search-item">
                <span>{search.name}</span>
                <Button variant="small" onClick={() => loadSavedSearch(search)}>
                  Charger
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Résultats de recherche */}
      <div className="advanced-search__search-results">
        {loading ? (
          <p>Recherche en cours...</p>
        ) : (
          <>
            <h3>Résultats de recherche ({searchResults.length} plantes)</h3>
            <PlantList filteredPlants={searchResults} viewMode={viewMode} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
