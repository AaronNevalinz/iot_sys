import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const Sidebar = () => {
    const { props } = usePage();
    const user = props.auth.user;

    // Define sidebar links
    const sidebarLinks = [
        {
            name: 'Dashboard',
            href: route('admin.dashboard'),
            icon: 'bx bxs-dashboard',
            roles: ['admin', 'user'],
        },
        {
            name: 'Users',
            href: route('admin.users'),
            icon: 'bx bx-user',
            roles: ['admin'],
        },
        {
            name: 'Device Management',
            href: route('user.devices'),
            icon: 'bx bx-devices',
            roles: ['user'],
        },
        {
            name: 'Devices',
            href: route('admin.devices'),
            icon: 'bx bx-devices',
            roles: ['admin']
        },
        {
            name: 'Profile',
            href: route('profile.edit'),
            icon: 'bx bx-user-circle',
            roles: ['admin', 'user'],
        },
        {
            name: 'Log Out',
            href: route('logout'),
            icon: 'bx bx-log-out',
            roles: ['admin', 'user'],
            method: 'post',
            as: 'button',
        },
    ];

    return (
        <div className="w-64 h-full fixed sidebar">
            <div className='p-4'>
                <h2 className="text-lg font-semibold">IOT</h2>
            </div>
            <nav>
                <ul>
                    {sidebarLinks
                        .filter(link => link.roles.includes(user.role))
                        .map(link => (
                            <li key={link.name} className="mb-2">
                                <Link
                                    href={link.href}
                                    method={link.method || 'get'}
                                    as={link.as || 'a'}
                                    className="block p-4 sidebar-link"
                                >
                                    <i className={link.icon}></i> {link.name}
                                </Link>
                            </li>
                        ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
