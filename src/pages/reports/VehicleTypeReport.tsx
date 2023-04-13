/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Backdrop,
    Button,
    CircularProgress,
    Container,
    Grid,
    Stack,
    Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ErrorBoundary } from 'react-error-boundary'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import { useSnackbar } from '../../components/snackbar'
import { apiUrl } from '../../config-global'
import axios from '../../utils/axios'
import VehicletypeTasksTable from './_components/VehicleTypeTasksTable'
import InternalError from '../../components/shared/500Error'

function VehicleTypeReport() {
    const { themeStretch } = useSettingsContext()
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    //  dates
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null)
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        handleFetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStartDate, filterEndDate])

    const servicesTotal = tasks?.reduce((acc: number, curr: any) => {
        return acc + curr.cost
    }, 0)

    const handleFetch = async () => {
        try {
            const startDate = filterStartDate
                ? format(filterStartDate, 'yyyy-MM-dd')
                : null
            const endDate = filterEndDate
                ? format(filterEndDate, 'yyyy-MM-dd')
                : null

            let queryObj = {}
            if (startDate) {
                queryObj = { ...queryObj, startDate }
            }
            if (endDate) {
                queryObj = { ...queryObj, endDate }
            }
            setLoading(true)
            const query = new URLSearchParams(queryObj).toString()
            const url = `${apiUrl}/report/vehicle-type-tasks?${query}`

            const response = await axios.get(url)

            if (response.status === 200) {
                const { data } = response
                setTasks(data.tasks ? data.tasks : [])
                // console.log(data)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'error loading reports data'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }
    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Vehicle Type Reports"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'reports',
                        href: PATH_DASHBOARD.reports.root,
                    },
                    {
                        name: 'vehicle type',
                        href: PATH_DASHBOARD.reports.vehicleType,
                    },
                ]}
            />
            <ErrorBoundary
                fallback={<InternalError error="Error loading data" />}
            >
                <Grid container>
                    {loading && (
                        <Backdrop
                            sx={{
                                color: '#fff',
                                zIndex: (theme) => theme.zIndex.drawer + 1,
                            }}
                            open={loading}
                            onClick={() => {}}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    )}
                    <Grid item xs={12}>
                        <VehicletypeTasksTable data={tasks} />
                    </Grid>
                </Grid>
            </ErrorBoundary>
        </Container>
    )
}

export default VehicleTypeReport
