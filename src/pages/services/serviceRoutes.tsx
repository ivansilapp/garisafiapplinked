import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, MANAGER_ROLE } from '../../utils/roles'

export const ServicesPage = Loadable(lazy(() => import('./ServicesPage')))

export const servicesRoutes = [
    {
        path: 'services',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <ServicesPage />
            </RoleBasedGuard>
        ),
    },
]
