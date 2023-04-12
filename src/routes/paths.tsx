// ----------------------------------------------------------------------

function path(root: any, sublink: any) {
    return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = '/'

// ----------------------------------------------------------------------

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    register: path(ROOTS_AUTH, '/register'),
    loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
    registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
    verify: path(ROOTS_AUTH, '/verify'),
    resetPassword: path(ROOTS_AUTH, '/reset-password'),
    newPassword: path(ROOTS_AUTH, '/new-password'),
}

// export const PATH_PAGE = {
//     comingSoon: '/coming-soon',
//     maintenance: '/maintenance',
//     pricing: '/pricing',
//     payment: '/payment',
//     about: '/about-us',
//     contact: '/contact-us',
//     faqs: '/faqs',
//     page403: '/403',
//     page404: '/404',
//     page500: '/500',
//     components: '/components',
// }

export const PATH_DASHBOARD = {
    root: path(ROOTS_DASHBOARD, 'dashboard'),
    tasks: {
        root: path(ROOTS_DASHBOARD, 'tasks'),
        new: path(ROOTS_DASHBOARD, 'tasks/new'),
        newWithId: (id: string | number) =>
            path(ROOTS_DASHBOARD, `tasks/new?vehicle_id=${id}`),
        details: (id: string | number) =>
            path(ROOTS_DASHBOARD, `tasks/detail/${id}`),
        pending: path(ROOTS_DASHBOARD, 'tasks/pending'),
        completed: path(ROOTS_DASHBOARD, 'tasks/completed'),
        canceled: path(ROOTS_DASHBOARD, 'tasks'),
        status: (status: string) =>
            path(ROOTS_DASHBOARD, `tasks/status/${status}`),
    },
    services: {
        root: path(ROOTS_DASHBOARD, 'services'),
        new: path(ROOTS_DASHBOARD, 'services/new'),
        details: (id: string | number) =>
            path(ROOTS_DASHBOARD, `services/details/${id}`),
        report: path(ROOTS_DASHBOARD, 'services/report'),
    },
    products: {
        root: path(ROOTS_DASHBOARD, 'products'),
        new: path(ROOTS_DASHBOARD, 'products/new'),
        details: (id: string | number) =>
            path(ROOTS_DASHBOARD, `products/details/${id}`),
        sell: path(ROOTS_DASHBOARD, 'products/sell'),
        report: path(ROOTS_DASHBOARD, 'products/report'),
    },
    payments: {
        root: path(ROOTS_DASHBOARD, 'payments'),
        details: (id: string | number) =>
            path(ROOTS_DASHBOARD, `payments/details/${id}`),
    },
    attendants: {
        root: path(ROOTS_DASHBOARD, 'attendants'),
        new: path(ROOTS_DASHBOARD, 'attendants/new'),
        details: (id: string | number) =>
            path(ROOTS_DASHBOARD, `attendants/details/${id}`),
        report: path(ROOTS_DASHBOARD, 'attendants/report'),
    },
    reports: {
        root: path(ROOTS_DASHBOARD, 'reports'),
        details: (id: string | number) =>
            path(ROOTS_DASHBOARD, `reports/details/${id}`),

        sales: path(ROOTS_DASHBOARD, 'reports/sales'),
        services: path(ROOTS_DASHBOARD, 'reports/services'),
        revenue: path(ROOTS_DASHBOARD, 'reports/revenue'),
        expenses: path(ROOTS_DASHBOARD, 'reports/expenses'),
        vehicleType: path(ROOTS_DASHBOARD, 'reports/vehicle-type'),
        salesDetails: (date: string | number) =>
            path(ROOTS_DASHBOARD, `reports/sales/details/${date}`),
        vehicleTypeDetails: (type: string) =>
            path(ROOTS_DASHBOARD, `reports/vehicle-type/details/${type}`),
        durationTasks: (date: string | number) =>
            path(ROOTS_DASHBOARD, `reports/tasks/details/${date}`),
    },
    users: {
        root: path(ROOTS_DASHBOARD, 'users'),
        new: path(ROOTS_DASHBOARD, 'users/new'),
        list: path(ROOTS_DASHBOARD, 'users/list'),
        cards: path(ROOTS_DASHBOARD, 'users/cards'),
        profile: path(ROOTS_DASHBOARD, 'users/profile'),
        account: path(ROOTS_DASHBOARD, 'users/account'),
        edit: (name: any) => path(ROOTS_DASHBOARD, `user/${name}/edit`),
        details: (id: any) => path(ROOTS_DASHBOARD, `users/${id}`),
    },
    account: {
        root: path(ROOTS_DASHBOARD, 'settings/account'),
        resetPassword: path(ROOTS_DASHBOARD, 'settings/account/reset-password'),
    },
    systemData: {
        root: path(ROOTS_DASHBOARD, 'system-data'),
        bodyTypes: path(ROOTS_DASHBOARD, 'system-data/body-types'),
        vehicles: path(ROOTS_DASHBOARD, 'system-data/vehicles'),
        vehilceDetails: (id: any) =>
            path(ROOTS_DASHBOARD, `system-data/vehicles/${id}`),
        pricelist: path(ROOTS_DASHBOARD, 'system-data/pricelist'),
        clients: path(ROOTS_DASHBOARD, 'system-data/clients'),
        accounts: path(ROOTS_DASHBOARD, 'system-data/accounts'),
    },
    settings: {
        root: path(ROOTS_DASHBOARD, 'settings'),
    },
    blank: path(ROOTS_DASHBOARD, 'blank'),
    permissionDenied: path(ROOTS_DASHBOARD, 'permission-denied'),
}
