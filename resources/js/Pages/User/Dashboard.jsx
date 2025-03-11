import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
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
    ArcElement,
} from "chart.js";
import { Line, Doughnut } from 'react-chartjs-2';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const UserDashboard = ({ devices, analyticsGroupedByDevice }) => {
    // Destructure stats with default values

    const [selectedDeviceId, setSelectedDeviceId] = useState(devices.length > 0 ? devices[0].id : null);
    const [filterType, setFilterType] = useState('days');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedHourDate, setSelectedHourDate] = useState(new Date());
    const [monthRange, setMonthRange] = useState({ start: new Date(), end: new Date() });

    const handleDeviceChange = (event) => {
        setSelectedDeviceId(event.target.value);
    };

    const handleFilterTypeChange = (event) => {
        const value = event.target.value;
        setFilterType(value);
        if (value === 'reset') {
            const now = new Date();
            const pastYear = new Date(now.setFullYear(now.getFullYear() - 1));
            setStartDate(pastYear);
            setEndDate(new Date());
        }
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleHourDateChange = (date) => {
        setSelectedHourDate(date);
    };

    const handleMonthRangeChange = (start, end) => {
        setMonthRange({ start, end });
    };

    const filterDataByTimeFrame = (data, timeFrame) => {
        const filteredData = {};
        data.forEach((value, index) => {
            const date = new Date(analyticsGroupedByDevice[selectedDeviceId].timestamp[index]);
            let key;
            if (timeFrame === "months") {
                if (date >= monthRange.start && date <= monthRange.end) {
                    key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                } else {
                    return;
                }
            } else if (timeFrame === "reset") {
                key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            } else if (timeFrame === "hours") {
                if (date.toLocaleDateString() === selectedHourDate.toLocaleDateString()) {
                    key = `${date.getHours()}:00`;
                } else {
                    return;
                }
            } else {
                key = date.toLocaleDateString();
            }
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
            const timestamp = new Date(analyticsGroupedByDevice[selectedDeviceId].timestamp[index]).getTime();
            return timestamp >= start && timestamp <= end;
        });
    };

    const generateChartData = (deviceId, dataType) => {
        let data = analyticsGroupedByDevice[deviceId][dataType];
        let labels = analyticsGroupedByDevice[deviceId]['timestamp'];

        if (filterType === 'dateRange') {
            data = filterDataByDateRange(data);
            labels = filterDataByDateRange(labels);
        } else {
            const filteredData = filterDataByTimeFrame(data, filterType);
            data = Object.values(filteredData).map(arr => arr.reduce((a, b) => a + b, 0) / arr.length);
            labels = Object.keys(filteredData);
        }

        return {
            labels,
            datasets: [
                {
                    label: dataType,
                    data,
                    fill: false,
                    borderColor: 'rgba(22, 40, 159, 1)',
                },
            ],
        };
    };

    const getLatestValue = (deviceId, dataType) => {
        const data = analyticsGroupedByDevice[deviceId][dataType];
        return data.length > 0 ? data[data.length - 1] : 'N/A';
    };

    const getLatestValueInRange = (deviceId, dataType) => {
        let data = analyticsGroupedByDevice[deviceId][dataType];
        let labels = analyticsGroupedByDevice[deviceId]['timestamp'];

        if (filterType === 'dateRange') {
            data = filterDataByDateRange(data);
        } else if (filterType === 'hours') {
            const filteredData = filterDataByTimeFrame(data, filterType);
            data = Object.values(filteredData).flat();
        } else if (filterType === 'months' || filterType === 'reset') {
            const filteredData = filterDataByTimeFrame(data, filterType);
            data = Object.values(filteredData).flat();
        }

        return data.length > 0 ? data[data.length - 1] : 'N/A';
    };

    const generateGaugeData = (value, max) => {
        return {
            datasets: [
                {
                    data: [value, max - value],
                    backgroundColor: ['rgba(22, 40, 159, 1)', 'rgba(200, 200, 200, 0.5)'],
                    borderWidth: 0,
                },
            ],
            labels: ['Value', ''],
        };
    };

    const gaugeOptions = {
        circumference: 180,
        rotation: 270,
        cutout: '65%', // Increase this value to make the gauge thinner
        plugins: {
            tooltip: {
                enabled: false,
            },
            datalabels: {
                display: true,
                formatter: (value, context) => {
                    const index = context.dataIndex;
                    const label = context.chart.data.labels[index];
                    return label === 'Value' ? value : '';
                },
                color: '#000',
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Dashboard" />
            <div className="py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
                    {/* Devices Overview */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Devices Overview</h3>
                        <div className="mb-4">
                            <label htmlFor="device-select" className="block text-sm font-medium text-gray-700">Select Device:</label>
                            <select
                                id="device-select"
                                value={selectedDeviceId}
                                onChange={handleDeviceChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                {devices.map(device => (
                                    <option key={device.id} value={device.id}>{device.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700">Filter By:</label>
                            <select
                                id="filter-type"
                                value={filterType}
                                onChange={handleFilterTypeChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="days">Days</option>
                                <option value="months">Months</option>
                                <option value="hours">Hours</option>
                                <option value="dateRange">Date Range</option>
                                <option value="reset">Reset</option>
                            </select>
                        </div>
                        {filterType === 'dateRange' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                                <label className="block text-sm font-medium text-gray-700 mt-2">End Date:</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleEndDateChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                            </div>
                        )}
                        {filterType === 'hours' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Select Date:</label>
                                <DatePicker
                                    selected={selectedHourDate}
                                    onChange={handleHourDateChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                            </div>
                        )}
                        {filterType === 'months' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Select Month Range:</label>
                                <div className="flex space-x-4">
                                    <DatePicker
                                        selected={monthRange.start}
                                        onChange={(date) => handleMonthRangeChange(date, monthRange.end)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    />
                                    <DatePicker
                                        selected={monthRange.end}
                                        onChange={(date) => handleMonthRangeChange(monthRange.start, date)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    />
                                </div>
                            </div>
                        )}
                        {selectedDeviceId && (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                                    <div className="p-4 bg-white shadow rounded">
                                        <h4 className="text-md font-bold">L1</h4>
                                        <p className="text-2xl">{getLatestValueInRange(selectedDeviceId, 'voltage')} VAC</p>
                                    </div>
                                    <div className="p-4 bg-white shadow rounded">
                                        <h4 className="text-md font-bold">L2</h4>
                                        <p className="text-2xl">{getLatestValueInRange(selectedDeviceId, 'current')} VAC</p>
                                    </div>
                                    <div className="p-4 bg-white shadow rounded">
                                        <h4 className="text-md font-bold">L3</h4>
                                        <p className="text-2xl">{getLatestValueInRange(selectedDeviceId, 'power_output')} VAC</p>
                                    </div>
                                    <div className="p-4 bg-white shadow rounded">
                                        <h4 className="text-md font-bold">Device Temperature</h4>
                                        <p className="text-2xl">{getLatestValueInRange(selectedDeviceId, 'temperature')} &deg;C</p>
                                    </div>
                                    <div className="p-4 bg-white shadow rounded">
                                        <h4 className="text-md font-bold">Ambient Temperature</h4>
                                        <p className="text-2xl">{getLatestValueInRange(selectedDeviceId, 'ambient_temperature')} &deg;C</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="border border-slate-300 rounded-lg p-4 shadow">
                                        <h4 className="text-md font-bold">Voltage</h4>
                                        <Line data={generateChartData(selectedDeviceId, 'voltage')} />
                                    </div>
                                    <div className="border border-slate-300 rounded-lg p-4 shadow">
                                        <h4 className="text-md font-bold">Current</h4>
                                        <Line data={generateChartData(selectedDeviceId, 'current')} />
                                    </div>
                                    <div className="border border-slate-300 rounded-lg p-4 shadow">
                                        <h4 className="text-md font-bold">Temperature</h4>
                                        <Line data={generateChartData(selectedDeviceId, 'temperature')} />
                                    </div>
                                    <div className="border border-slate-300 rounded-lg p-4 shadow">
                                        <h4 className="text-md font-bold">RPM</h4>
                                        <Doughnut data={generateGaugeData(getLatestValueInRange(selectedDeviceId, 'rpm'), 5000)} options={gaugeOptions} />
                                    </div>
                                    <div className="border border-slate-300 rounded-lg p-4 shadow">
                                        <h4 className="text-md font-bold">Efficiency</h4>
                                        <Doughnut data={generateGaugeData(getLatestValueInRange(selectedDeviceId, 'efficiency'), 100)} options={gaugeOptions} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UserDashboard;
