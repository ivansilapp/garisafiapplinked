import { Suspense, lazy, LazyExoticComponent } from 'react'
// components
import LoadingScreen from '../components/loading-screen'

// ----------------------------------------------------------------------

// eslint-disable-next-line react/display-name, react/function-component-definition
const Loadable = (Component: LazyExoticComponent<() => JSX.Element>) =>
    // eslint-disable-next-line react/display-name
    function (props: any) {
        return (
            <Suspense fallback={<LoadingScreen />}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...props} />
            </Suspense>
        )
    }

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')))
export const RegisterPage = Loadable(
    lazy(() => import('../pages/auth/RegisterPage'))
)
export const VerifyCodePage = Loadable(
    lazy(() => import('../pages/auth/VerifyCodePage'))
)
export const NewPasswordPage = Loadable(
    lazy(() => import('../pages/auth/NewPasswordPage'))
)
export const ResetPasswordPage = Loadable(
    lazy(() => import('../pages/auth/ResetPasswordPage'))
)

export const MaintenancePage = Loadable(
    lazy(() => import('../pages/MaintenancePage'))
)

export const Dashboard = Loadable(
    lazy(() => import('../pages/dashboard/index'))
)

export const Tasks = Loadable(lazy(() => import('../pages/tasks/TasksPage')))

export const Page500 = Loadable(lazy(() => import('../pages/Page500')))
export const Page403 = Loadable(lazy(() => import('../pages/Page403')))
export const Page404 = Loadable(lazy(() => import('../pages/Page404')))
