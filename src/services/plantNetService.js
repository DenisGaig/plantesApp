// Service pour l'API PlantNet
const plantNetService = () => {
  const apiKey = import.meta.env.PUBLIC_API_KEY_PLANTNET;
  const apiUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`;
  console.log("API Key:", apiKey);
  console.log("API URL:", apiUrl);

  const identifyPlant = async (image) => {
    try {
      console.log("IMAGE RECUE", image);
      const formData = new FormData();
      formData.append("images", image);

      console.log("FormData:", [...formData.entries()]); // Affiche les entrées du FormData

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de l'identification de la plante: ", error);
      return null;
    }
  };
  return { identifyPlant };
};
export default plantNetService;
