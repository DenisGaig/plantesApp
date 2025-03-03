import CameraComponent from "../../components/app/identification/CameraComponent";

export default function Identification() {
  return (
    <div className="identification">
      <h1>Identification de plantes</h1>
      <p>
        Prenez une photo ou télechargez une image pour identifier une plante.
      </p>
      <CameraComponent />
    </div>
  );
}
