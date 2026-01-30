import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    MapPin,
    Truck,
    Users,
    FileText,
    AlertCircle,
    Calendar,
    Package,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const role = user?.role || 'warga';

    // Menu items berdasarkan role
    const getMainNavItems = (): NavItem[] => {
        const baseItems: NavItem[] = [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ];

        switch (role) {
            case 'admin':
                return [
                    ...baseItems,
                    {
                        title: 'Wilayah',
                        href: '/admin/wilayah',
                        icon: MapPin,
                    },
                    {
                        title: 'Armada',
                        href: '/admin/armada',
                        icon: Truck,
                    },
                    {
                        title: 'Petugas',
                        href: '/admin/petugas',
                        icon: Users,
                    },
                    {
                        title: 'Pengajuan',
                        href: '/admin/pengajuan',
                        icon: FileText,
                    },
                ];

            case 'petugas':
                return [
                    ...baseItems,
                    {
                        title: 'Penugasan',
                        href: '/petugas/penugasan',
                        icon: Calendar,
                    },
                    {
                        title: 'Pengajuan',
                        href: '/petugas/pengajuan',
                        icon: FileText,
                    },
                ];

            case 'warga':
                return [
                    ...baseItems,
                    {
                        title: 'Pengajuan',
                        href: '/warga/pengajuan',
                        icon: Package,
                    },
                    {
                        title: 'Aduan',
                        href: '/warga/aduan',
                        icon: AlertCircle,
                    },
                ];

            default:
                return baseItems;
        }
    };

    const mainNavItems = getMainNavItems();


    // Dashboard URL berdasarkan role
    const getDashboardUrl = () => {
        switch (role) {
            case 'admin':
                return '/admin/dashboard';
            case 'petugas':
                return '/petugas/dashboard';
            case 'warga':
                return '/warga/dashboard';
            default:
                return dashboard();
        }
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={getDashboardUrl()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
