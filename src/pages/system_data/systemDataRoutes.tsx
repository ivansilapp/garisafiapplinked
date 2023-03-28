import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, MANAGER_ROLE } from '../../utils/roles'

export const SystemDataPage = Loadable(lazy(() => import('./SystemDataPage')))
export const VehiclesPage = Loadable(
    lazy(() => import('./_pages/VehiclesPage'))
)

export const VehicleDetail = Loadable(
    lazy(() => import('./_pages/VehicleDetail'))
)

export const BodyTypesPage = Loadable(
    lazy(() => import('./_pages/BodyTypesPage'))
)
export const PricelistPage = Loadable(
    lazy(() => import('./_pages/PricelistPage'))
)
export const ClientsPage = Loadable(lazy(() => import('./_pages/ClientsPage')))
export const AccountsPage = Loadable(lazy(() => import('./_pages/AccountPage')))

export const systemDataRoutes = [
    {
        path: 'system-data',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <SystemDataPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'system-data/vehicles',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <VehiclesPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'system-data/vehicles/:id',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <VehicleDetail />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'system-data/body-types',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <BodyTypesPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'system-data/pricelist',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <PricelistPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'system-data/clients',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <ClientsPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'system-data/accounts',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <AccountsPage />
            </RoleBasedGuard>
        ),
    },
]
