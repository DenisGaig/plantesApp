import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import plantesData from "../../../data/plantes.json";
import useGlobalSearch from "../../../hooks/useGlobalSearch";

const GlobalSearchBar = () => {
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    performSearch,
    clearSearch,
    handleSelectSuggestion,
    isSearching,
    showSuggestions,
    setShowSuggestions,
    getSuggestions,
    recentSearches,
    setRecentSearches,
    highlightText,
  } = useGlobalSearch(plantesData);

  // console.log("Data:", plantesData);

  // Gestion de la saisie dans le champ de recherche
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 1) {
      performSearch(value);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  // Soumettre la recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      performSearch(searchTerm);

      // Ajouter aux recherches récentes
      if (!recentSearches.includes(searchTerm.trim())) {
        setRecentSearches((prev) => [searchTerm.trim(), ...prev].slice(0, 5));
      }

      setShowSuggestions(false);
    }
  };

  // Gestion du clic en dehors des suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="plant-search">
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Rechercher par nom, propriété, famille..."
              className="search-input"
              onFocus={() =>
                searchTerm.trim().length > 1 && setShowSuggestions(true)
              }
            />
            <Search className="search-icon" size={18} />

            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="clear-button"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button type="submit" className="sr-only">
            Rechercher
          </button>
        </form>

        {/* Suggestions de recherche */}
        {showSuggestions && (
          <div ref={suggestionsRef} className="suggestions-panel">
            {isSearching ? (
              <div className="searching-message">Recherche en cours...</div>
            ) : (
              <ul className="suggestions-list">
                {getSuggestions().map((suggestion, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    dangerouslySetInnerHTML={{
                      __html: highlightText(suggestion, searchTerm),
                    }}
                  />
                ))}

                {getSuggestions().length === 0 && recentSearches.length > 0 && (
                  <>
                    <li className="recent-searches-header">
                      Recherches récentes
                    </li>
                    {recentSearches.map((recent, index) => (
                      <li
                        key={`recent-${index}`}
                        className="recent-search-item"
                        onClick={() => handleSelectSuggestion(recent)}
                      >
                        <span className="recent-icon">↩</span> {recent}
                      </li>
                    ))}
                  </>
                )}

                {getSuggestions().length === 0 &&
                  recentSearches.length === 0 && (
                    <li className="no-suggestions-message">
                      Aucune suggestion
                    </li>
                  )}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Résultats de recherche */}
      {searchResults.length > 0 && !showSuggestions && (
        <div className="search-results">
          <h2 className="results-header">Résultats ({searchResults.length})</h2>
          <div className="results-list">
            {searchResults.map((plant) => (
              <div key={plant.id} className="plant-card">
                <div className="plant-card-header">
                  <div className="plant-name-container">
                    <h3
                      className="scientific-name"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(plant.scientificName, searchTerm),
                      }}
                    />
                    <p
                      className="common-name"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(plant.commonName, searchTerm),
                      }}
                    />
                  </div>
                  <div className="plant-family">
                    Famille:{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(plant.family, searchTerm),
                      }}
                    />
                  </div>
                </div>

                {/* <div className="plant-description">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: highlightText(plant.description, searchTerm),
                    }}
                  />
                </div>

                <div className="plant-indicators">
                  <div className="indicators-header">Bio-indications:</div>
                  <div className="indicators-list">
                    {plant.indicators.map((indicator, i) => (
                      <span
                        key={i}
                        className="indicator-badge"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(indicator, searchTerm),
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="plant-keywords">
                  <div className="keywords-list">
                    {plant.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="keyword"
                        dangerouslySetInnerHTML={{
                          __html: `${i > 0 ? "• " : ""}${highlightText(
                            keyword,
                            searchTerm
                          )}`,
                        }}
                      />
                    ))}
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      )}

      {searchTerm &&
        searchResults.length === 0 &&
        !isSearching &&
        !showSuggestions && (
          <div className="no-results">
            <p className="no-results-message">
              Aucun résultat pour "{searchTerm}"
            </p>
            <p className="no-results-hint">
              Essayez d'autres termes ou vérifiez l'orthographe
            </p>
          </div>
        )}
    </div>
  );
};

export default GlobalSearchBar;
