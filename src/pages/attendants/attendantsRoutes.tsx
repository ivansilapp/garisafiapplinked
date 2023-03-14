import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, MANAGER_ROLE } from '../../utils/roles'

export const AttendantsPage = Loadable(lazy(() => import('./AttendantsPage')))

export const attendantsRoutes = [
    {
        path: 'attendants',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <AttendantsPage />
            </RoleBasedGuard>
        ),
    },
]
