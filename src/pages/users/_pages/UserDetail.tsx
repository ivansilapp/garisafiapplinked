import { useParams } from 'react-router'
import { Checkbox, Container, Typography } from '@mui/material'
import useUser from '../../../hooks/user/useUser'
import { useAuthContext } from '../../../auth/useAuthContext'
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../../routes/paths'
import { useSettingsContext } from '../../../components/settings'
import UserRightsTable from '../_components/UserRightsTable'

function UserDetail() {
    const { themeStretch } = useSettingsContext()
    const { id } = useParams()
    const { user, rights, mutate } = useUser({ id: Number(id) })
    const { modules }: any = useAuthContext()

    // console.log('modules', modules)

    // console.log(rights)

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={`${user?.name} account` ?? 'User details'}
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    { name: 'Users', href: PATH_DASHBOARD.users.root },
                ]}
            />
            <div>
                {/* <Typography mb={3} variant="h4"> {user.name} </Typography> */}
                <UserRightsTable
                    data={modules ?? []}
                    userId={user?.id ?? id}
                    rights={rights ?? []}
                    mutate={mutate}
                />
            </div>
        </Container>
    )
}

export default UserDetail
