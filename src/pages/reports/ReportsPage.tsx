import { Container, Grid } from '@mui/material'
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
                // action={
                //     <Button
                //         onClick={() => setOpen(true)}
                //         variant="contained"
                //         startIcon={<Iconify icon="eva:plus-fill" />}
                //     >
                //         New product
                //     </Button>
                // }
            />

            <Grid container>
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
