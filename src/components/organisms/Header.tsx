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
            <div className="container-main flex items-center justify-between py-4">
                <div className="flex items-center gap-6">

                    <nav className="flex items-center gap-8">
                        <button
                            onClick={() => handleChange('alocacoes')}
                            className={`text-lg font-abeezee ${tab === 'alocacoes' ? 'text-[#C1C1C1] underline' : 'text-[#2D2D2D]'}`}
                        >
                            Alocações
                        </button>

                        <button
                            onClick={() => handleChange('projecao')}
                            className={`text-lg font-abeezee ${tab === 'projecao' ? 'text-[#C1C1C1] underline' : 'text-[#2D2D2D]'}`}
                        >
                            Projeção
                        </button>

                        <button
                            onClick={() => handleChange('historico')}
                            className={`text-lg font-abeezee ${tab === 'historico' ? 'text-[#C1C1C1] underline' : 'text-[#2D2D2D]'}`}
                        >
                            Histórico
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-[#C9C9C9]">Matheus Silveira</div>
                </div>
            </div>
        </header>
    );
}
