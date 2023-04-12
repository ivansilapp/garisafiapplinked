import { Button, Container, Grid, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'

function RevenueReport() {
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
                <Grid xs={12}>
                    <Typography variant="h4" color="info">
                        Revenue
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    reports data
                </Grid>
            </Grid>
        </Container>
    )
}

export default RevenueReport
