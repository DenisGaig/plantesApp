import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Button from "../shared/Button.jsx";

const SoilAnalyzer = ({
  selectedPlants,
  selectedCoverages,
  selectedFormData,
}) => {
  console.log("Inputs: ", selectedPlants, selectedCoverages, selectedFormData);
  // Format des étiquettes pour le graphique circulaire
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <div className="soil-analyzer">
      <h2>Etape 4: Analyse du sol</h2>
      <div className="soil-analyzer__collectedDatas">
        <h3>Données collectées</h3>
        <div className="soil-analyzer__collectedDatas__container">
          <div className="soil-analyzer__collectedDatas__plants">
            <h4>Plantes identifiées</h4>
            <div className="soil-analyzer__collectedDatas__plants__chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={selectedPlants}
                    dataKey="coverage"
                    nameKey="plant"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {selectedPlants.map((plant) => (
                      <Cell key={`cell-${plant.plant}`} fill={plant.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    labelFormatter={(index) =>
                      `${selectedPlants[index].scientificName} (${selectedPlants[index].commonName})`
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="soil-analyzer__collectedDatas__soil-parameters"></div>
          <div className="soil-analyzer__collectedDatas__history"></div>
        </div>
      </div>
      <div className="soil-analyzer__collectedDatas__action">
        <Button onClick={() => {}}>Analyser</Button>
      </div>
    </div>
  );
};
export default SoilAnalyzer;
