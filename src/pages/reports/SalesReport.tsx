/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Grid,
    Stack,
    Typography,
} from '@mui/material'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { DatePicker } from '@mui/x-date-pickers'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import InternalError from '../../components/shared/500Error'
import { apiUrl } from '../../config-global'
import axios from '../../utils/axios'
import { useSnackbar } from '../../components/snackbar'
import GroupdSalesTable from './_components/GroupedSaleTable'
import { fCurrency } from '../../utils/formatNumber'
import useGroupedSalesReport from '../../hooks/sales/useGroupedSales'

function SalesReport() {
    const { themeStretch } = useSettingsContext()
    const navigate = useNavigate()
    //  dates
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null)
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null)

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')

    let query = ''

    if (initialStartDate) {
        query = `${query}startDate=${initialStartDate}`
    }
    if (initialEndDate) {
        query = `${query}&endDate=${initialEndDate}`
    }

    const { sales, loading } = useGroupedSalesReport({ query })

    // const [sales, setSales] = useState<any>([])
    //  const [loading, setLoading] = useState<boolean>(false)

    const { enqueueSnackbar } = useSnackbar()

    // useEffect(() => {
    //     handleFetch()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [filterStartDate, filterEndDate])

    const salesTotal = sales?.reduce((acc: number, curr: any) => {
        return acc + curr.cost
    }, 0)

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
            navigate(`${PATH_DASHBOARD.reports.sales}?${q}`)
        } catch (err: any) {
            const msg = err?.error || err.message || 'something went wrong'
            enqueueSnackbar(msg, { variant: 'error' })
        }
    }

    // const handleFetch = async () => {
    //     try {
    //         const startDate = filterStartDate
    //             ? format(filterStartDate, 'yyyy-MM-dd')
    //             : null
    //         const endDate = filterEndDate
    //             ? format(filterEndDate, 'yyyy-MM-dd')
    //             : null

    //         let queryObj = {}
    //         if (startDate) {
    //             queryObj = { ...queryObj, startDate }
    //         }
    //         if (endDate) {
    //             queryObj = { ...queryObj, endDate }
    //         }
    //         setLoading(true)
    //         const query = new URLSearchParams(queryObj).toString()
    //         const url = `${apiUrl}/report/grouped-sales?${query}`

    //         const response = await axios.get(url)

    //         if (response.status === 200) {
    //             const { data } = response
    //             setSales(data.sales)
    //         }
    //     } catch (err: any) {
    //         const msg = err.error || err.message || 'error loading reports data'
    //         enqueueSnackbar(msg, { variant: 'error' })
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Sales Reports"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'reports',
                        href: PATH_DASHBOARD.reports.root,
                    },
                    {
                        name: 'sales reports',
                        href: PATH_DASHBOARD.reports.sales,
                    },
                ]}
            />
            <ErrorBoundary
                fallback={<InternalError error="error loading reports data" />}
            >
                <Suspense fallback={<p>Loading... </p>}>
                    <Grid container spacing={2}>
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
                            {loading && (
                                <Card>
                                    <CardContent>
                                        <Stack
                                            display="flex"
                                            direction="row"
                                            justifyContent="center"
                                        >
                                            <CircularProgress />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>

                        <Grid item xs={12} lg={4} xl={3}>
                            <Card>
                                <CardHeader title="Total sales" />
                                <CardContent>
                                    {fCurrency(salesTotal)}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <GroupdSalesTable data={sales ?? []} />
                        </Grid>
                    </Grid>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default SalesReport
