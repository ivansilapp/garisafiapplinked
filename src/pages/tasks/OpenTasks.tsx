/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Container, Grid, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import useTaskByStatus from '../../hooks/task/useTaskStatus'
import { PATH_DASHBOARD } from '../../routes/paths'
import TasksTable from './_components/TasksTable'
import { useSnackbar } from '../../components/snackbar'
import useOpenTasks from '../../hooks/task/useOpenTasks'
import OpenTasksTable from './_components/OpenTasksTable'

function OpenTasks() {
    const { themeStretch } = useSettingsContext()

    // const { enqueueSnackbar } = useSnackbar()

    const { tasks } = useOpenTasks()

    // console.log('open taks', tasks)

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <ErrorBoundary
                fallback={<InternalError error="Error loading tasks" />}
            >
                <CustomBreadcrumbs
                    heading="Open Tasks"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'tasks',
                            href: PATH_DASHBOARD.tasks.root,
                        },
                        {
                            name: `open tasks`,
                            href: PATH_DASHBOARD.tasks.open,
                        },
                    ]}
                />

                <Grid container>
                    <Grid item xs={12} sx={{ mb: 3 }}>
                        <Stack
                            display="flex"
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <div />
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        {/* <TasksTable
                            data={tasks}
                            mutate={mutate}
                            handleUpdate={() => ''}
                        /> */}
                        <OpenTasksTable data={tasks} />
                    </Grid>
                </Grid>
            </ErrorBoundary>
        </Container>
    )
}

export default OpenTasks
