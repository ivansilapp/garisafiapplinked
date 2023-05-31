import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import {
    ADMIN_ROLE,
    CASHIER_ROLE,
    MANAGER_ROLE,
    ROLES,
} from '../../utils/roles'

export const AttendantsPage = Loadable(lazy(() => import('./AttendantsPage')))
export const AttendantsDetail = Loadable(
    lazy(() => import('./AttendantDetail'))
)

export const attendantsRoutes = [
    {
        path: 'attendants',
        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE, MANAGER_ROLE, CASHIER_ROLE]}
                module={ROLES.Attendants}
                hasContent
            >
                <AttendantsPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'attendants/details/:id',
        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE, MANAGER_ROLE, CASHIER_ROLE]}
                hasContent
                module={ROLES.Attendants}
            >
                <AttendantsDetail />
            </RoleBasedGuard>
        ),
    },
]
