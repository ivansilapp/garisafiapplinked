import { Button, Container } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs'
import Iconify from '../../../components/iconify'
import { useSettingsContext } from '../../../components/settings'
import { PATH_DASHBOARD } from '../../../routes/paths'
import UserNewEditForm from '../_components/UserNewEditForm'

function Users() {
    const { themeStretch } = useSettingsContext()
    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Create User"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    { name: 'User', href: PATH_DASHBOARD.users.root },
                    { name: 'New' },
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

            <UserNewEditForm />
        </Container>
    )
}

export default Users
