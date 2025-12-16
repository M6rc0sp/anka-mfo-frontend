'use client';

import { useState } from 'react';

interface SidebarProps {
    activeItem?: string;
    onItemClick?: (itemId: string) => void;
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    collapsed?: boolean;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    hasSubmenu: boolean;
    href?: string;
}

const ICON = {
    Clientes: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 21v-1c0-2.761-2.239-5-5-5H9c-2.761 0-5 2.239-5 5v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Dashboard: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.4" rx="1" />
            <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.4" rx="1" />
            <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.4" rx="1" />
            <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.4" rx="1" />
        </svg>
    ),
    Projecao: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 14l3-3 4 4 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Historico: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20.49 20.49A9 9 0 1 1 21 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Prospects: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM6 11c1.657 0 3-1.343 3-3S7.657 5 6 5 3 6.343 3 8s1.343 3 3 3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 14c-2.33 0-7 1.17-7 3.5V20h20v-2.5C19 15.17 14.33 14 12 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Consolidacao: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 12h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 6v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    CRM: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    ),
    Captacao: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 1v22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M4 7h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    ),
    Financeiro: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 10v-2a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
} as const;

const MENU_ITEMS: MenuItem[] = [
    { id: 'clientes', label: 'Clientes', icon: ICON.Clientes, hasSubmenu: false, href: '/clientes' },
    { id: 'dashboard', label: 'Dashboard', icon: ICON.Dashboard, hasSubmenu: false, href: '/dashboard' },
    { id: 'projecao', label: 'Projeção', icon: ICON.Projecao, hasSubmenu: false, href: '/projection' },
    { id: 'historico', label: 'Histórico', icon: ICON.Historico, hasSubmenu: false, href: '/historico' },
    { id: 'prospects', label: 'Prospects', icon: ICON.Prospects, hasSubmenu: true, href: '/prospects' },
    { id: 'consolidacao', label: 'Consolidação', icon: ICON.Consolidacao, hasSubmenu: true, href: '/consolidacao' },
    { id: 'crm', label: 'CRM', icon: ICON.CRM, hasSubmenu: true, href: '/crm' },
    { id: 'captacao', label: 'Captação', icon: ICON.Captacao, hasSubmenu: true, href: '/captacao' },
    { id: 'financeiro', label: 'Financeiro', icon: ICON.Financeiro, hasSubmenu: true, href: '/financeiro' },
];

export default function Sidebar({
    activeItem = 'clientes',
    onItemClick,
    user = {
        name: 'Usuário',
        email: 'usuario@anka.com',
    },
    collapsed = false,
}: SidebarProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [active, setActive] = useState(activeItem);

    const toggleExpand = (itemId: string) => {
        setExpandedItems((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
    };

    const handleItemClick = (item: MenuItem) => {
        setActive(item.id);
        if (onItemClick) {
            onItemClick(item.id);
        }
    };

    // Função para gerar cor de avatar baseada no nome
    const getAvatarColor = (name: string) => {
        const colors = [
            '#67AEFA', // blue
            '#48F7A1', // green
            '#F7B748', // yellow
            '#A034FF', // purple
            '#FF5151', // red
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Iniciais do usuário
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (collapsed) {
        return null; // Mobile: colapsado
    }

    return (
        <aside className="fixed left-0 top-0 w-[290px] h-screen bg-[#060606] flex flex-col overflow-y-auto rounded-tr-2xl rounded-br-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            {/* Logo Section - pill with gradient border */}
            <div className="flex-shrink-0 px-6 py-8 border-b border-transparent">
                <div className="flex items-center justify-center">
                    <div className="rounded-full p-[2px] bg-gradient-to-r from-[#FF6B35] via-[#FF6B35] to-[#F7B748]">
                        <div className="rounded-full bg-[#0B0B0B] px-6 py-2 flex items-center justify-center">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B35] to-[#F7B748] font-abeezee">
                                Anka
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-3 px-3">
                    {MENU_ITEMS.map((item) => {
                        const isActive = active === item.id;
                        const isExpanded = expandedItems.includes(item.id);

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => {
                                        if (item.hasSubmenu) {
                                            toggleExpand(item.id);
                                        }
                                        handleItemClick(item);
                                    }}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`w-full flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-200 group ${isActive
                                            ? 'bg-gradient-to-r from-[rgba(255,107,53,0.06)] to-[rgba(247,183,72,0.04)] text-[#E6E6E6]'
                                            : 'text-[#9E9E9E] hover:bg-[#111111] hover:text-[#EDEDED]'
                                        }`}
                                >
                                    {/* Icon */}
                                    <span className="text-[18px] text-[#9E9E9E] group-hover:text-[#EDEDED]" aria-hidden>
                                        {item.icon}
                                    </span>

                                    {/* Label */}
                                    <span className="font-abeezee text-base font-medium flex-1 text-left truncate">
                                        {item.label}
                                    </span>

                                    {/* Chevron (if has submenu) */}
                                    <span className={`text-sm text-[#9E9E9E] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                        {item.hasSubmenu ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : null}
                                    </span>
                                </button>

                                {/* Submenu placeholder - expand area */}
                                {item.hasSubmenu && isExpanded && (
                                    <ul className="pl-12 mt-2 space-y-2">
                                        <li className="text-sm text-[#9B9B9B]">Subitem 1</li>
                                        <li className="text-sm text-[#9B9B9B]">Subitem 2</li>
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Section */}
            <div className="flex-shrink-0 border-t border-transparent p-6">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
                        style={{ backgroundColor: getAvatarColor(user.name) }}
                    >
                        {getInitials(user.name)}
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-medium text-[#E6E6E6] truncate">
                            {user.name}
                        </p>
                        <p className="font-sans text-xs font-normal text-[#9F9F9F] truncate">
                            {user.email}
                        </p>
                    </div>

                    {/* Menu dots */}
                    <button className="flex-shrink-0 text-[#555555] hover:text-[#EDEDED] transition-colors" aria-label="Mais opções">
                        <span className="text-lg">⋯</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
