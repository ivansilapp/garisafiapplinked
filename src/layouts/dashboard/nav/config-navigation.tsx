// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// components
import Label from '../../../components/label'
import Iconify from '../../../components/iconify'
import SvgColor from '../../../components/svg-color'
import { ADMIN_ROLE, MANAGER_ROLE } from '../../../utils/roles'

// ----------------------------------------------------------------------

const icon = (name: string) => (
    <SvgColor
        src={`/assets/icons/navbar/${name}.svg`}
        sx={{ width: 1, height: 1 }}
    />
)

const ICONS = {
    blog: icon('ic_blog'),
    cart: icon('ic_cart'),
    chat: icon('ic_chat'),
    mail: icon('ic_mail'),
    user: icon('ic_user'),
    file: icon('ic_file'),
    lock: icon('ic_lock'),
    label: icon('ic_label'),
    blank: icon('ic_blank'),
    kanban: icon('ic_kanban'),
    folder: icon('ic_folder'),
    banking: icon('ic_banking'),
    booking: icon('ic_booking'),
    invoice: icon('ic_invoice'),
    calendar: icon('ic_calendar'),
    disabled: icon('ic_disabled'),
    external: icon('ic_external'),
    menuItem: icon('ic_menu_item'),
    ecommerce: icon('ic_ecommerce'),
    analytics: icon('ic_analytics'),
    dashboard: icon('ic_dashboard'),
}

interface NavItem {
    title: string
    path: string
    icon: JSX.Element
    role?: string[]
    children?: { title: string; path: string }[]
}
export interface INav {
    subheader: string
    items: NavItem[]
}
const navConfig: INav[] = [
    // GENERAL
    // ----------------------------------------------------------------------
    {
        subheader: 'general',
        items: [
            {
                title: 'Dashboard',
                path: PATH_DASHBOARD.root,
                icon: ICONS.dashboard,
            },
            {
                title: 'Tasks',
                path: PATH_DASHBOARD.tasks.root,
                icon: ICONS.cart,
                role: [ADMIN_ROLE],
            },
            {
                title: 'Products',
                path: PATH_DASHBOARD.products.root,
                icon: ICONS.ecommerce,
            },
            {
                title: 'Services',
                path: PATH_DASHBOARD.services.root,
                icon: ICONS.folder,
            },
            {
                title: 'Attendants',
                path: PATH_DASHBOARD.attendants.root,
                icon: ICONS.file,
            },
            {
                title: 'reports',
                path: PATH_DASHBOARD.reports.root,
                icon: ICONS.banking,
            },
        ],
    },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
        subheader: 'management',
        items: [
            // USER
            {
                title: 'users',
                path: PATH_DASHBOARD.users.root,
                icon: ICONS.user,
                children: [
                    { title: 'list', path: PATH_DASHBOARD.users.root },
                    { title: 'suspended', path: PATH_DASHBOARD.users.cards },
                ],
            },
            {
                title: 'system data',
                path: PATH_DASHBOARD.systemData.root,
                icon: ICONS.dashboard,
                children: [
                    {
                        title: 'body types',
                        path: PATH_DASHBOARD.systemData.bodyTypes,
                    },
                    {
                        title: 'vehicles',
                        path: PATH_DASHBOARD.systemData.vehicles,
                    },
                    {
                        title: 'pricelist',
                        path: PATH_DASHBOARD.systemData.pricelist,
                    },
                    {
                        title: 'accounts',
                        path: PATH_DASHBOARD.systemData.accounts,
                    },
                    {
                        title: 'clients',
                        path: PATH_DASHBOARD.systemData.clients,
                    },
                ],
            },
            {
                title: 'settings',
                path: PATH_DASHBOARD.settings.root,
                icon: ICONS.dashboard,
            },

            // // E-COMMERCE
            // {
            //     title: 'ecommerce',
            //     path: PATH_DASHBOARD.eCommerce.root,
            //     icon: ICONS.cart,
            //     children: [
            //         { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
            //         {
            //             title: 'product',
            //             path: PATH_DASHBOARD.eCommerce.demoView,
            //         },
            //         { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
            //         { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
            //         { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
            //         {
            //             title: 'checkout',
            //             path: PATH_DASHBOARD.eCommerce.checkout,
            //         },
            //     ],
            // },

            // // INVOICE
            // {
            //     title: 'invoice',
            //     path: PATH_DASHBOARD.invoice.root,
            //     icon: ICONS.invoice,
            //     children: [
            //         { title: 'list', path: PATH_DASHBOARD.invoice.list },
            //         { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
            //         { title: 'create', path: PATH_DASHBOARD.invoice.new },
            //         { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
            //     ],
            // },
        ],
    },
]

export default navConfig
