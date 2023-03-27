import { Button, Container, Grid } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { PATH_DASHBOARD } from '../../routes/paths'
import AttendantBalance from './_components/AttendantBalance'
import AttendantsEarnings from './_components/AttendantEarnings'

export const ecommerceSalesOverview = [...Array(3)].map((_, index) => ({
    label: ['Total Profit', 'Total Income', 'Total Expenses'][index],
    amount: 3 * 100,
    value: 40,
}))

function AttendantDetail() {
    const { themeStretch } = useSettingsContext()

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Attendant details"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'Attendants',
                        href: PATH_DASHBOARD.attendants.root,
                    },
                    {
                        name: 'Details',
                        href: PATH_DASHBOARD.attendants.details(''),
                    },
                ]}
                // action={
                //     <Button
                //         variant="contained"
                //         startIcon={<Iconify icon="eva:plus-fill" />}
                //     >
                //         New attendant
                //     </Button>
                // }
            />

            <ErrorBoundary
                fallback={
                    <InternalError error="Error loading attendant details" />
                }
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                        <AttendantsEarnings
                            title="Sales Overview"
                            data={ecommerceSalesOverview}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AttendantBalance
                            title="Current Balance"
                            currentBalance={187650}
                            sentAmount={25500}
                        />
                    </Grid>
                </Grid>
            </ErrorBoundary>
        </Container>
    )
}

export default AttendantDetail
