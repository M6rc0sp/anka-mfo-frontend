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
    iconPath: string;
    hasSubmenu: boolean;
    href?: string;
    subitems?: MenuItem[];
}

const MENU_ITEMS: MenuItem[] = [
    {
        id: 'clientes',
        label: 'Clientes',
        iconPath: '/assets/icons/client.svg',
        hasSubmenu: true,
        href: '/clientes',
        subitems: [
            { id: 'dashboard', label: 'Dashboard', iconPath: '/assets/icons/dashboard.svg', hasSubmenu: false, href: '/dashboard' },
            { id: 'projecao', label: 'Projeção', iconPath: '/assets/icons/projection.svg', hasSubmenu: false, href: '/projection' },
            { id: 'historico', label: 'Histórico', iconPath: '/assets/icons/history.svg', hasSubmenu: false, href: '/historico' },
        ],
    },
    { id: 'prospects', label: 'Prospects', iconPath: '/assets/icons/prospects.svg', hasSubmenu: true, href: '/prospects' },
    { id: 'consolidacao', label: 'Consolidação', iconPath: '/assets/icons/consolidation.svg', hasSubmenu: true, href: '/consolidacao' },
    { id: 'crm', label: 'CRM', iconPath: '/assets/icons/crm.svg', hasSubmenu: true, href: '/crm' },
    { id: 'captacao', label: 'Captação', iconPath: '/assets/icons/capture.svg', hasSubmenu: true, href: '/captacao' },
    { id: 'financeiro', label: 'Financeiro', iconPath: '/assets/icons/finances.svg', hasSubmenu: true, href: '/financeiro' },
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
    const [expandedItems, setExpandedItems] = useState<string[]>(['clientes']); // Clientes expandido por padrão
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

    const renderMenuItemIcon = (iconPath: string) => (
        <img src={iconPath} alt="icon" className="w-5 h-5 object-contain" />
    );

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

    const renderMenuItems = (items: MenuItem[], isSubmenu = false) => {
        return items.map((item) => {
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
                        className={`w-full flex items-center gap-4 ${isSubmenu ? 'pl-12 pr-6' : 'px-6'} py-3 rounded-full transition-all duration-200 group ${isActive
                            ? 'bg-gradient-to-r from-[rgba(255,107,53,0.06)] to-[rgba(247,183,72,0.04)] text-[#E6E6E6]'
                            : 'text-[#9E9E9E] hover:bg-[#111111] hover:text-[#EDEDED]'
                            }`}
                    >
                        {/* Icon */}
                        <span className="text-[18px] text-[#9E9E9E] group-hover:text-[#EDEDED] flex-shrink-0" aria-hidden>
                            {renderMenuItemIcon(item.iconPath)}
                        </span>

                        {/* Label */}
                        <span className="font-abeezee text-base font-medium flex-1 text-left truncate">
                            {item.label}
                        </span>

                        {/* Chevron (if has submenu) */}
                        {item.hasSubmenu && (
                            <span className={`text-sm text-[#9E9E9E] transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        )}
                    </button>

                    {/* Subitems */}
                    {item.subitems && isExpanded && (
                        <ul className="space-y-2 mt-2">
                            {renderMenuItems(item.subitems, true)}
                        </ul>
                    )}
                </li>
            );
        });
    };

    return (
        <aside className="fixed left-0 top-0 w-[290px] h-screen bg-[#060606] flex flex-col overflow-y-auto rounded-tr-2xl rounded-br-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            {/* Logo Section */}
            <div className="flex-shrink-0 px-6 py-6 border-b border-transparent">
                <div className="flex items-center justify-center">
                    {/* Wrapper externo para borda gradiente */}
                    <div
                        className="p-[1px] rounded-[39px]"
                        style={{
                            background: 'linear-gradient(96.19deg, #FA4515 65.3%, #D6A207 82.48%, #94290C 107.43%)',
                            width: '160px',
                            height: '50px',
                        }}
                    >
                        {/* Pill container interno com gradiente de fundo */}
                        <div
                            className="flex items-center justify-center rounded-[38px] w-full h-full"
                            style={{
                                background: 'linear-gradient(268.64deg, rgba(16, 16, 16, 1) -45.71%, rgba(30, 25, 18, 1) 47.06%, rgba(40, 15, 15, 1) 108.7%)',
                            }}
                        >
                            <img src="/assets/logo/Anka_logo.png" alt="Anka Logo" className="h-8 object-contain" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-3 px-3">
                    {renderMenuItems(MENU_ITEMS)}
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
