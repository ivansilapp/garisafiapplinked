import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
// import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE } from '../../utils/roles'

export const UsersPage = Loadable(lazy(() => import('./Users')))
export const NewUser = Loadable(lazy(() => import('./_pages/NewUser')))
export const UserDetail = Loadable(lazy(() => import('./_pages/UserDetail')))

export const userRoutes = [
    {
        path: 'users',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <UsersPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'users/new',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <NewUser />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'users/:id',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <UserDetail />
            </RoleBasedGuard>
        ),
    },
]
