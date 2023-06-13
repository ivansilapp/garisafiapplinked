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
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { DatePicker } from '@mui/x-date-pickers'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'

import useRedeemedTasks from '../../hooks/task/useRedeemedTasks'
import TasksTable from '../tasks/_components/TasksTable'
import useTipsReport from '../../hooks/tips/useTipsReport'
import TipsTable from './_components/TipsTable'

function TipsReport() {
    const { themeStretch } = useSettingsContext()
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')

    const [filterStartDate, setFilterStartDate] = useState<Date | null>(
        initialStartDate ? new Date(initialStartDate) : null
    )
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(
        initialEndDate ? new Date(initialEndDate) : null
    )

    let query = ''

    if (initialStartDate) {
        query = `${query}startDate=${initialStartDate}`
    }

    if (initialEndDate) {
        query = `${query}&endDate=${initialEndDate}`
    }

    const { tips, loading, mutate } = useTipsReport({ query })

    // console.log(tasks, 'tasks')

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
            navigate(`${PATH_DASHBOARD.reports.tips}?${q}`)
        } catch (err: any) {
            const msg = err?.error || err.message || 'something went wrong'
            // enqueueSnackbar(msg, { variant: 'error' })
            console.log(msg)
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Tips report"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'reports',
                        href: PATH_DASHBOARD.reports.root,
                    },
                    {
                        name: 'Tips reports',
                        href: PATH_DASHBOARD.reports.tips,
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
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}

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
                    <TipsTable
                        data={tips ?? []}
                        mutate={mutate}
                        handleUpdate={() => ''}
                        readOnly
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default TipsReport
