import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Devices({ devices: initialDevices }) {
    const [devices, setDevices] = useState(initialDevices);
    const { post } = useForm();

    const toggleStatus = (id) => {
        post(route('devices.toggle', id), {
            onSuccess: (response) => {
                console.log('Response:', response);
                const updatedDevices = devices.map(device =>
                    device.id === response.id ? response : device
                );
                setDevices(updatedDevices);
            },
            onError: (error) => {
                console.error('Error toggling device status:', error);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Devices" />
            <div className="py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold">My Devices</h2>
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Serial Number</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                    <th className="py-2 px-4 border-b">Analytics</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.map(device => (
                                    <tr key={device.id}>
                                        <td className="py-2 px-4 border-b">{device.id}</td>
                                        <td className="py-2 px-4 border-b">{device.name}</td>
                                        <td className="py-2 px-4 border-b">{device.serial_number}</td>
                                        <td className="py-2 px-4 border-b">{device.is_on ? 'On' : 'Off'}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex items-center justify-center space-x-4">
                                                <button
                                                    className={`text-3xl mr-2 transition-colors ${device.is_on ? 'text-green-500' : 'text-gray-500'}`}
                                                    onClick={() => toggleStatus(device.id)}
                                                >
                                                    <i className={`bx ${device.is_on ? 'bxs-toggle-right' : 'bx-toggle-left'}`}></i>
                                                </button>
                                                <button className="text-red-500" onClick={() => deleteDevice(device.id)}>
                                                    <i className="bx bx-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {device.id ? (
                                                <a href={route('device.analytics', { id: device.id })} target="" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    View Analytics
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">No Analytics Available</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
