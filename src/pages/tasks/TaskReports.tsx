/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Container, Grid, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
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

function TasksGeneralReport() {
    const { themeStretch } = useSettingsContext()

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')

    const { enqueueSnackbar } = useSnackbar()

    // get query params
    let query = 'status=all'
    if (initialStartDate) {
        query = `${query}&startDate=${initialStartDate}`
    }
    if (initialEndDate) {
        query = `${query}&endDate=${initialEndDate}`
    }
    // const { services } = useServiceReport({ query })

    // const [loading, setLoading] = useState<boolean>(false)

    //  dates
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(
        initialStartDate ? new Date(initialStartDate) : null
    )
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(
        initialEndDate ? new Date(initialEndDate) : null
    )

    const { tasks, mutate } = useTaskByStatus({ query })

    const onFilterStartDate = (newValue: any) => {
        setFilterStartDate(newValue)
        handleDateFilter({ s: newValue, e: filterEndDate })
    }
    const onFilterEndDate = (newValue: any) => {
        setFilterEndDate(newValue)
        handleDateFilter({ s: filterStartDate, e: newValue })
    }

    const handleDateFilter = async ({ s, e }: any) => {
        try {
            // setLoading(true)
            const startDate = s ? format(s, 'yyyy-MM-dd') : null
            const endDate = e ? format(e, 'yyyy-MM-dd') : null

            let queryObj = {}
            if (startDate) {
                queryObj = { ...queryObj, startDate }
            }
            if (endDate) {
                queryObj = { ...queryObj, endDate }
            }

            const q = new URLSearchParams(queryObj).toString()
            navigate(`${PATH_DASHBOARD.tasks.report}?${q}`)
        } catch (err: any) {
            const msg =
                err?.error || err.message || 'Error loading attendant details'
            enqueueSnackbar(msg, { variant: 'error' })
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <ErrorBoundary
                fallback={<InternalError error="Error loading tasks" />}
            >
                <CustomBreadcrumbs
                    heading="Tasks"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'tasks',
                            href: PATH_DASHBOARD.tasks.root,
                        },
                        {
                            name: `reports`,
                            href: PATH_DASHBOARD.tasks.root,
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

                            <Stack display="flex" direction="row" gap={2}>
                                <DatePicker
                                    label="Start date"
                                    value={filterStartDate}
                                    onChange={onFilterStartDate}
                                    slotProps={{
                                        textField: { variant: 'outlined' },
                                    }}
                                />

                                <DatePicker
                                    label="End date"
                                    value={filterEndDate}
                                    onChange={onFilterEndDate}
                                    slotProps={{
                                        textField: { variant: 'outlined' },
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <TasksTable
                            data={tasks}
                            mutate={mutate}
                            handleUpdate={() => {}}
                        />
                    </Grid>
                </Grid>
            </ErrorBoundary>
        </Container>
    )
}

export default TasksGeneralReport
