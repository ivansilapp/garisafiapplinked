import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE } from '../../utils/roles'

export const ReportsPage = Loadable(lazy(() => import('./ReportsPage')))

export const reportsRoutes = [
    {
        path: 'reports',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <ReportsPage />
            </RoleBasedGuard>
        ),
    },
]
