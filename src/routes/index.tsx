import { Navigate, useRoutes } from 'react-router-dom'
// auth
import AuthGuard from '../auth/AuthGuard'
import GuestGuard from '../auth/GuestGuard'

// layouts
// import MainLayout from '../layouts/main'
// import SimpleLayout from '../layouts/simple'
import CompactLayout from '../layouts/compact'
import DashboardLayout from '../layouts/dashboard'

// config
import { PATH_AFTER_LOGIN } from '../config-global'
//
import {
    // Auth
    LoginPage,
    RegisterPage,
    Dashboard,
    Tasks,
    ResetPasswordPage,
    NewPasswordPage,
    VerifyCodePage,
    Page403,
    Page404,
    Page500,
    MaintenancePage,
} from './elements'
import RoleBasedGuard from '../auth/RoleBasedGuard'
import { userRoutes } from '../pages/users/UsersRouter'
import { productRoutes } from '../pages/products/productRoutes'
import { servicesRoutes } from '../pages/services/serviceRoutes'
import { attendantsRoutes } from '../pages/attendants/attendantsRoutes'
import { reportsRoutes } from '../pages/reports/reportRoutes'
import { tasksRoutes } from '../pages/tasks/tasksRoutes'
import { settingsRoutes } from '../pages/settings/settingsRoutes'
import { systemDataRoutes } from '../pages/system_data/systemDataRoutes'
import { paymentRoutes } from '../pages/payments/paymentRoutes'
import { commissionsRoutes } from '../pages/commissions/commissionsRouter'

// ----------------------------------------------------------------------

export default function Router() {
    return useRoutes([
        // Auth
        {
            path: 'auth',
            children: [
                {
                    path: 'login',
                    element: (
                        <GuestGuard>
                            <LoginPage />
                        </GuestGuard>
                    ),
                },
                {
                    path: 'register',
                    element: (
                        <GuestGuard>
                            <RegisterPage />
                        </GuestGuard>
                    ),
                },
                { path: 'login-unprotected', element: <LoginPage /> },
                { path: 'register-unprotected', element: <RegisterPage /> },
                {
                    element: <CompactLayout />,
                    children: [
                        {
                            path: 'reset-password',
                            element: <ResetPasswordPage />,
                        },
                        { path: 'new-password', element: <NewPasswordPage /> },
                        { path: 'verify', element: <VerifyCodePage /> },
                    ],
                },
            ],
        },

        // Dashboard
        {
            path: '',
            element: (
                <AuthGuard>
                    <DashboardLayout />
                </AuthGuard>
            ),
            children: [
                {
                    element: <Navigate to={PATH_AFTER_LOGIN} replace />,
                    index: true,
                },
                { path: '/', element: <Dashboard /> },
                { path: 'dashboard', element: <Dashboard /> },
                // {
                //     path: 'tasks',
                //     element: (
                //         <RoleBasedGuard roles={['admin']} hasContent>
                //             <Tasks />
                //         </RoleBasedGuard>
                //     ),
                // },
                ...tasksRoutes,
                ...userRoutes,
                ...productRoutes,
                ...servicesRoutes,
                ...attendantsRoutes,
                ...reportsRoutes,
                ...settingsRoutes,
                ...systemDataRoutes,
                ...paymentRoutes,
                ...commissionsRoutes,
            ],
        },
        {
            element: <CompactLayout />,
            children: [
                { path: 'maintenance', element: <MaintenancePage /> },
                { path: '500', element: <Page500 /> },
                { path: '404', element: <Page404 /> },
                { path: '403', element: <Page403 /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
    ])
}
