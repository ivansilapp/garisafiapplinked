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
import { Link } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { Suspense } from 'react'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import useRevenue from '../../hooks/task/useRevenue'
import useExpense from '../../hooks/task/useExpense'
import { fCurrency } from '../../utils/formatNumber'

function RevenueReport() {
    const { themeStretch } = useSettingsContext()
    const { revenue } = useRevenue({ queryString: '' })
    const { expenses } = useExpense({ queryString: '' })

    // console.log(revenue, 'revenue')
    // console.log(expenses, 'expenses')

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
