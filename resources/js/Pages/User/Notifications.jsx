import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const UserDashboard = ({ devices, stats, recentActivities = [], notifications = [] }) => {
    // Destructure stats with default values
    const {
        totalDevices = 0,
        activeDevices = 0,
        offlineDevices = 0,
        maintenanceDue = 0,
    } = stats || {};

    return (
        <AuthenticatedLayout>
            <Head title="User Dashboard" />
            <div className="py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
                    
                    {/* Statistics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-white shadow rounded">
                            <h3 className="text-lg">Total Devices</h3>
                            <p className="text-2xl">{totalDevices}</p>
                        </div>
                        <div className="p-4 bg-white shadow rounded">
                            <h3 className="text-lg">Active Devices</h3>
                            <p className="text-2xl">{activeDevices}</p>
                        </div>
                        <div className="p-4 bg-white shadow rounded">
                            <h3 className="text-lg">Offline Devices</h3>
                            <p className="text-2xl">{offlineDevices}</p>
                        </div>
                        <div className="p-4 bg-white shadow rounded">
                            <h3 className="text-lg">Maintenance Due</h3>
                            <p className="text-2xl">{maintenanceDue}</p>
                        </div>
                    </div>
                    {/* Devices Overview */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Devices Overview</h3>
                        {devices && devices.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {devices.map(device => (
                                    <div key={device.id} className="border border-slate-300 rounded-lg p-4 shadow">
                                        <h4 className="text-md font-bold">{device.name}</h4>
                                        <p className="text-sm">Serial: {device.serial_number}</p>
                                        <p className={`text-sm ${device.is_on ? 'text-green-600' : 'text-red-600'}`}>
                                            Status: {device.is_on ? 'On' : 'Off'}
                                        </p>
                                        {/* Add more device-specific information or actions here */}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No devices found.</p>
                        )}
                    </div>
                    
                    {/* Recent Activities */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Recent Activities</h3>
                        {recentActivities.length > 0 ? (
                            <ul className="bg-white shadow rounded p-4">
                                {recentActivities.map(activity => (
                                    <li key={activity.id} className="border-b last:border-b-0 py-2">
                                        {activity.description} at {new Date(activity.timestamp).toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No recent activities.</p>
                        )}
                    </div>
                    
                    {/* Notifications */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                        {notifications.length > 0 ? (
                            <ul className="bg-white shadow rounded p-4">
                                {notifications.map(notification => (
                                    <li key={notification.id} className="border-b last:border-b-0 py-2">
                                        {notification.message}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No new notifications.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UserDashboard;
