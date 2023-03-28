import { Container } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useParams } from 'react-router-dom'
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs'
import { useSettingsContext } from '../../../components/settings'
import InternalError from '../../../components/shared/500Error'
import useVehicle from '../../../hooks/vehicle/useVehicle'
import { PATH_DASHBOARD } from '../../../routes/paths'

export default function VehicleDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { themeStretch } = useSettingsContext()
    const { vehicle } = useVehicle({ id: id ?? '' })

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
                    <h1>{vehicle?.registration}</h1>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}
