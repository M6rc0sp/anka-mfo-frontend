'use client';

import { ReactNode } from 'react';
import Sidebar from '../organisms/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    activeMenuItem?: string;
    onMenuItemClick?: (item: string) => void;
}

export default function DashboardLayout({
    children,
    user,
    activeMenuItem,
    onMenuItemClick,
}: DashboardLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-[#101010] overflow-hidden">
            {/* Sidebar - Fixo na esquerda */}
            <aside className="w-[290px] flex-shrink-0 border-r border-[#2F2F2F] bg-[#000000]">
                <Sidebar
                    activeItem={activeMenuItem}
                    onItemClick={onMenuItemClick}
                    user={user}
                />
            </aside>

            {/* Main Content - Scrollável */}
            <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
                <div className="min-h-full w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
