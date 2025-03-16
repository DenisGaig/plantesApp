const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`stepper__step ${index === currentStep ? "active" : ""}`}
        >
          <div className="stepper__step-circle">{index + 1}</div>
          <div className="stepper__step-label">{step}</div>
        </div>
      ))}
    </div>
  );
};
export default Stepper;
