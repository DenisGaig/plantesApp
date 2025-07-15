import { Delete } from "lucide-react";
import { useState } from "react";

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const Search = ({ articles }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter((article) => {
    const commonName = article.data.name?.commonName?.toLowerCase() || "";
    const scientificName =
      article.data.name?.scientificName?.toLowerCase() || "";

    const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());
    const normalizedCommonName = removeAccents(commonName.toLowerCase());
    const normalizedScientificName = removeAccents(
      scientificName.toLowerCase()
    );

    return (
      normalizedCommonName.includes(normalizedSearchTerm) ||
      normalizedScientificName.includes(normalizedSearchTerm)
    );
  });

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Rechercher une plante par son nom commun ou scientifique..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Delete className="delete-icon" onClick={() => handleClearSearch()} />
        )}
      </div>

      <div className="search-results">
        {searchTerm &&
          filteredArticles.map((article) => (
            <div key={article.id} className="article-card">
              <h3>{article.data.name?.commonName || article.data.title}</h3>
              <p>{article.data.name?.scientificName}</p>
              <a href={`/blog/${article.slug}`}>Voir l'article</a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;
