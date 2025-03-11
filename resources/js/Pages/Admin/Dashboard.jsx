import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [statistics, setStatistics] = useState({
        totalDevices: 0,
        activeDevices: 0,
        inactiveDevices: 0,
        totalUsers: 0,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(route('dashboard.statistics'));

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />
            <div className="py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold">System Statistics</h2>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">Total Devices</h3>
                            <p className="mt-2 text-2xl">{statistics.totalDevices}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">Active Devices</h3>
                            <p className="mt-2 text-2xl">{statistics.activeDevices}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">Inactive Devices</h3>
                            <p className="mt-2 text-2xl">{statistics.inactiveDevices}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">Total Users</h3>
                            <p className="mt-2 text-2xl">{statistics.totalUsers}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
