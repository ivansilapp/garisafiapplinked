import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import {
    ADMIN_ROLE,
    CASHIER_ROLE,
    MANAGER_ROLE,
    ROLES,
} from '../../utils/roles'

export const TasksPage = Loadable(lazy(() => import('./TasksPage')))
export const CreateTasksPage = Loadable(lazy(() => import('./NewTaskPage')))
export const TaskDetailPage = Loadable(lazy(() => import('./TaskDetail')))
const TaskStatusPage = Loadable(lazy(() => import('./TaskStatusPage')))
const TaskReportPage = Loadable(lazy(() => import('./TaskReports')))

export const tasksRoutes = [
    {
        path: 'tasks',
        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE, MANAGER_ROLE, CASHIER_ROLE]}
                hasContent
                module={ROLES.Tasks}
            >
                <TasksPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'tasks/new',
        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE, MANAGER_ROLE, CASHIER_ROLE]}
                module={ROLES.Tasks}
                hasContent
            >
                <CreateTasksPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'tasks/detail/:id',
        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE, MANAGER_ROLE, CASHIER_ROLE]}
                module={ROLES.Tasks}
                hasContent
            >
                <TaskDetailPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'tasks/status/:status',
        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE, MANAGER_ROLE, CASHIER_ROLE]}
                module={ROLES.Tasks}
                hasContent
            >
                <TaskStatusPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'tasks/report',
        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE, MANAGER_ROLE, CASHIER_ROLE]}
                module={ROLES.Tasks}
                hasContent
            >
                <TaskReportPage />
            </RoleBasedGuard>
        ),
    },
]
