import { Button, Container, Grid, Typography } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useParams, useSearchParams } from 'react-router-dom'
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
    computeUpaidTasks,
} from '../../utils/common'
import TasksTable from '../tasks/_components/TasksTable'
import AttendantBalance from './_components/AttendantBalance'
import AttendantsEarnings from './_components/AttendantEarnings'

// export const ecommerceSalesOverview = [...Array(3)].map((_, index) => ({
//     label: ['Total Revenue', 'Total Earnings'][index],
//     amount: 3 * 100,
//     value: 40,
// }))

function AttendantDetail() {
    const { themeStretch } = useSettingsContext()

    const [searchParams] = useSearchParams()
    const { id } = useParams<{ id: string }>()
    const { attendant, commissions, tasks, mutate }: any = useAttendant({
        id: id ?? '',
    })
    const { accounts } = useAccountList()

    const attendantPerformance = [
        {
            label: 'Total revenue',
            amount: computeTaskTotals(tasks ?? []),
            value: 40,
        },
        {
            label: 'Total Earnings',
            amount: computeCommisionTotals(commissions ?? []),
            value: 40,
        },
    ]

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
                <Suspense fallback={<p> Loading...</p>}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom>
                                {attendant?.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <AttendantBalance
                                accounts={accounts}
                                title="Current Balance"
                                currentBalance={computeCommisionTotals(
                                    commissions
                                )}
                                unpaidTasks={computeUpaidTasks(tasks)}
                                id={Number(id)}
                                mutate={mutate}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={8}>
                            <AttendantsEarnings
                                title="Attendant performance"
                                data={attendantPerformance}
                            />
                        </Grid>

                        <Grid item xs={12}>
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
                    </Grid>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default AttendantDetail
