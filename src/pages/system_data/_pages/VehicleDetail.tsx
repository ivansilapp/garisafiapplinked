import { Container, Grid, Typography } from '@mui/material'
import { Suspense, useCallback } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useParams } from 'react-router-dom'
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs'
import { useSettingsContext } from '../../../components/settings'
import InternalError from '../../../components/shared/500Error'
import useVehicle from '../../../hooks/vehicle/useVehicle'
import { PATH_DASHBOARD } from '../../../routes/paths'
import TasksTable from '../../tasks/_components/TasksTable'
import PointsWidget from '../_components/vehicle/PointsWidget'
import VehicleDetailCard from '../_components/vehicle/VehicleDetailCard'
import SalesTable from '../../products/_components/SalesTable'

export default function VehicleDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { themeStretch } = useSettingsContext()
    const { vehicle } = useVehicle({ id: id ?? '' })

    // console.log('vehicle', vehicle)

    const computePercentage = (value: number, total: number) => {
        const percentage = (value / total) * 100
        return Math.round(percentage)
    }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Vehicle details"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'Vehicles',
                        href: PATH_DASHBOARD.systemData.vehicles,
                    },
                    {
                        name: 'Vehicle details',
                        href: PATH_DASHBOARD.systemData.vehilceDetails(''),
                    },
                ]}
            />
            <ErrorBoundary
                fallback={
                    <InternalError error="Error loading vehicle details" />
                }
            >
                <Suspense fallback={<p> Loading...</p>}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <VehicleDetailCard vehicle={vehicle} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            {/* <h1>{vehicle?.registration}</h1> */}

                            <PointsWidget
                                title="Points"
                                total={vehicle?.points?.points ?? 0}
                                icon="eva:email-fill"
                                color="info"
                                chart={{
                                    series: computePercentage(
                                        vehicle?.points?.points ?? 0,
                                        9
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <Typography px={2} variant="h4">
                                Tasks
                            </Typography>
                            <TasksTable
                                data={vehicle?.tasks}
                                mutate={() => { }}
                                handleUpdate={() => { }}
                                readOnly
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography px={2} variant="h4">
                                Sales
                            </Typography>

                            <SalesTable
                                data={vehicle.sales ?? []}
                                mutate={() => { }}
                                handleUpdate={() => { }}
                            />
                        </Grid>
                    </Grid>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}
