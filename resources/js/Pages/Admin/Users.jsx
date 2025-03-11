import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const Users = ({ users: initialUsers }) => {
    const [users, setUsers] = useState(initialUsers);

    return (
        <AuthenticatedLayout>
            <Head title="Users Management" />
            <div className="py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold py-5">Users Management</h2>
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">User Role</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Users;
