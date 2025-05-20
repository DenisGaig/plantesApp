import {
  ClipboardCheck,
  FlaskConical,
  Home,
  ListCheck,
  LucideSearch,
  Menu,
  Scan,
  Sprout,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import "./navbar.scss";

const verticalNavbar = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    {
      id: "home",
      link: "/",
      label: "Home",
      icon: Home,
    },
    {
      id: "methode",
      link: "/methode",
      label: "Méthode",
      icon: ListCheck,
    },
    {
      id: "identification",
      link: "/identification",
      label: "Identification",
      icon: Scan,
    },
    {
      id: "plants",
      link: "/plants",
      label: "Base de données",
      icon: LucideSearch,
    },
    {
      id: "diagnostic",
      link: "/diagnostic",
      label: "Diagnostic",
      icon: Sprout,
    },
    {
      id: "resultats",
      link: "/resultats",
      label: "Résultats",
      icon: ClipboardCheck,
    },
    {
      id: "calibration",
      link: "/calibration",
      label: "Calibration",
      icon: FlaskConical,
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav
      className={`navbar ${isMobile ? "navbar--mobile" : "navbar--desktop"} ${
        isExpanded ? "navbar--expanded" : ""
      }`}
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
    >
      {isMobile && (
        <button className="navbar__toggle" onClick={toggleMenu}>
          {!isExpanded ? (
            <Menu className="navbar__toggle-icon" />
          ) : (
            <X className="navbar__toggle-icon" />
          )}
        </button>
      )}
      <div className="navbar__items">
        {navItems.map((item) => (
          <NavLink
            className={`navbar__item ${
              activeItem === item.id ? "navbar__item--active" : ""
            }`}
            to={"/app" + item.link}
            key={item.id}
            onClick={() => setActiveItem(item.id)}
          >
            <item.icon className="navbar__item-icon" />
            <span className="navbar__item-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default verticalNavbar;
