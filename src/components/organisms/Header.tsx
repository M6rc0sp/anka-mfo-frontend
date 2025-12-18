'use client';

import { useState } from 'react';

type Tab = 'alocacoes' | 'projecao' | 'historico';

interface HeaderProps {
    activeTab?: Tab;
    onTabChange?: (tab: Tab) => void;
}

export default function Header({ activeTab = 'projecao', onTabChange }: HeaderProps) {
    const [tab, setTab] = useState<Tab>(activeTab as Tab);

    const handleChange = (t: Tab) => {
        setTab(t);
        onTabChange?.(t);
    };

    return (
        <header className="sticky top-0 z-20 bg-[#101010] border-b border-[#2F2F2F]">
            <div className="container-main grid grid-cols-[1fr_auto_1fr] items-center py-4 h-[72px]">
                <div className="flex items-center gap-6">
                    {/* Logo or other left content could go here */}
                </div>

                <nav className="nav-tabs">
                    <button
                        onClick={() => handleChange('alocacoes')}
                        className={`nav-tab ${tab === 'alocacoes' ? 'nav-tab--active' : 'nav-tab--inactive'}`}
                    >
                        Alocações
                    </button>

                    <button
                        onClick={() => handleChange('projecao')}
                        className={`nav-tab ${tab === 'projecao' ? 'nav-tab--active' : 'nav-tab--inactive'}`}
                    >
                        Projeção
                    </button>

                    <button
                        onClick={() => handleChange('historico')}
                        className={`nav-tab ${tab === 'historico' ? 'nav-tab--active' : 'nav-tab--inactive'}`}
                    >
                        Histórico
                    </button>
                </nav>

                <div className="flex items-center gap-4 justify-self-end">
                    {/* User name removed as requested */}
                </div>
            </div>
        </header>
    );
}
