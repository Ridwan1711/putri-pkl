import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    MapPin,
    Truck,
    Users,
    FileText,
    AlertCircle,
    Calendar,
    Package,
    ClipboardList,
    Pencil,
    History,
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
                        title: 'Jadwal Rutin',
                        href: '/admin/jadwal-rutin',
                        icon: Calendar,
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
                        icon: ClipboardList,
                    },
                    {
                        title: 'Peta',
                        href: '/petugas/peta',
                        icon: MapPin,
                    },
                    {
                        title: 'Update Status',
                        href: '/petugas/update-status',
                        icon: Pencil,
                    },
                    {
                        title: 'Riwayat',
                        href: '/petugas/riwayat',
                        icon: History,
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
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton  asChild className='flex items-center justify-center h-32 py-4'>
                            <Link href={getDashboardUrl()} prefetch>
                                <img src='/images/logo-tasik.png' alt='Logo Tasikmalaya' className='w-full h-full object-contain'/>
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
