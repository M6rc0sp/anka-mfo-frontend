/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary background colors
                'bg-primary': '#101010',
                'bg-secondary': '#1B1B1B',
                'bg-tertiary': '#1D1F1E',
                'bg-card': '#1F1F1F',
                'bg-sidebar-item': '#303030',

                // Text colors
                'text-primary': '#FFFFFF',
                'text-secondary': '#C9C9C9',
                'text-tertiary': '#919191',
                'text-muted': '#757575',
                'text-disabled': '#707070',
                'text-dark': '#444444',
                'text-link': '#C1C1C1',
                'text-link-active': '#2D2D2D',

                // State colors
                'primary-blue': '#67AEFA',
                'primary-secondary': '#6777FA',
                'primary-accent': '#03B6AD',
                'success': '#408E37',
                'success-bright': '#00C900',
                'warning': '#F7B748',
                'danger': '#C65353',
                'danger-bright': '#FF5151',
                'suggestion': '#48F7A1',
                'purple': '#A034FF',

                // Border colors
                'border-default': '#444444',
                'border-light': '#2F2F2F',
                'border-input': '#C9C9C9',
                'border-inactive': '#292D52',

                // Legacy brand colors (for backward compatibility)
                brand: {
                    950: '#101010',
                    900: '#1B1B1B',
                    800: '#1D1F1E',
                    700: '#1F1F1F',
                    600: '#303030',
                },
                accent: {
                    green: '#48F7A1',
                    red: '#C65353',
                    blue: '#67AEFA',
                    yellow: '#F7B748',
                }
            },
            fontFamily: {
                'work-sans': ['Work Sans', 'system-ui', 'sans-serif'],
                'inter': ['Inter', 'system-ui', 'sans-serif'],
                'neuton': ['Neuton', 'serif'],
                'abeezee': ['ABeeZee', 'sans-serif'],
                'satoshi': ['Satoshi', 'sans-serif'],
                sans: ['Work Sans', 'Inter', 'system-ui', 'sans-serif'],
            },
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '24px',
                '2xl': '32px',
            },
            borderRadius: {
                'btn': '47px',
                'card': '32px',
                'card-lg': '15px',
                'card-md': '16px',
                'input': '12px',
                'base': '32px',
            },
            backdropBlur: {
                sm: '4px',
                DEFAULT: '12px',
                md: '16px',
                lg: '20px',
                xl: '24px',
            },
        },
    },
    plugins: [],
}
