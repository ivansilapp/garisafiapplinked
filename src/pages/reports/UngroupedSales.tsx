import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    Stack,
    Typography,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import useUngroupedSales from '../../hooks/sales/useUngroupedSales'
import SalesTable from '../products/_components/SalesTable'
import { fCurrency } from '../../utils/formatNumber'
import InternalError from '../../components/shared/500Error'

function UngroupedSales() {
    const { themeStretch } = useSettingsContext()
    // get date from route params
    const { date } = useParams<{ date: string }>()
    const { sales } = useUngroupedSales({ date: date ?? '' })

    const salesTotal = sales.reduce(
        (acc: any, curr: any) => acc + curr.amount,
        0
    )
    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Reports"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'reports',
                        href: PATH_DASHBOARD.reports.root,
                    },
                ]}
            />
            <ErrorBoundary
                fallback={<InternalError error="error loading data" />}
            />
            <Suspense fallback={<p>Loading...</p>}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={4} xl={3}>
                        <Card>
                            <CardHeader title="Total sales" />
                            <CardContent>{fCurrency(salesTotal)}</CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <SalesTable
                            data={sales}
                            mutate={() => {}}
                            handleUpdate={() => {}}
                        />
                    </Grid>
                </Grid>
            </Suspense>
        </Container>
    )
}

export default UngroupedSales
