/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    Stack,
    Typography,
} from '@mui/material'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { Suspense, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import useRevenue from '../../hooks/task/useRevenue'
import useExpense from '../../hooks/task/useExpense'
import { fCurrency } from '../../utils/formatNumber'

function RevenueReport() {
    const { themeStretch } = useSettingsContext()

    const navigate = useNavigate()
    //  dates

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

    const { revenue } = useRevenue({ queryString: query })
    const { expenses } = useExpense({ queryString: query })

    // console.log(revenue, 'revenue')
    // console.log(expenses, 'expenses')

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
            navigate(`${PATH_DASHBOARD.reports.revenue}?${q}`)
        } catch (err: any) {
            const msg = err?.error || err.message || 'something went wrong'
            // enqueueSnackbar(msg, { variant: 'error' })
            console.log(msg)
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Revenue report"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'reports',
                        href: PATH_DASHBOARD.reports.root,
                    },
                    {
                        name: 'revenue report',
                        href: PATH_DASHBOARD.reports.revenue,
                    },
                ]}
            />
            <Suspense fallback={<div>Loading...</div>}>
                <Grid container spacing={6}>
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
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader
                                sx={{ color: 'green' }}
                                title="Revenue"
                            />
                            <CardContent>
                                <Stack
                                    display="flex"
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <Box>
                                        <Typography variant="h6">
                                            Task revenue
                                        </Typography>
                                        <Typography variant="h4">
                                            {fCurrency(
                                                revenue?.task_revenue ?? 0
                                            )}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h6">
                                            Sales revenue
                                        </Typography>
                                        <Typography variant="h4">
                                            {fCurrency(
                                                revenue?.sales_revenue ?? 0
                                            )}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader
                                sx={{ color: 'red' }}
                                title="Expenses"
                            />
                            <CardContent>
                                <Stack
                                    display="flex"
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <Box>
                                        <Typography variant="h6">
                                            Total expenses
                                        </Typography>
                                        <Typography variant="h4">
                                            {fCurrency(expenses?.total ?? 0)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Suspense>
        </Container>
    )
}

export default RevenueReport
