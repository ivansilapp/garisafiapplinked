import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, CASHIER_ROLE, ROLES } from '../../utils/roles'

export const ReportsPage = Loadable(lazy(() => import('./ReportsPage')))
const RevenueReport = Loadable(lazy(() => import('./RevenueReport')))
const SalesReport = Loadable(lazy(() => import('./SalesReport')))
const ServiceReport = Loadable(lazy(() => import('./ServiceReport')))
const AttendantsReport = Loadable(lazy(() => import('./AttendantsReport')))
const VehicleTypeReport = Loadable(lazy(() => import('./VehicleTypeReport')))

const UngroupedSalesReport = Loadable(lazy(() => import('./UngroupedSales')))

// tasks

const TaskDurationReport = Loadable(
    lazy(() => import('./DurationServiceReport'))
)

const VehicleTypeDurationTasksReport = Loadable(
    lazy(() => import('./VehicleTypeDurationTasksReport'))
)

const PigeonholesReport = Loadable(lazy(() => import('./PigeonholesReport')))

const PigeonholesHistory = Loadable(lazy(() => import('./PigeonholesHistory')))

const RewardReport = Loadable(lazy(() => import('./RewardReport')))

export const reportsRoutes = [
    {
        path: 'reports',

        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE]}
                module={ROLES.Reports}
                hasContent
            >
                <ReportsPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/revenue',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <RevenueReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/sales',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <SalesReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/services',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <ServiceReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/attendants',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <AttendantsReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/vehicle-type',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <VehicleTypeReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/sales/details/:date',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <UngroupedSalesReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/tasks/details/:date',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <TaskDurationReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/vehicle-type/details/:type',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <VehicleTypeDurationTasksReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/pigeonholes',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE, CASHIER_ROLE]}
                hasContent
            >
                <PigeonholesReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/pigeonholes/history',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE, CASHIER_ROLE]}
                hasContent
            >
                <PigeonholesHistory />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/rewards',
        element: (
            <RoleBasedGuard
                module={ROLES.Reports}
                roles={[ADMIN_ROLE]}
                hasContent
            >
                <RewardReport />
            </RoleBasedGuard>
        ),
    },
]
