import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, MANAGER_ROLE } from '../../utils/roles'

export const SettingsPage = Loadable(lazy(() => import('./SettingsPage')))

export const settingsRoutes = [
    {
        path: 'settings',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE, MANAGER_ROLE]} hasContent>
                <SettingsPage />
            </RoleBasedGuard>
        ),
    },
]
