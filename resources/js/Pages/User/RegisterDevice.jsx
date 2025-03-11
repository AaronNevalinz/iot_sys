import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function RegisterDevice() {
    const { data, setData, post, processing, errors } = useForm({
        serial_number: '',
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('user.devices.register'), {
            onSuccess: () => {
                swal("Success", "Device registered successfully", "success");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Register Device" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold">Register New Device</h2>
                    <form onSubmit={submit} className="mt-6 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Device Name</label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">Serial Number</label>
                            <input
                                id="serial_number"
                                type="text"
                                value={data.serial_number}
                                onChange={(e) => setData('serial_number', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                            {errors.serial_number && <p className="mt-2 text-sm text-red-600">{errors.serial_number}</p>}
                        </div>
                        <div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={processing}>
                                Register Device
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
