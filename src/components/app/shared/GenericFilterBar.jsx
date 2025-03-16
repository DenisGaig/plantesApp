import { useEffect, useState } from "react";
import Button from "../shared/Button";

/**
 * Composant UI générique pour afficher une barre de filtres réutilisable
 * @param {Object[]} filters - Configuration des filtres à afficher
 * @param {Function} onApplyFilters - Callback appelé quand les filtres sont appliqués
 * @param {Function} onResetFilters - Callback appelé quand les filtres sont réinitialisés
 * @param {Boolean} autoApply - Si true, applique les filtres à chaque changement sans bouton
 */
const FilterBar = ({
  filters = [],
  onApplyFilters,
  onResetFilters,
  autoApply = false,
  initialValues = {},
  onChange = () => {},
}) => {
  const [filterValues, setFilterValues] = useState({ initialValues });
  const [expanded, setExpanded] = useState(false);

  // Initialise les valeurs par défaut des filtres
  // useEffect(() => {
  //   const defaultValues = {};
  //   filters.forEach((filter) => {
  //     defaultValues[filter.id] = filter.defaultValue || "";
  //   });
  //   setFilterValues(defaultValues);
  // }, [filters]);

  // Mettre à jour quand les initialValues changent
  useEffect(() => {
    setFilterValues(initialValues);
  }, [initialValues]);

  // Gère les changements dans les valeurs des filtres
  const handleFilterChange = (filterId, value) => {
    const newValues = { ...filterValues, [filterId]: value };
    setFilterValues(newValues);

    // Applique automatiquement si autoApply est activé
    if (autoApply) {
      onApplyFilters(newValues);
    }
  };

  // Réinitialise tous les filtres
  const handleReset = () => {
    const defaultValues = {};
    filters.forEach((filter) => {
      defaultValues[filter.id] = filter.defaultValue || "";
    });
    setFilterValues(defaultValues);

    if (onResetFilters) {
      onResetFilters();
    } else if (onApplyFilters) {
      onApplyFilters(defaultValues);
    }
  };

  // Applique les filtres actuels
  const handleApply = () => {
    onApplyFilters(filterValues);
  };

  // Génère le contrôle UI approprié selon le type de filtre
  const renderFilterControl = (filter) => {
    const { id, type, label, options = [], placeholder = "" } = filter;

    switch (type) {
      case "text":
        return (
          <input
            type="text"
            id={id}
            value={filterValues[id] || ""}
            onChange={(e) => handleFilterChange(id, e.target.value)}
            placeholder={placeholder}
            className="generic-filter-input"
          />
        );

      case "select":
        return (
          <select
            id={id}
            value={filterValues[id] || ""}
            onChange={(e) => handleFilterChange(id, e.target.value)}
            className="generic-filter-select"
          >
            <option value="">Tous</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            id={id}
            checked={filterValues[id] || false}
            onChange={(e) => handleFilterChange(id, e.target.checked)}
            className="generic-filter-checkbox"
          />
        );

      case "range":
        return (
          <div className="generic-filter-range-filter">
            <input
              type="range"
              id={id}
              min={filter.min || 0}
              max={filter.max || 100}
              value={filterValues[id] || filter.min || 0}
              onChange={(e) =>
                handleFilterChange(id, parseInt(e.target.value, 10))
              }
              className="generic-filter-range"
            />
            <span className="generic-filter-range-value">
              {filterValues[id] || filter.min || 0}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  const hasActiveFilters = Object.values(filterValues).some(
    (value) =>
      value !== "" && value !== false && value !== null && value !== undefined
  );

  return (
    <div
      className={`generic-filter-bar ${expanded ? "expanded" : "collapsed"} ${
        hasActiveFilters ? "has-active-filters" : ""
      }`}
    >
      <div
        className="generic-filter-bar__header"
        data-active-filters={
          hasActiveFilters
            ? `${Object.values(filterValues).filter((v) => v).length} actifs`
            : ""
        }
      >
        <div className="generic-filter-bar__header__title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sliders-horizontal"
          >
            <line x1="21" x2="14" y1="4" y2="4" />
            <line x1="10" x2="3" y1="4" y2="4" />
            <line x1="21" x2="12" y1="12" y2="12" />
            <line x1="8" x2="3" y1="12" y2="12" />
            <line x1="21" x2="16" y1="20" y2="20" />
            <line x1="12" x2="3" y1="20" y2="20" />
            <line x1="14" x2="14" y1="2" y2="6" />
            <line x1="8" x2="8" y1="10" y2="14" />
            <line x1="16" x2="16" y1="18" y2="22" />
          </svg>
          <h3>Filtres avancés</h3>
        </div>
        <button
          className="toggle-expand-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Réduire" : "Développer"}
        </button>
      </div>

      <div className="generic-filter-bar__controls">
        {filters.map((filter) => (
          <div key={filter.id} className="filter-item">
            <label htmlFor={filter.id}>{filter.label}</label>
            {renderFilterControl(filter)}
          </div>
        ))}
      </div>

      {!autoApply && (
        <div className="generic-filter-bar__actions">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button variant="outline" onClick={handleApply}>
            Appliquer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
