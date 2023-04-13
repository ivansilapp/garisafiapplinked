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
import SalesTable from '../products/_components/SalesTable'
import { fCurrency } from '../../utils/formatNumber'
import InternalError from '../../components/shared/500Error'
import useTaskDuration from '../../hooks/task/useTaskDuration'
import TasksTable from '../tasks/_components/TasksTable'
import useVehicleTypeTasks from '../../hooks/task/useVehicleTypeTasks'

function VehicleTypeDurationTasks() {
    const { themeStretch } = useSettingsContext()
    // get date from route params
    const { type } = useParams<{ type: string }>()
    // const { sales } = useVehicleTypeDurationTasks({ date: date ?? '' })
    const { tasks } = useVehicleTypeTasks({ type: type ?? '', date: '' })

    // console.log(tasks, 'tasks')

    const tasksTotal =
        tasks?.reduce((acc: any, curr: any) => acc + curr.cost, 0) ?? 0

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Tasks report"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'reports',
                        href: PATH_DASHBOARD.reports.root,
                    },
                    {
                        name: 'vechicle type report',
                        href: PATH_DASHBOARD.reports.vehicleType,
                    },
                    {
                        name: `${type} report`,
                        href: PATH_DASHBOARD.reports.vehicleTypeDetails(
                            type ?? ''
                        ),
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
                            <CardHeader title="Revenue" />
                            <CardContent>{fCurrency(tasksTotal)}</CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <TasksTable
                            data={tasks ?? []}
                            readOnly
                            mutate={() => {}}
                            handleUpdate={() => {}}
                        />
                    </Grid>
                </Grid>
            </Suspense>
        </Container>
    )
}

export default VehicleTypeDurationTasks
