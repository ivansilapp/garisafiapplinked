/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Container, Grid, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import useBodyTypes from '../../hooks/body-types/useBodyTypes'
import useDailyAnalytics from '../../hooks/dashboard/useDailyAnalytics'
import AccountBalances from './_components/AccountBalances'
import TaskByCarType from './_components/TaskByCarType'
import TaskCountCard from './_components/TaskCountCard'
import ValueGraphWidget from './_components/ValueGraphWidget'
import OccupiedCard from './_components/OccupiedCard'
import { PATH_DASHBOARD } from '../../routes/paths'
import AccountsOverview from './_components/AccountsOverview'
import { computeFreewashTotals } from '../../utils/common'
import { useAuthContext } from '../../auth/useAuthContext'
import { ADMIN_ROLE } from '../../utils/roles'

function Dashboard() {
    const theme = useTheme()
    const { user }: any = useAuthContext()

    const { bodyTypes } = useBodyTypes()

    const { themeStretch } = useSettingsContext()

    const navigate = useNavigate()
    //  dates

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')

    const [filterStartDate, setFilterStartDate] = useState<Date | null>(
        initialStartDate ? new Date(initialStartDate) : null
    )
    let query = ''

    if (initialStartDate) {
        query = `${query}startDate=${initialStartDate}`
    }

    const IS_ADMIN = user?.role === ADMIN_ROLE

    const {
        accounts,
        complete,
        cancelled,
        waitlist,
        ongoing,
        tasks,
        expenses,
        sales,
        pigeonholes,
        freeWashes,
        payments,
        todayTasks,
    } = useDailyAnalytics({ query })

    // const onFilterStartDate = (newValue: any) => {
    //     setFilterStartDate(newValue)
    //     handleDateFilter({ s: newValue, e: filterEndDate })
    // }

    const series =
        accounts?.map((account: any) => ({
            label: account?.name ?? '',
            value: account?.balance ?? 0,
        })) ?? []

    // console.log('free washes ', freeWashes)
    // console.log('payments ', payments)

    const carTypeTasks = complete?.reduce((acc: any, task: any) => {
        const { bodyId }: any = task.vehicle
        const name = bodyTypes?.find((body: any) => body.id === bodyId)?.name
        // console.log(task.jobs, 'jobs')
        if (acc[name]) {
            acc[name] = {
                count: acc[name].count + 1,
                cost: acc[name].cost + task.cost,
            }
        } else {
            acc[name] = {
                count: 1,
                cost: task.cost,
            }
        }
        return acc
    }, {})
    const serviceTypeTasks = complete?.reduce((acc: any, task: any) => {
        const { bodyId }: any = task.vehicle
        const name = bodyTypes?.find((body: any) => body.id === bodyId)?.name
        const serviceTasks = task.jobs.reduce((iac: any, job: any) => {
            if (iac[job.name]) {
                // eslint-disable-next-line no-param-reassign
                iac[job.name] = {
                    count: iac[job.name].count + 1,
                    cost: iac[job.name].cost + job.cost,
                }
            } else {
                // eslint-disable-next-line no-param-reassign
                iac[job.name] = {
                    count: 1,
                    cost: job.cost,
                }
            }
            return iac
        }, {})

        Object.keys(serviceTasks).forEach((key) => {
            if (acc[key]) {
                acc[key] = {
                    count: acc[key].count + 1,
                    cost: acc[key].cost + serviceTasks[key].cost,
                }
            } else {
                acc[key] = {
                    count: 1,
                    cost: serviceTasks[key].cost,
                }
            }
        })
        return acc
    }, {})

    const serviceReportData = Object.keys(serviceTypeTasks)?.map(
        (key: any) => ({
            label: key
                .split(' ')
                .map((word: string) => word[0])
                .join(''),
            value: serviceTypeTasks[key].cost,
        })
    )

    const taskByCarType = Object.keys(carTypeTasks)?.map((key: any) => ({
        label: key,
        value: carTypeTasks[key].count,
    }))
    const revenueByCarType = Object.keys(carTypeTasks)?.map((key: any) => ({
        label: key,
        value: carTypeTasks[key].cost,
    }))

    // console.log('carTypeTasks', carTypeTasks, complete)
    const totalTasks =
        (waitlist ?? 0) +
        (ongoing ?? 0) +
        (complete?.length ?? 0) +
        (cancelled ?? 0)

    const computePercent = (value: number) => {
        if (!value || value === 0 || totalTasks === 0) return 0
        return Math.round((value / totalTasks) * 100)
    }
    const dateSort = (a: any, b: any) => {
        return (
            // @ts-expect-error
            new Date(a?.created_at) -
            // @ts-expect-error
            new Date(b?.created_at)
        )
    }
    // const todaysTasks = tasks ? tasks.sort(dateSort)[tasks.length - 1] : null
    // console.log(todaysTasks, 'todaysTasks', tasks)
    const accountsTotal =
        payments?.reduce((acc: any, account: any) => acc + account.amount, 0) ??
        1
    const todayAccountsOverview =
        payments?.map((account: any) => ({
            status: account.account,
            quantity: account.amount,
            value: (account.amount / accountsTotal) * 100,
        })) ?? []

    const onFilterStartDate = (newValue: any) => {
        setFilterStartDate(newValue)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        handleDateFilter({ s: newValue })
    }

    const handleDateFilter = async ({ s }: any) => {
        try {
            const startDate = s ? format(s, 'yyyy-MM-dd') : null

            let queryObj = {}
            if (startDate) {
                queryObj = { ...queryObj, startDate }
            }

            const q = new URLSearchParams(queryObj).toString()
            navigate(`${PATH_DASHBOARD.root}?${q}`)
        } catch (err: any) {
            const msg = err?.error || err.message || 'something went wrong'
            // enqueueSnackbar(msg, { variant: 'error' })
            console.log(msg)
        }
    }

    // console.log(tasks, 'tasks')
    const dateQueryStr = `startDate=${format(
        filterStartDate ?? Date.now(),
        'yyyy-MM-dd'
    )}`

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <ErrorBoundary
                fallback={<InternalError error="Error loading dashboard" />}
            >
                <Suspense fallback={<p>Loading...</p>}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
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

                                    {/* <DatePicker
                                    label="End date"
                                    value={filterEndDate}
                                    onChange={onFilterEndDate}
                                    slotProps={{
                                        textField: { variant: 'outlined' },
                                    }}
                                /> */}
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <TaskCountCard
                                chart={{
                                    colors: [
                                        theme.palette.info.main,
                                        theme.palette.warning.main,
                                        theme.palette.success.main,
                                        theme.palette.error.main,
                                    ],
                                    series: [
                                        {
                                            label: 'Queued tasks',
                                            percent: computePercent(waitlist),
                                            total: waitlist,
                                            url: 'queued',
                                        },
                                        {
                                            label: 'Ongoing tasks',
                                            percent: computePercent(ongoing),
                                            total: ongoing,
                                            url: 'ongoing',
                                        },
                                        {
                                            label: 'Completed tasks',
                                            total: complete?.length,
                                            percent: computePercent(
                                                complete.length ?? 0
                                            ),
                                            url: `complete?${dateQueryStr}`,
                                        },
                                        {
                                            label: 'Cancelled tasks',
                                            percent: computePercent(cancelled),
                                            total: cancelled,
                                            url: `cancelled?${dateQueryStr}`,
                                        },
                                    ],
                                }}
                            />
                        </Grid>

                        <Grid xs={12} item container spacing={3}>
                            <Grid xs={12} md={4} item>
                                <ValueGraphWidget
                                    title="Service revenue"
                                    percent={2.6}
                                    currency
                                    total={todayTasks?.cost ?? 0}
                                    url={`${PATH_DASHBOARD.reports.services}?${dateQueryStr}`}
                                    items={{
                                        title: 'Number of tasks',
                                        value: todayTasks?.total ?? 0,
                                    }}
                                    chart={{
                                        colors: [theme.palette.primary.main],
                                        series:
                                            tasks
                                                ?.sort(dateSort)
                                                ?.map(
                                                    (task: any) => task.cost
                                                ) ?? [],
                                    }}
                                />
                            </Grid>
                            <Grid xs={12} md={4} item>
                                <ValueGraphWidget
                                    title="Product sales"
                                    url={`${PATH_DASHBOARD.reports.sales}?${dateQueryStr}`}
                                    currency
                                    percent={2.6}
                                    total={sales?.cost ?? 0}
                                    items={{
                                        title: 'Number of sales',
                                        value: sales?.total ?? 0,
                                    }}
                                    chart={{
                                        colors: [theme.palette.warning.main],
                                        series:
                                            sales?.data
                                                ?.sort(dateSort)
                                                ?.map(
                                                    (sale: any) => sale.cost
                                                ) ?? [],
                                    }}
                                />
                            </Grid>
                            <Grid xs={12} md={4} item>
                                <ValueGraphWidget
                                    title="Commissions payable"
                                    url={`${PATH_DASHBOARD.commissions.root}?${dateQueryStr}`}
                                    currency
                                    percent={2.6}
                                    total={expenses.expense_total ?? 0}
                                    chart={{
                                        colors: [theme.palette.info.main],
                                        series:
                                            expenses?.grouped_data
                                                ?.sort(dateSort)
                                                ?.map(
                                                    (expense: any) =>
                                                        expense.cost
                                                ) ?? [],
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <AccountsOverview
                                title="Todays payments"
                                date={format(
                                    filterStartDate ?? new Date(),
                                    'yyyy-MM-dd'
                                )}
                                data={todayAccountsOverview}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <ValueGraphWidget
                                title="Free washes"
                                url={`${PATH_DASHBOARD.reports.rewards}?${dateQueryStr}`}
                                currency
                                percent={2.6}
                                total={
                                    computeFreewashTotals(freeWashes ?? []) ?? 0
                                }
                                items={{
                                    title: 'Number of free washes',
                                    value: freeWashes?.length ?? 0,
                                }}
                                chart={{
                                    colors: [theme.palette.info.main],
                                    series: [],
                                }}
                            />
                        </Grid>

                        {IS_ADMIN && (
                            <Grid item xs={12} md={6} xl={4}>
                                <TaskByCarType
                                    title="Task By Car Type"
                                    chart={{
                                        series: taskByCarType,
                                        colors: [
                                            theme.palette.primary.main,
                                            theme.palette.info.main,
                                            theme.palette.error.main,
                                            theme.palette.warning.main,
                                        ],
                                    }}
                                />
                            </Grid>
                        )}

                        {IS_ADMIN && (
                            <Grid item xs={12} md={6} xl={4}>
                                <TaskByCarType
                                    title="Revenue By Car Type"
                                    type="donut"
                                    currency
                                    chart={{
                                        series: revenueByCarType,
                                        colors: [
                                            theme.palette.info.main,
                                            theme.palette.error.main,
                                            theme.palette.warning.main,
                                            theme.palette.primary.main,
                                        ],
                                    }}
                                />
                            </Grid>
                        )}

                        {IS_ADMIN && (
                            <Grid item xs={12} md={6} xl={4}>
                                <TaskByCarType
                                    title="Revenue By Service"
                                    currency
                                    chart={{
                                        series: serviceReportData,
                                        colors: [
                                            theme.palette.primary.main,
                                            theme.palette.info.main,
                                            theme.palette.error.main,
                                            theme.palette.warning.main,
                                        ],
                                    }}
                                />
                            </Grid>
                        )}

                        {IS_ADMIN && (
                            <Grid item xs={12} md={6} xl={4}>
                                <AccountBalances
                                    title="Account Balances"
                                    chart={{
                                        colors: [
                                            theme.palette.primary.main,
                                            theme.palette.info.main,
                                            theme.palette.error.main,
                                            theme.palette.warning.main,
                                        ],
                                        series,
                                    }}
                                />
                            </Grid>
                        )}

                        <Grid container item xs={12}>
                            <Grid item xs={12} md={4}>
                                <OccupiedCard
                                    title="Pigeon Hole"
                                    value={pigeonholes?.length ?? 0}
                                    url={PATH_DASHBOARD.reports.pigeonholes}
                                    total={60}
                                    icon="/assets/icons/apps/ic_dropbox.svg"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Suspense>
            </ErrorBoundary>
            {/* <h1> Dashboard P</h1> */}
        </Container>
    )
}

export default Dashboard
