import React from "react";
import { Line } from "react-chartjs-2";
import {
Chart as ChartJS,
LineElement,
CategoryScale,
LinearScale,
PointElement,
Legend,
Tooltip
} from "chart.js";

ChartJS.register(
LineElement,
CategoryScale,
LinearScale,
PointElement,
Legend,
Tooltip
);

function TemperatureChart({ hourly }) {

if(!hourly) return null;

const labels = hourly.map(item =>
item.time.split(" ")[1].slice(0,5)
);

const temps = hourly.map(item => item.temp);

const data = {
labels: labels,
datasets: [
{
label: "Temperature °C",
data: temps,
borderColor: "#ff9800",
backgroundColor: "#ff9800",
tension: 0.4
}
]
};

return <Line data={data}/>;

}

export default TemperatureChart;