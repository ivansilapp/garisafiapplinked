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
import { Link } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import InternalError from '../../components/shared/500Error'
import { apiUrl } from '../../config-global'
import axios from '../../utils/axios'
import { useSnackbar } from '../../components/snackbar'
import GroupdSalesTable from './_components/GroupedSaleTable'
import { fCurrency } from '../../utils/formatNumber'

function SalesReport() {
    const { themeStretch } = useSettingsContext()

    const [sales, setSales] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)

    //  dates
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null)
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        handleFetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStartDate, filterEndDate])

    const salesTotal = sales.reduce((acc: number, curr: any) => {
        return acc + curr.cost
    }, 0)

    const handleFetch = async () => {
        try {
            const startDate = filterStartDate
                ? format(filterStartDate, 'yyyy-MM-dd')
                : null
            const endDate = filterEndDate
                ? format(filterEndDate, 'yyyy-MM-dd')
                : null

            let queryObj = {}
            if (startDate) {
                queryObj = { ...queryObj, startDate }
            }
            if (endDate) {
                queryObj = { ...queryObj, endDate }
            }
            setLoading(true)
            const query = new URLSearchParams(queryObj).toString()
            const url = `${apiUrl}/report/grouped-sales?${query}`

            const response = await axios.get(url)

            if (response.status === 200) {
                const { data } = response
                setSales(data.sales)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'error loading reports data'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }
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
                            <GroupdSalesTable data={sales} />
                        </Grid>
                    </Grid>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default SalesReport
