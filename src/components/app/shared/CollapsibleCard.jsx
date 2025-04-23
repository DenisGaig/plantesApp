import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// Version 1 : avec un seul composant pour toutes les cartes dépliables
// Composant réutilisable pour une carte dépliable
const CollapsibleCard = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-card">
      <div
        className="collapsible-card__header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <span className="collapsible-card__icon">{icon}</span>}
        <h3 className="collapsible-card__title">{title}</h3>
        <span className="collapsible-card__toggle">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </div>

      {isOpen && <div className="collapsible-card__content">{children}</div>}
    </div>
  );
};

// Version 2 : Avec animation de hauteur et opacité (plus complexe)
// const CollapsibleCard = ({ id, title, icon, children, isOpen, onToggle }) => {
//   const contentRef = useRef(null);
//   const firstRender = useRef(true);

//   // Gestion de la hauteur pour l'animation
//   useEffect(() => {
//     if (firstRender.current) {
//       firstRender.current = false;
//       return;
//     }

//     const content = contentRef.current;
//     if (!content) return;

//     if (isOpen) {
//       // Mesurer la hauteur naturelle
//       const height = content.scrollHeight;

//       // Animation d'ouverture
//       content.style.height = "0px";
//       content.style.opacity = "0";

//       // Force reflow
//       content.offsetHeight;

//       content.style.height = `${height}px`;
//       content.style.opacity = "1";

//       // Réinitialiser après l'animation
//       const onTransitionEnd = () => {
//         if (isOpen) content.style.height = "auto";
//         content.removeEventListener("transitionend", onTransitionEnd);
//       };

//       content.addEventListener("transitionend", onTransitionEnd);
//     } else {
//       // Animation de fermeture
//       const height = content.scrollHeight;
//       content.style.height = `${height}px`;

//       // Force reflow
//       content.offsetHeight;

//       content.style.height = "0px";
//       content.style.opacity = "0";
//     }
//   }, [isOpen]);

//   return (
//     <div className={`collapsible-card ${isOpen ? "open" : "closed"}`}>
//       <div
//         className="collapsible-card__header"
//         onClick={onToggle}
//         aria-expanded={isOpen}
//         aria-controls={`content-${id}`}
//       >
//         {icon && <span className="collapsible-card__icon">{icon}</span>}
//         <h3 className="collapsible-card__title">{title}</h3>
//         <span className="collapsible-card__toggle">
//           {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//         </span>
//       </div>

//       <div
//         ref={contentRef}
//         id={`content-${id}`}
//         className="collapsible-card__content"
//         aria-hidden={!isOpen}
//         style={{
//           height: firstRender.current ? (isOpen ? "auto" : "0px") : undefined,
//           opacity: firstRender.current ? (isOpen ? "1" : "0") : undefined,
//           overflow: "hidden",
//           transition: "height 300ms ease-in-out, opacity 250ms ease-in-out",
//         }}
//       >
//         <div className="collapsible-card__inner-content">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default CollapsibleCard;

export default CollapsibleCard;
