import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, CASHIER_ROLE, MANAGER_ROLE } from '../../utils/roles'

export const TasksPage = Loadable(lazy(() => import('./TasksPage')))

export const tasksRoutes = [
    {
        path: 'tasks',
        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE, MANAGER_ROLE, CASHIER_ROLE]}
                hasContent
            >
                <TasksPage />
            </RoleBasedGuard>
        ),
    },
]
