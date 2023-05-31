import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
// import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, ROLES } from '../../utils/roles'

export const UsersPage = Loadable(lazy(() => import('./Users')))
export const NewUser = Loadable(lazy(() => import('./_pages/NewUser')))
export const UserDetail = Loadable(lazy(() => import('./_pages/UserDetail')))
export const EditUser = Loadable(lazy(() => import('./_pages/EditUser')))

export const userRoutes = [
    {
        path: 'users',
        element: (
            <RoleBasedGuard
                module={ROLES.Users}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <UsersPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'users/new',
        element: (
            <RoleBasedGuard
                module={ROLES.Users}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <NewUser />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'users/:id',
        element: (
            <RoleBasedGuard
                module={ROLES.Users}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <UserDetail />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'users/edit/:id',
        element: (
            <RoleBasedGuard
                module={ROLES.Users}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <EditUser />
            </RoleBasedGuard>
        ),
    },
]
