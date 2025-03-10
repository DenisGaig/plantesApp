/**
 * Composant de bouton réutilisable avec différentes variantes
 * @param {Object} props - Les propriétés du composant
 * @param {ReactNode} props.children - Le contenu du bouton
 * @param {Function} props.onClick - La fonction à exécuter au clic
 * @param {String} props.variant - La variante du bouton (default, outline, small)
 * @param {Boolean} props.disabled - Si le bouton est désactivé
 * @param {String} props.className - Classes CSS additionnelles
 */
const Button = ({
  children,
  onClick,
  variant = "default",
  disabled = false,
  className = "",
  ...rest
}) => {
  // Déterminer les classes CSS en fonction de la variante
  const getButtonClasses = () => {
    const baseClasses = "button";

    const variantClasses = {
      default: "button-default",
      outline: "button-outline",
      small: "button-small",
    };
    return `${baseClasses} ${
      variantClasses[variant] || variantClasses.default
    } ${className} ${disabled ? "button-disabled" : ""}`;
  };

  return (
    <button
      className={getButtonClasses()}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
export default Button;
