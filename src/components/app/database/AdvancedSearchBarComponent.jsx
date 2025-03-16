import { Search } from "lucide-react";

const AdvancedSearchBarComponent = ({
  searchTerm,
  setSearchTerm,
  suggestions,
  isSearching,
  searchResults,
  recentSearches,
  handleSearch,
  performSearch,
  clearSearch,
}) => {
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  const handleSearchChange = (e) => {
    e.preventDefault();
  };
  const handleSelectSuggestion = (suggestion) => {
    e.preventDefault();
  };

  return (
    <div className="advanced-search-bar">
      <div className="advanced-search-bar__content">
        <form onSubmit={handleSearchSubmit}>
          <div className="advanced-search-bar__content__form">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Rechercher par nom, propriété, famille..."
              className="advanced-search-bar__content__form__input"
            />
            <Search size={18} />

            {/* Suggestions de recherches */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="advanced-search-bar__content__form__suggestions"
              >
                {isSearching ? (
                  <div className="advanced-search-bar__content__form__suggestions__loading">
                    Recherche en cours...
                  </div>
                ) : (
                  <ul className="advanced-search-bar__content__form__suggestions__list">
                    {getSuggestions().map((suggestion, index) => (
                      <li
                        key={index}
                        className="advanced-search-bar__content__form__suggestions__list__item"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        dangerouslySetInnerHTML={{
                          __html: highlightText(suggestion, searchTerm),
                        }}
                      />
                    ))}
                    {getSuggestions().length === 0 &&
                      recentSearches.length > 0 && (
                        <>
                          {" "}
                          <li className="advanced-search-bar__content__form__suggestions__list__item__recent">
                            Recherches récentes
                          </li>
                          {recentSearches.map((recent, index) => (
                            <li
                              key={index}
                              className="advanced-search-bar__content__form__suggestions__list__item__recent__item"
                              onClick={() => handleSelectSuggestion(recent)}
                            ></li>
                          ))}
                        </>
                      )}
                    {getSuggestions().length === 0 &&
                      recentSearches.length === 0 && (
                        <li className="advanced-search-bar__content__form__suggestions__list__item__no-suggestions">
                          Aucune suggestion
                        </li>
                      )}
                  </ul>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
