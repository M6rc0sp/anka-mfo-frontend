'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tab = 'alocacoes' | 'projecao' | 'historico';

interface HeaderProps {
    activeTab?: Tab;
}

export default function Header({ activeTab }: HeaderProps) {
    const pathname = usePathname();

    // Determina a aba ativa baseado na rota atual
    const getActiveTab = (): Tab => {
        if (activeTab) return activeTab;
        if (pathname?.includes('/allocations')) return 'alocacoes';
        if (pathname?.includes('/history')) return 'historico';
        return 'projecao';
    };

    const currentTab = getActiveTab();

    return (
        <header className="sticky top-0 z-20 bg-[#101010] border-b border-[#2F2F2F]">
            <div className="container-main grid grid-cols-[1fr_auto_1fr] items-center py-4 h-[72px]">
                <div className="flex items-center gap-6">
                    {/* Logo or other left content could go here */}
                </div>

                <nav className="nav-tabs">
                    <Link
                        href="/allocations"
                        className={`nav-tab ${currentTab === 'alocacoes' ? 'nav-tab--active' : 'nav-tab--inactive'}`}
                    >
                        Alocações
                    </Link>

                    <Link
                        href="/projection"
                        className={`nav-tab ${currentTab === 'projecao' ? 'nav-tab--active' : 'nav-tab--inactive'}`}
                    >
                        Projeção
                    </Link>

                    <Link
                        href="/history"
                        className={`nav-tab ${currentTab === 'historico' ? 'nav-tab--active' : 'nav-tab--inactive'}`}
                    >
                        Histórico
                    </Link>
                </nav>

                <div className="flex items-center gap-4 justify-self-end">
                    {/* User name removed as requested */}
                </div>
            </div>
        </header>
    );
}
