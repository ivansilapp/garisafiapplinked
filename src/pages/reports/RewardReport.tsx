/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Button,
    Container,
    Grid,
    Stack,
    Typography,
    Backdrop,
    CircularProgress,
    TextField,
} from '@mui/material'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'

import useRedeemedTasks from '../../hooks/task/useRedeemedTasks'
import TasksTable from '../tasks/_components/TasksTable'

function RewardReport() {
    const { themeStretch } = useSettingsContext()
    // const navigate = useNavigate()

    const { tasks, loading, mutate } = useRedeemedTasks()

    // console.log(tasks, 'tasks')

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Services report"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'reports',
                        href: PATH_DASHBOARD.reports.root,
                    },
                    {
                        name: 'redeemed tasks',
                        href: PATH_DASHBOARD.reports.services,
                    },
                ]}
            />

            {loading && (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={loading}
                    onClick={() => {}}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}

            <Grid container>
                <Grid item xs={12}>
                    <TasksTable
                        data={tasks ?? []}
                        mutate={mutate}
                        handleUpdate={() => {}}
                        readOnly
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default RewardReport
