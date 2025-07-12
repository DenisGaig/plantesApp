import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useState } from "react";

const SoilCharts = ({
  chartType,
  selectedPlants,
  selectedCoverages,
  selectedCoefficients,
  compositesResults,
  recommendations,
  onSectionClick,
}) => {
  // Etat pour suivre la section active du camembert
  const [activeIndex, setActiveIndex] = useState(null);

  // Ajouter cette fonction helper si elle n'existe pas déjà
  function normalizeValue(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  // Préparation des données pour les barres
  const plantData = selectedPlants
    ? selectedPlants.map((plant) => ({
        name: plant.commonName,
        density: Number(selectedCoverages[plant.id] || 0),
        coefficient: Number(selectedCoefficients[plant.id] || 0),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        id: plant.id,
      }))
    : [];

  const sortedData = [...plantData].sort((a, b) => b.density - a.density);

  console.log("Plant Data: ", plantData);

  // Préparation des données pour le radar chart
  const prepareRadarData = () => {
    if (!compositesResults || !recommendations) return [];

    const radarData = [];

    Object.keys(compositesResults).forEach((key) => {
      // Vérifier si la clé existe dans les recommandations
      if (!recommendations[key]) return;

      console.log(
        "Equilibre CN Avant Normalisation: ",
        compositesResults["equilibreCN"]
      );

      const value =
        key === "equilibreCN"
          ? normalizeValue(compositesResults[key], 8, 40, 0, 10)
          : compositesResults[key];
      const rec = recommendations[key];

      console.log(key === "equilibreCN" ? value : "");

      // Conversion des clés en noms affichables
      let displayName = key;
      if (key === "vieMicrobienne") displayName = "Vie Microbienne";
      else if (key === "complexeArgiloHumique")
        displayName = "Complexe Argilo-Humique";
      else if (key === "matiereOrganique") displayName = "Matière Organique";
      else if (key === "equilibreCN") displayName = "Équilibre C/N";
      else if (key === "structurePorosite")
        displayName = "Structure et Porosité";

      radarData.push({
        key: key,
        subject: displayName,
        value: value,
        type: rec.type,
        fullMark: 10,
      });
    });

    return radarData;
  };

  // Préparation des données pour le graphique en camembert
  const preparePieData = () => {
    if (!compositesResults || !recommendations) return [];

    const pieData = [];

    Object.keys(compositesResults).forEach((key) => {
      // Vérifier si la clé existe dans les recommandations
      if (!recommendations[key]) return;

      const value = compositesResults[key];
      const rec = recommendations[key];

      // Conversion des clés en noms affichables
      let displayName = key;
      if (key === "vieMicrobienne") displayName = "Vie Microbienne";
      else if (key === "complexeArgiloHumique")
        displayName = "Complexe Argilo-Humique";
      else if (key === "matiereOrganique") displayName = "Matière Organique";
      else if (key === "equilibreCN") displayName = "Équilibre C/N";
      else if (key === "structurePorosite")
        displayName = "Structure et Porosité";

      pieData.push({
        key: key,
        name: displayName,
        value: 20, // Valeur fixe pour avoir des sections égales
        actualValue: value,
        type: rec.type,
      });
    });

    return pieData;
  };

  // Obtenir la couleur en fonction du type (déficit, équilibre, excès)
  const getColorForType = (type) => {
    switch (type) {
      case "exces":
        return "#ffa500"; // Orange
      case "deficit":
        return "#ff0000"; // Rouge
      case "equilibre":
        return "#008000"; // Vert
      default:
        return "#888888"; // Gris par défaut
    }
  };

  // Gestion du clic sur une section du graphique radar
  const handleRadarPointClick = (data, index) => {
    console.log("Radar point clicked:", data, index, index.payload);
    if (onSectionClick && data && index.payload) {
      console.log("Section clicked:", index.payload.key);
      onSectionClick(index.payload.key);
    }
  };

  // Gestion du clic sur une section du camembert
  const handlePieClick = (data, index) => {
    setActiveIndex(index);
    if (onSectionClick && data && data.key) {
      onSectionClick(data.key);
    }
  };

  // Composant pour rendre active la section du camembert
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${payload.name}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`Valeur: ${payload.actualValue.toFixed(2)}`}
        </text>
      </g>
    );
  };

  switch (chartType) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              // dataKey="density"
              domain={[0, 100]}
              tickLine={false}
              // axisLine={false}
              label={{
                value: "Densité (%)",
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis dataKey="name" type="category" width={100} interval={0} />
            <Tooltip
              formatter={(value, name, props) => [
                `${value}% (Coeff. ${props.payload.coefficient})`,
                "Densité",
              ]}
              labelFormatter={(label) => `Plante: ${label}`}
            />
            <Legend align="right" />
            <Bar
              dataKey="density"
              name="Densité"
              fill="#82ca9d"
              fillOpacity={0.8}
              barSize={20}
              label={{ position: "center", formatter: (value) => `${value}%` }}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      );

    case "radar":
      const radarData = prepareRadarData();

      return (
        <div className="radar-chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="70%"
              data={radarData}
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <PolarGrid gridType="circle" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#333", fontSize: 12 }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tickCount={6}
                tick={{ fill: "#666", fontSize: 10 }}
              />

              <Tooltip
                content={(props) => {
                  // N'afficher le tooltip que s'il est actif et contient des données
                  if (
                    !props.active ||
                    !props.payload ||
                    props.payload.length === 0
                  ) {
                    return null;
                  }

                  // On ne prend que le premier élément (évite les doublons)
                  const firstPayload = props.payload[0].payload;

                  // Si les données n'existent pas
                  if (!firstPayload) return null;

                  const type = firstPayload.type;
                  let status = "Équilibre";
                  if (type === "deficit") status = "Déficit";
                  if (type === "exces") status = "Excès";

                  // Style du tooltip
                  const tooltipStyle = {
                    backgroundColor: "white",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    color: "black",
                  };

                  return (
                    <div style={tooltipStyle}>
                      <p>
                        {firstPayload.subject}: {firstPayload.value.toFixed(2)}{" "}
                        ({status})
                      </p>
                    </div>
                  );
                }}
              />
              {radarData.map((entry, index) => (
                <Radar
                  key={index}
                  name={entry.subject}
                  dataKey="value"
                  fill={getColorForType(entry.type)}
                  fillOpacity={0.3}
                  stroke={getColorForType(entry.type)}
                  strokeWidth={2}
                  dot={{
                    r: 6,
                    fill: getColorForType(entry.type),
                    onClick: handleRadarPointClick,
                  }}
                  isAnimationActive={true}
                  activeDot={{
                    r: 8,
                    fill: getColorForType(entry.type),
                    stroke: "#fff",
                    strokeWidth: 2,
                    onClick: handleRadarPointClick,
                  }}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
          <div className="radar-instructions">
            Cliquez sur un point pour voir les recommandations détaillées
          </div>
        </div>
      );

    case "pie":
      const pieData = preparePieData();

      return (
        <div className="pie-chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                onMouseEnter={(data, index) => setActiveIndex(index)}
                onClick={handlePieClick}
                isAnimationActive={true}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorForType(entry.type)}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  if (!props || !props.payload) {
                    return [value, name];
                  }

                  const actualValue = props.payload.actualValue;
                  const type = props.payload.type;
                  let status = "Équilibre";
                  if (type === "deficit") status = "Déficit";
                  if (type === "exces") status = "Excès";
                  return [
                    `${actualValue.toFixed(2)} (${status})`,
                    props.payload.name,
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-instructions">
            Cliquez sur une section pour voir les recommandations détaillées
          </div>
          <div className="pie-legend">
            <div className="legend-item">
              <span className="color-box equilibre"></span>
              <span className="legend-text">Équilibre</span>
            </div>
            <div className="legend-item">
              <span className="color-box deficit"></span>
              <span className="legend-text">Déficit</span>
            </div>
            <div className="legend-item">
              <span className="color-box exces"></span>
              <span className="legend-text">Excès</span>
            </div>
          </div>
        </div>
      );

    // case "pie":
    //   return <PieChart data={chartData} />;
    default:
      return null;
  }
};

export default SoilCharts;
