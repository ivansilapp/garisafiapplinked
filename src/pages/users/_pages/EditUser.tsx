import { Button, Container } from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs'
import Iconify from '../../../components/iconify'
import { useSettingsContext } from '../../../components/settings'
import { PATH_DASHBOARD } from '../../../routes/paths'
import UserNewEditForm from '../_components/UserNewEditForm'
import useUser from '../../../hooks/user/useUser'
import InternalError from '../../../components/shared/500Error'

function EditUsers() {
    const { id } = useParams<{ id: string }>()

    // const { user } = useUse
    const { user } = useUser({ id: id ?? '' })

    const { themeStretch } = useSettingsContext()
    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Create User"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    { name: 'User', href: PATH_DASHBOARD.users.root },
                    { name: 'Update' },
                ]}
                // action={
                //     <Button
                //         component={RouterLink}
                //         to={PATH_DASHBOARD.users.new}
                //         variant="contained"
                //         startIcon={<Iconify icon="eva:plus-fill" />}
                //     >
                //         New User
                //     </Button>
                // }
            />

            <ErrorBoundary
                fallback={<InternalError error="Error loading user data" />}
            >
                <Suspense fallback={<p>Loading...</p>}>
                    <UserNewEditForm isEdit currentUser={user} />
                </Suspense>
            </ErrorBoundary>

            {/* <UserNewEditForm /> */}
        </Container>
    )
}

export default EditUsers
