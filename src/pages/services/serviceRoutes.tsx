import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, MANAGER_ROLE, ROLES } from '../../utils/roles'

export const ServicesPage = Loadable(lazy(() => import('./ServicesPage')))

export const servicesRoutes = [
    {
        path: 'services',
        element: (
            <RoleBasedGuard
                module={ROLES.Services}
                roles={[ADMIN_ROLE, MANAGER_ROLE]}
                hasContent
            >
                <ServicesPage />
            </RoleBasedGuard>
        ),
    },
]
