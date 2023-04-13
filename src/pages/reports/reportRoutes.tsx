import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE } from '../../utils/roles'

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

export const reportsRoutes = [
    {
        path: 'reports',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <ReportsPage />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/revenue',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <RevenueReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/sales',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <SalesReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/services',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <ServiceReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/attendants',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <AttendantsReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/vehicle-type',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <VehicleTypeReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/sales/details/:date',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <UngroupedSalesReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/tasks/details/:date',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <TaskDurationReport />
            </RoleBasedGuard>
        ),
    },
    {
        path: 'reports/vehicle-type/details/:type',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <VehicleTypeDurationTasksReport />
            </RoleBasedGuard>
        ),
    },
]
