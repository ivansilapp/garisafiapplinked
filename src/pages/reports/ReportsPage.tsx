import { Button, Container, Grid, Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import RevenueChart from './_components/RevenueChart'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'

function ReportsPage() {
    const { themeStretch } = useSettingsContext()
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

            <Grid container>
                <Grid item xs={12}>
                    <Stack
                        justifyContent="flex-end"
                        direction="row"
                        spacing={2}
                        mb={5}
                    >
                        <Button component={Link} to="/reports/sales">
                            Sales
                        </Button>
                        <Button component={Link} to="/reports/services">
                            Services
                        </Button>

                        <Button component={Link} to="/reports/vehicle-type">
                            Vehicle type
                        </Button>

                        <Button component={Link} to="/reports/revenue">
                            Revenue
                        </Button>
                        {/* <Button component={Link} to="/reports/expenses">
                            Expenses
                        </Button> */}
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <RevenueChart
                        total={18765}
                        percent={2.6}
                        chart={{
                            series: [111, 136, 76, 108, 74, 54, 57, 84],
                        }}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default ReportsPage
