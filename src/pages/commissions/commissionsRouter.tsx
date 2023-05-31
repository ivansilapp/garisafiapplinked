import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, MANAGER_ROLE, ROLES } from '../../utils/roles'

export const CommissionsPage = Loadable(lazy(() => import('./CommissionsPage')))

export const commissionsRoutes = [
    {
        path: 'commissions',
        element: (
            <RoleBasedGuard
                module={ROLES.Commisions}
                roles={[ADMIN_ROLE, MANAGER_ROLE]}
                hasContent
            >
                <CommissionsPage />
            </RoleBasedGuard>
        ),
    },
]
