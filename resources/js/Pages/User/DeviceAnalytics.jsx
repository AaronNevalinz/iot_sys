import React, { useEffect, useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import { Bar, Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DeviceAnalytics = ({ device, analytics }) => {
    const { id } = useParams();
    const { props } = usePage();
    const user = props.auth.user;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFrame, setTimeFrame] = useState("days");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        if (!analytics) {
            setError("No analytics data available");
            setLoading(false);
            return;
        }
        setLoading(false);
    }, [analytics]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Calculate averages
    const filterDataByTimeFrame = (data, timeFrame) => {
        const filteredData = {};
        data.forEach((value, index) => {
            const date = new Date(analytics.timestamp[index]);
            const key = timeFrame === "months" ? `${date.getMonth()}-${date.getFullYear()}` : date.toLocaleDateString();
            if (!filteredData[key]) {
                filteredData[key] = [];
            }
            filteredData[key].push(value);
        });
        return filteredData;
    };

    const filterDataByDateRange = (data) => {
        if (!startDate || !endDate) return data;
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return data.filter((_, index) => {
            const timestamp = new Date(analytics.timestamp[index]).getTime();
            return timestamp >= start && timestamp <= end;
        });
    };

    const calculateAverage = (data, timeFrame) => {
        const filteredData = filterDataByTimeFrame(data, timeFrame);
        const averages = Object.values(filteredData).map(
            (values) => values.reduce((a, b) => a + b, 0) / values.length
        );
        return averages;
    };

    const calculateTotalEfficiency = (data, timeFrame) => {
        const filteredData = filterDataByTimeFrame(data, timeFrame);
        const totalEfficiency = Object.values(filteredData).map(
            (values) => values.reduce((a, b) => a + b, 0)
        );
        return totalEfficiency;
    };

    const filteredAnalytics = {
        ...analytics,
        efficiency: filterDataByDateRange(analytics.efficiency || []),
        voltage_stability: filterDataByDateRange(analytics.voltage_stability || []),
        temperature: filterDataByDateRange(analytics.temperature || []),
        power_output: filterDataByDateRange(analytics.power_output || []),
        rpm: filterDataByDateRange(analytics.rpm || []),
        timestamp: filterDataByDateRange(analytics.timestamp || []),
    };

    const totalEfficiency = calculateTotalEfficiency(filteredAnalytics.efficiency, timeFrame);
    const averageEfficiency = totalEfficiency.map((total, index) => total / Object.keys(filterDataByTimeFrame(filteredAnalytics.timestamp, timeFrame)).length);
    const averageVoltageStability = calculateAverage(filteredAnalytics.voltage_stability, timeFrame);
    const averageTemperature = calculateAverage(filteredAnalytics.temperature, timeFrame);

    console.log("Filtered Analytics:", filteredAnalytics);
    console.log("Average Efficiency:", averageEfficiency);
    console.log("Average Voltage Stability:", averageVoltageStability);
    console.log("Average Temperature:", averageTemperature);

    // Prepare chart data
    const efficiencyData = {
        labels: Object.keys(filterDataByTimeFrame(filteredAnalytics.timestamp, timeFrame)).map((key) => {
            const [month, year] = key.split("-");
            return timeFrame === "months" ? `${monthNames[month]} ${year}` : key;
        }),
        datasets: [
            {
                label: "Average Efficiency",
                data: averageEfficiency,
                backgroundColor: "rgba(75,192,192,0.6)",
            },
        ],
    };

    const voltageStabilityData = {
        labels: Object.keys(filterDataByTimeFrame(filteredAnalytics.timestamp, timeFrame)).map((key) => {
            const [month, year] = key.split("-");
            return timeFrame === "months" ? `${monthNames[month]} ${year}` : key;
        }),
        datasets: [
            {
                label: "Average Voltage Stability",
                data: averageVoltageStability,
                backgroundColor: "rgba(153,102,255,0.6)",
            },
        ],
    };

    const temperatureData = {
        labels: Object.keys(filterDataByTimeFrame(filteredAnalytics.timestamp, timeFrame)).map((key) => {
            const [month, year] = key.split("-");
            return timeFrame === "months" ? `${monthNames[month]} ${year}` : key;
        }),
        datasets: [
            {
                label: "Average Temperature (°C)",
                data: averageTemperature,
                backgroundColor: "rgba(22, 40, 159, 1)",
            },
        ],
    };

    // Prepare power and RPM against time data
    const powerRPMData = {
        labels: filteredAnalytics.timestamp.map((ts) =>
            new Date(ts).toLocaleDateString()
        ),
        datasets: [
            {
                label: "Average Power Output",
                data: filteredAnalytics.power_output || [],
                borderColor: "rgba(255,99,132,1)",
                backgroundColor: "rgba(255,99,132,0.2)",
                fill: false,
            },
            {
                label: "Average RPM",
                data: filteredAnalytics.rpm || [],
                borderColor: "rgba(54,162,235,1)",
                backgroundColor: "rgba(54,162,235,0.2)",
                fill: false,
            },
        ],
    };

    console.log("Filtered Analytics for Table:", filteredAnalytics);

    return (
        <>
            <div className="p-4 m-4 analytics">
                <Head title={`Analytics for ${device.name}`} />
                <h2 className="text-xl font-semibold">
                    Analytics for {device.name}
                </h2>
                <div className="time-frame-selector p-2">
                    <label htmlFor="timeFrame">Select Time Frame: </label>
                    <select
                        id="timeFrame"
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value)}
                    >
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                    </select>
                </div>
                <div className="date-range-selector p-2">
                    <label htmlFor="startDate">Start Date: </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label htmlFor="endDate">End Date: </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="average-values">
                    <p>Average Efficiency: {averageEfficiency.reduce((a, b) => a + b, 0) / averageEfficiency.length}</p>
                    {/* <p>Average Voltage Stability: {averageVoltageStability.reduce((a, b) => a + b, 0) / averageVoltageStability.length}</p> */}
                </div>
                {user.role === "admin" && (
                    <table className="table-auto divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-slate-600">Date</th>
                                <th className="border border-slate-600">Time</th>
                                <th className="border border-slate-600">
                                    Solar Power Input
                                </th>
                                <th className="border border-slate-600">
                                    Power Output
                                </th>
                                <th className="border border-slate-600">
                                    Panel Voltage
                                </th>
                                <th className="border border-slate-600">RPM</th>
                                <th className="border border-slate-600">
                                    Current (A)
                                </th>
                                <th className="border border-slate-600">
                                    Temperature (°C)
                                </th>
                                <th className="border border-slate-600">
                                    Error Code
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAnalytics.timestamp.map((_, index) => {
                                const dateObj = new Date(
                                    filteredAnalytics.timestamp[index]
                                );
                                const date = dateObj.toLocaleDateString();
                                const time = dateObj.toLocaleTimeString();
                                const current = filteredAnalytics.current[index];
                                const power_output = filteredAnalytics.power_output[index];
                                const rpm = filteredAnalytics.rpm[index];
                                const solar_power_input =
                                    filteredAnalytics.solar_power_input[index];
                                const panel_voltage =
                                    filteredAnalytics.panel_voltage[index];
                                const temperature = filteredAnalytics.temperature[index];
                                const error_code = filteredAnalytics.error_code[index];
                                return (
                                    <tr key={index}>
                                        <td className="border border-slate-600">
                                            {date}
                                        </td>
                                        <td className="border border-slate-600">
                                            {time}
                                        </td>
                                        <td className="border border-slate-600">
                                            {solar_power_input}
                                        </td>
                                        <td className="border border-slate-600">
                                            {power_output}
                                        </td>
                                        <td className="border border-slate-600">
                                            {panel_voltage}
                                        </td>
                                        <td className="border border-slate-600">
                                            {rpm}
                                        </td>
                                        <td className="border border-slate-600">
                                            {current}
                                        </td>
                                        <td className="border border-slate-600">
                                            {temperature}
                                        </td>
                                        <td className="border border-slate-600">
                                            {error_code}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                
                {/* Charts */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold">
                            Average Efficiency
                        </h3>
                        <Bar data={efficiencyData} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">
                            Average Voltage Stability
                        </h3>
                        <Bar data={voltageStabilityData} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">
                            Average Device Temperature
                        </h3>
                        <Bar data={temperatureData} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">
                            Average Power Output & RPM
                        </h3>
                        <Line data={powerRPMData} />
                    </div>
                </div>

                <div className="py-2">
                    <button className="text-white font-bold dashbtn">
                        {/* <a href={route("user.devices")}>Back to dashboard</a> */}
                        {user.role === "admin" ? (
                            <a href={route("admin.devices")}>
                                Back to dashboard
                            </a>
                        ) : (
                            <a href={route("user.devices")}>
                                Back to dashboard
                            </a>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default DeviceAnalytics;