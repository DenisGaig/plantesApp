import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SoilCharts = ({
  chartType,
  selectedPlants,
  selectedCoverages,
  selectedCoefficients,
}) => {
  const plantData = selectedPlants.map((plant) => ({
    name: plant.commonName,
    density: Number(selectedCoverages[plant.id] || 0),
    coefficient: Number(selectedCoefficients[plant.id] || 0),
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    id: plant.id,
  }));

  const sortedData = [...plantData].sort((a, b) => b.density - a.density);

  console.log("Plant Data: ", plantData);

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
    // case "pie":
    //   return <PieChart data={chartData} />;
    default:
      return null;
  }
};

export default SoilCharts;
