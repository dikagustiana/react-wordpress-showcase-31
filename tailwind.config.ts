import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        'plus-jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
			fontSize: {
				'h1': 'var(--font-h1)',
				'h2': 'var(--font-h2)',
				'h3': 'var(--font-h3)',
				'h4': 'var(--font-h4)',
			},
			maxWidth: {
				'content': '1200px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				
				/* Corporate theme colors */
				'corporate-blue': {
					DEFAULT: 'hsl(var(--corporate-blue))',
					light: 'hsl(var(--corporate-blue-light))',
				},
				'corporate-gray': {
					DEFAULT: 'hsl(var(--corporate-gray))',
					light: 'hsl(var(--corporate-gray-light))',
				},

				/* Unified Card Theme */
				'card-bg-light': 'hsl(var(--card-bg-light))',
				'card-bg-light-hover': 'hsl(var(--card-bg-light-hover))',
				'card-icon-bg': 'hsl(var(--card-icon-bg))',
				'card-title': 'hsl(var(--card-title))',
				'card-description': 'hsl(var(--card-description))',
				'card-cta': 'hsl(var(--card-cta))',
				'navy-dark': 'hsl(var(--navy-dark))',
				'navy-light': 'hsl(var(--navy-light))',
				'beige-light': 'hsl(var(--beige-light))',
				
				/* Table specific colors */
				table: {
					header: 'hsl(var(--table-header))',
					'header-foreground': 'hsl(var(--table-header-foreground))',
					'row-even': 'hsl(var(--table-row-even))',
					'row-odd': 'hsl(var(--table-row-odd))',
					border: 'hsl(var(--table-border))',
					hover: 'hsl(var(--table-hover))',
				},
				
				/* Enhanced theme colors */
				hero: {
					bg: 'hsl(var(--hero-bg))',
					text: 'hsl(var(--hero-text))',
					accent: 'hsl(var(--hero-accent))',
				},
				
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius-md)',
				sm: 'var(--radius-sm)'
			},
			keyframes: {
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'fade-in': 'fade-in 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
