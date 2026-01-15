/**
 * Navigation Configuration
 * Centralized navigation links for header component
 */

export interface NavLink {
    href: string;
    label: string;
    count?: string;
    icon?: string;
    isExternal?: boolean;
    isLastMain?: boolean;
}

export const mainNavLinks: NavLink[] = [
    {
        href: '/work',
        label: 'Work',
        count: '(17)',
    },
    {
        href: '/about',
        label: 'About',
    },
    {
        href: '/connect',
        label: "Let's talk",
        count: '+',
        isLastMain: true,
    },
];

export const externalNavLinks: NavLink[] = [
    {
        href: '#',
        label: 'StringTune',
        isExternal: true,
    },
    {
        href: '#',
        label: 'Exp.',
        isExternal: true,
    },
];

export const allNavLinks = [...mainNavLinks, ...externalNavLinks];
