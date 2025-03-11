import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import swal from "sweetalert";
import { Inertia } from '@inertiajs/inertia';

export default function Devices({ devices: initialDevices, users = [] }) {
    const [devices, setDevices] = useState(initialDevices);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        serial_number: "",
        user_id: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [deviceSearchTerm, setDeviceSearchTerm] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [devicesPerPage] = useState(10); // Number of devices per page

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter devices based on device name or serial number
    const filteredDevices = devices.filter(
        (device) =>
            device.name
                .toLowerCase()
                .includes(deviceSearchTerm.toLowerCase()) ||
            device.serial_number
                .toLowerCase()
                .includes(deviceSearchTerm.toLowerCase())
    );

    // Get current devices for the current page
    const indexOfLastDevice = currentPage * devicesPerPage;
    const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
    const currentDevices = filteredDevices.slice(
        indexOfFirstDevice,
        indexOfLastDevice
    );

    const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

    const submit = (e) => {
        e.preventDefault();
        post(route("devices.store"), {
            onSuccess: (response) => {
                setDevices([...devices, response]);
                reset();
                swal("Success", "Device added successfully", "success").then(
                    () => {
                        window.location.reload();
                    }
                );
            },
        });
    };

    const toggleStatus = (id) => {
        post(route("devices.toggle", id), {
            onSuccess: (response) => {
                const updatedDevices = devices.map((device) =>
                    device.id === response.id ? response : device
                );
                setDevices(updatedDevices);
            },
        });
    };

    const deleteDevice = (id) => {
        if (confirm("Are you sure you want to delete this device?")) {
            Inertia.delete(route('devices.destroy', { id }), {
                onSuccess: () => {
                    // Optionally show a success message or refresh the list
                    console.log("Device deleted successfully.");
                },
                onError: (errors) => {
                    // Handle errors
                    console.error("Error deleting device:", errors);
                }
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Devices Management" />
            <div className="py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold">Device Management</h2>
                    <div className="mt-2 bg-white shadow sm:rounded-lg sm:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Device Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="serial_number"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Serial Number
                                </label>
                                <input
                                    id="serial_number"
                                    type="text"
                                    value={data.serial_number}
                                    onChange={(e) =>
                                        setData("serial_number", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.serial_number && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.serial_number}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="user_id"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Assign User
                                </label>
                                <div className="relative" ref={dropdownRef}>
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {isDropdownOpen && (
                                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10">
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((user) => (
                                                    <div
                                                        key={user.id}
                                                        onClick={() => {
                                                            setData(
                                                                "user_id",
                                                                user.id
                                                            );
                                                            setSearchTerm(
                                                                user.name
                                                            );
                                                            setIsDropdownOpen(
                                                                false
                                                            );
                                                        }}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        {user.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-2 text-gray-500">
                                                    No users found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="hidden"
                                    id="user_id"
                                    name="user_id"
                                    value={data.user_id}
                                />
                                {errors.user_id && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.user_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    disabled={processing}
                                >
                                    Add Device
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* Device Search Form */}
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Search devices by name or serial number..."
                                value={deviceSearchTerm}
                                onChange={(e) => setDeviceSearchTerm(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        {/* <div className="mt-2">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Search
                            </button>
                        </div> */}
                    </form>
                    <table className="min-w-full mt-4">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Device ID</th>
                                <th className="px-4 py-2">Device Name</th>
                                <th className="px-4 py-2">Serial Number</th>
                                <th className="px-4 py-2">Assigned User</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Actions</th>
                                <th className="px-4 py-2">View Analytics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDevices.map((device) => (
                                <tr key={device.id}>
                                    <td className="border px-4 py-2">
                                        {device.id}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {device.name}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {device.serial_number}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {device.user_id
                                            ? users.find(
                                                (user) =>
                                                    user.id === device.user_id
                                            )?.name
                                            : "Unassigned"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {device.is_on ? "On" : "Off"}
                                    </td>
                                    <td className="border px-2 py-2">
                                        <div className="flex items-center justify-center space-x-4">
                                            <button
                                                className={`text-3xl mr-2 transition-colors ${device.is_on
                                                    ? "text-green-500"
                                                    : "text-gray-500"
                                                    }`}
                                                onClick={() =>
                                                    toggleStatus(device.id)
                                                }
                                            >
                                                <i
                                                    className={`bx ${device.is_on
                                                        ? "bxs-toggle-right"
                                                        : "bx-toggle-left"
                                                        }`}
                                                ></i>
                                            </button>
                                            <button
                                                className="text-red-500"
                                                onClick={() =>
                                                    deleteDevice(device.id)
                                                }
                                            >
                                                <i className="bx bx-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {device.id ? (
                                            <a
                                                href={route(
                                                    "device.analytics",
                                                    { id: device.id }
                                                )}
                                                target=""
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                View Analytics
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">
                                                No Analytics Available
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
