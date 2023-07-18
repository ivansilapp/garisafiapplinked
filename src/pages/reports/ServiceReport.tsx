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
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { DatePicker } from '@mui/x-date-pickers'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import { useSnackbar } from '../../components/snackbar'
import axios from '../../utils/axios'
import { apiUrl } from '../../config-global'
import GroupedTasksTable from '../tasks/_components/GroupedTasksTable'
import useServiceReport from '../../hooks/service/useServicesReport'
import AnnualChart from './_components/AnnualChart'
import { fDateShort } from '../../utils/formatTime'
import AnalyticsChart from './_components/AnalyticsChart'

const INPUT_WIDTH = 160

function ServicesReport() {
    const { themeStretch } = useSettingsContext()
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')

    // get query params
    let query = ''
    if (initialStartDate) {
        query = `${query}startDate=${initialStartDate}`
    }
    if (initialEndDate) {
        query = `${query}&endDate=${initialEndDate}`
    }
    const { services } = useServiceReport({ query })

    const [loading, setLoading] = useState<boolean>(false)

    //  dates
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(
        initialStartDate ? new Date(initialStartDate) : null
    )
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(
        initialEndDate ? new Date(initialEndDate) : null
    )

    const { enqueueSnackbar } = useSnackbar()

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
            setLoading(true)
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
            navigate(`${PATH_DASHBOARD.reports.services}?${q}`)
        } catch (err: any) {
            const msg =
                err?.error || err.message || 'Error loading attendant details'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const chartData = useMemo(() => {
        // console.log('services', services)
        return services.reduce(
            (acc: any, cur: any) => {
                return {
                    days: [...acc.days, fDateShort(cur?.created_at, null)],
                    cars: [...acc.cars, cur.total],
                    revenue: [...acc.revenue, cur.cost],
                }
            },
            { days: [], cars: [], revenue: [] }
        )
    }, [services])

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
                        name: 'service reports',
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
                    onClick={() => ''}
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
                    <GroupedTasksTable data={services ?? []} />
                </Grid>

                <Grid item xs={12} mt={6}>
                    <AnnualChart
                        title="Revenue"
                        subheader="Revenue per day"
                        chart={{
                            categories: chartData?.days?.reverse() ?? [],
                            series: [
                                {
                                    type: 'Year',
                                    data: [
                                        // {
                                        //     name: 'Revenue',
                                        //     data: chartData?.revenue ?? [],
                                        // },
                                        {
                                            name: 'Vehicles',
                                            data: chartData?.revenue ?? [],
                                        },
                                    ],
                                },
                            ],
                        }}
                    />
                </Grid>
                <Grid item xs={12} mt={6}>
                    <AnalyticsChart
                        title="Vehicles washes"
                        subheader="No. of cars washed per day"
                        chart={{
                            labels:
                                [
                                    ...(chartData?.days.reverse() ?? []),
                                    fDateShort(new Date(), null),
                                ] ?? [],
                            series: [
                                {
                                    name: 'Vehicles',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: chartData.cars ?? [],
                                },
                            ],
                        }}
                    />
                </Grid>
                {/* <Grid item xs={12} mt={6}>
                    <AnalyticsChart
                        title="Revenue"
                        subheader="Revenue per day"
                        chart={{
                            labels: chartData.days ?? [],
                            series: [
                                {
                                    name: 'Revenue',
                                    type: 'column',
                                    fill: 'solid',
                                    data: chartData.revenue ?? [],
                                },
                            ],
                        }}
                    />
                </Grid>
                <Grid item xs={12} mt={6}>
                    <AnnualChart
                        title="Revenue"
                        subheader="Revenue per day"
                        chart={{
                            categories: chartData?.days ?? [],
                            series: [
                                {
                                    type: 'Year',
                                    data: [
                                        {
                                            name: 'Revenue',
                                            data: chartData?.revenue ?? [],
                                            type: 'line',
                                            fill: 'solid',
                                        },
                                    ],
                                },
                            ],
                        }}
                    />
                </Grid> */}
            </Grid>
        </Container>
    )
}

export default ServicesReport
