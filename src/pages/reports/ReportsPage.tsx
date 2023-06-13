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
import { Link } from 'react-router-dom'
import RevenueChart from './_components/RevenueChart'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import useTopAttendants from '../../hooks/attendant/useTopAttendants'
import TopAttendantsTable from './_components/TopAttendantsTable'
import { fCurrency } from '../../utils/formatNumber'
import AnnualChart from './_components/AnnualChart'

function ReportsPage() {
    const { themeStretch } = useSettingsContext()
    const { attendants, revenue, expenses, annualReport } = useTopAttendants()

    // console.log(attendants, revenue, expenses)
    // console.log(annualReport, 'annual-Report')
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

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Stack
                        justifyContent="flex-end"
                        direction="row"
                        spacing={2}
                        mb={5}
                    >
                        <Button component={Link} to="/reports/services">
                            Services / Tasks
                        </Button>

                        <Button component={Link} to="/reports/sales">
                            Sales
                        </Button>

                        <Button component={Link} to="/reports/revenue">
                            Revenue
                        </Button>

                        <Button component={Link} to="/reports/vehicle-type">
                            Vehicle type
                        </Button>

                        <Button
                            component={Link}
                            to={PATH_DASHBOARD.reports.tips}
                        >
                            Tips
                        </Button>
                        <Button
                            component={Link}
                            to={PATH_DASHBOARD.reports.rewards}
                        >
                            Rewards
                        </Button>

                        <Button
                            component={Link}
                            to={PATH_DASHBOARD.reports.pigeonholes}
                        >
                            Key holes
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="30 days Revenue" />
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {fCurrency(
                                    (revenue?.sales_revenue ?? 0) +
                                    (revenue?.task_revenue ?? 0)
                                )}
                            </Typography>
                        </CardContent>
                    </Card>
                    {/* <RevenueChart
                        total={18765}
                        percent={2.6}
                        chart={{
                            series: [111, 136, 76, 108, 74, 54, 57, 84],
                        }}
                    /> */}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="30 days expenses" />
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {fCurrency(expenses?.total ?? 0)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} mt={4}>
                    <AnnualChart
                        title="Annual Chart"
                        subheader="Tasks/sales revenue and expense"
                        chart={{
                            categories: [
                                'Jan',
                                'Feb',
                                'Mar',
                                'Apr',
                                'May',
                                'Jun',
                                'Jul',
                                'Aug',
                                'Sep',
                                'Oct',
                                'Nov',
                                'Dec',
                            ],
                            series: [
                                {
                                    type: 'Year',
                                    data: [
                                        {
                                            name: 'Revenue',
                                            data:
                                                annualReport?.revenue?.map(
                                                    (r: any) => r.total
                                                ) ?? [],
                                        },
                                        {
                                            name: 'Expenses',
                                            data:
                                                annualReport?.expense?.map(
                                                    (r: any) => r.total
                                                ) ?? [],
                                        },
                                    ],
                                },
                            ],
                        }}
                    />
                </Grid>

                <Grid item xs={12} mt={4}>
                    <Card>
                        <CardHeader title="Top attendants" />
                        <TopAttendantsTable data={attendants ?? []} />
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default ReportsPage
