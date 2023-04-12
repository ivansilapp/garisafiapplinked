/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Button,
    Container,
    Grid,
    Stack,
    Typography,
    Backdrop,
    CircularProgress,
} from '@mui/material'
import { Link } from 'react-router-dom'
// import RevenueChart from './_components/RevenueChart'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useSettingsContext } from '../../components/settings'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import { useSnackbar } from '../../components/snackbar'
import axios from '../../utils/axios'
import { apiUrl } from '../../config-global'
import GroupedTasksTable from '../tasks/_components/GroupedTasksTable'

function ServicesReport() {
    const { themeStretch } = useSettingsContext()

    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    //  dates
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null)
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        handleFetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStartDate, filterEndDate])

    const servicesTotal = services?.reduce((acc: number, curr: any) => {
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
            const url = `${apiUrl}/report/date-grouped-tasks?${query}`

            const response = await axios.get(url)

            if (response.status === 200) {
                const { data } = response
                setServices(data.services ? data.services : [])
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
                heading="Services report"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'reports',
                        href: PATH_DASHBOARD.reports.root,
                    },
                    {
                        name: 'service reports',
                        href: PATH_DASHBOARD.reports.services,
                    },
                ]}
            />

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

            <Grid container>
                <Grid item xs={12}>
                    <GroupedTasksTable data={services} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default ServicesReport
