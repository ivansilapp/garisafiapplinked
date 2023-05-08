/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import {
    Box,
    Button,
    Container,
    Grid,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { DatePicker } from '@mui/x-date-pickers'
import { useParams, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import useAccountList from '../../hooks/account/useAccountList'
import useAttendant from '../../hooks/attendant/useAttendant'
import { PATH_DASHBOARD } from '../../routes/paths'
import {
    computeCommisionTotals,
    computeTaskTotals,
    computeUnpaidCommisionTotals,
    computeUpaidTasks,
} from '../../utils/common'
import TasksTable from '../tasks/_components/TasksTable'
import AttendantBalance from './_components/AttendantBalance'
import AttendantsEarnings from './_components/AttendantEarnings'
import { useSnackbar } from '../../components/snackbar'
import { apiUrl } from '../../config-global'
import axios from '../../utils/axios'
import PaymentsTable from '../payments/_components/PaymentTable'
import CommissionTable from './_components/CommissionTable'
import AppLoader from '../../components/loader/AppLoader'

// export const ecommerceSalesOverview = [...Array(3)].map((_, index) => ({
//     label: ['Total Revenue', 'Total Earnings'][index],
//     amount: 3 * 100,
//     value: 40,
// }))

const INPUT_WIDTH = 160

function AttendantDetail() {
    const { themeStretch } = useSettingsContext()
    const { enqueueSnackbar } = useSnackbar()

    const [attendant, setAttendant] = useState<any>(null)
    const [commissions, setCommissions] = useState<any>([])
    const [tasks, setTasks] = useState<any>([])

    // const [searchParams] = useSearchParams()
    const { id } = useParams<{ id: string }>()
    // const { attendant, commissions, tasks, mutate }: any = useAttendant({
    //     id: id ?? '',
    // })
    const { accounts } = useAccountList()

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')

    // get query params
    let query = ''
    if (initialStartDate) {
        query = `${query}startDate=${initialStartDate}`
    }
    if (initialEndDate) {
        query = `${query}&endDate=${initialEndDate}`
    }

    const [filterEndDate, setFilterEndDate] = useState<any>(
        initialEndDate ? new Date(initialEndDate) : null
    )
    const [filterStartDate, setFilterStartDate] = useState<any>(
        initialStartDate ? new Date(initialStartDate) : null
    )

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        handleDateFilter()
    }, [filterEndDate, filterStartDate])

    const attendantPerformance = [
        {
            label: 'Total revenue',
            amount: computeTaskTotals(tasks ?? []),
            value: 80,
        },
        {
            label: 'Total Earnings',
            amount: computeCommisionTotals(commissions ?? []),
            value: 20,
        },
    ]

    const onFilterStartDate = (newValue: any) => {
        setFilterStartDate(() => {
            return newValue
        })
    }
    const onFilterEndDate = (newValue: any) => {
        setFilterEndDate(newValue)
    }

    const handleDateFilter = async () => {
        try {
            setLoading(true)
            const startDate = filterStartDate
                ? format(filterStartDate, 'yyyy-MM-dd')
                : null
            const endDate = filterEndDate
                ? format(filterEndDate, 'yyyy-MM-dd')
                : null
            if (!startDate && endDate) {
                return
            }

            let queryObj = {}
            if (startDate) {
                queryObj = { ...queryObj, startDate }
            }
            if (endDate) {
                queryObj = { ...queryObj, endDate }
            }

            // console.log('queryObj', queryObj)

            const q = new URLSearchParams(queryObj).toString()
            //   const url = `${apiUrl}/attendant/${id}`
            const url = `${apiUrl}/attendant/${id}?${q}`

            const response = await axios.get(url)

            if (response.status === 200) {
                //   const { attendant, commissions, tasks } = response.data
                const { data } = response
                setAttendant(data.attendant)
                setCommissions(data.commissions)
                setTasks(data.tasks)
                // mutate(response.data)

                // console.log('response.data', response.data)
            }
        } catch (err: any) {
            const msg =
                err?.error || err.message || 'Error loading attendant details'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={
                    attendant
                        ? `${attendant?.name} Account`
                        : 'Attendant details'
                }
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
                {loading ? (
                    <AppLoader open={loading} setOpen={() => {}} />
                ) : null}
                <Suspense fallback={<p> Loading...</p>}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sx={{ mb: 3 }}>
                            <Stack
                                display="flex"
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <div />

                                <Stack display="flex" direction="row" gap={2}>
                                    <DatePicker
                                        label="Start date"
                                        value={filterStartDate}
                                        onChange={onFilterStartDate}
                                        slotProps={{
                                            textField: { variant: 'outlined' },
                                        }}
                                    />

                                    <DatePicker
                                        label="End date"
                                        value={filterEndDate}
                                        onChange={onFilterEndDate}
                                        slotProps={{
                                            textField: { variant: 'outlined' },
                                        }}
                                    />
                                </Stack>
                            </Stack>
                        </Grid>
                        {/* <Grid xs={12}>
                            <Typography variant="h4" gutterBottom>
                                {attendant?.name}
                            </Typography>
                        </Grid> */}
                        <Grid item xs={12} md={6} lg={5}>
                            <AttendantBalance
                                accounts={accounts}
                                title="Current Balance"
                                currentBalance={computeUnpaidCommisionTotals(
                                    commissions
                                )}
                                tips={attendant?.tips ?? []}
                                unpaidTasks={computeUpaidTasks(tasks ?? [])}
                                id={Number(id)}
                                mutate={() => {}}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={7}>
                            <AttendantsEarnings
                                title="Attendant performance"
                                data={attendantPerformance}
                            />
                        </Grid>

                        <Grid item xs={12} mt={3}>
                            <Typography px={2} variant="h4" gutterBottom>
                                Attendant tasks
                            </Typography>
                            <TasksTable
                                data={tasks.map((task: any) => ({
                                    ...task,
                                    attendant,
                                }))}
                                handleUpdate={() => {}}
                                mutate={() => {}}
                                readOnly={1}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 4 }}>
                            <Typography px={2} variant="h4" gutterBottom>
                                Attendant commissions
                            </Typography>
                            <CommissionTable
                                data={commissions}
                                handleUpdate={() => {}}
                                mutate={() => {}}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 4 }}>
                            <Typography px={2} variant="h4" gutterBottom>
                                Attendant payments
                            </Typography>
                            <PaymentsTable
                                data={attendant?.payments ?? []}
                                handleUpdate={() => {}}
                                mutate={() => {}}
                            />
                        </Grid>
                    </Grid>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default AttendantDetail
