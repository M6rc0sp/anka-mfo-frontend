'use client';

import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'filter-active' | 'filter-inactive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
    variant?: Variant;
    size?: Size;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: ReactNode;
    className?: string;
}

const variantClasses: Record<Variant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    'filter-active': 'btn-filter-active',
    'filter-inactive': 'btn-filter-inactive',
};

const sizeClasses: Record<Size, string> = {
    sm: 'h-10 px-4 text-base',
    md: 'h-[54px] px-6 text-lg',
    lg: 'h-16 px-8 text-xl',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled = false,
    onClick,
    children,
    className = '',
}: ButtonProps) {
    const base = variantClasses[variant] || variantClasses['primary'];
    const sizeClass = sizeClasses[size];
    const full = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-3 ${base} ${sizeClass} ${full} ${disabledClass} ${className}`}
        >
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            <span className="truncate">{children}</span>
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </button>
    );
}
