/* eslint-disable @typescript-eslint/no-use-before-define */
import { Container, Grid, Stack } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import InternalError from '../../components/shared/500Error'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { PATH_DASHBOARD } from '../../routes/paths'
import { useSettingsContext } from '../../components/settings'
import { useSnackbar } from '../../components/snackbar'
import useCommissionsQuery from '../../hooks/commission/useCommissionsQuery'
import CommissionTable from '../attendants/_components/CommissionTable'
import useGroupedCommissions from '../../hooks/commission/useGroupedCommisions'
import GroupedCommissionTable from './_components/CommissionGroupedTable'
import { fallbackRender } from '../../auth/utils'

function Commissions() {
    const { themeStretch } = useSettingsContext()
    const navigate = useNavigate()

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

    //  dates
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(
        initialStartDate ? new Date(initialStartDate) : null
    )
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(
        initialEndDate ? new Date(initialEndDate) : null
    )

    const { commissions } = useGroupedCommissions({ query: query || '' })

    const { enqueueSnackbar } = useSnackbar()
    const onFilterStartDate = (newValue: any) => {
        setFilterStartDate(newValue)
        handleDateFilter({ s: newValue, e: filterEndDate })
    }
    const onFilterEndDate = (newValue: any) => {
        setFilterEndDate(newValue)
        handleDateFilter({ s: filterStartDate, e: newValue })
    }

    const handleDateFilter = async ({ s, e }: any) => {
        try {
            const startDate = s ? format(s, 'yyyy-MM-dd') : null
            const endDate = e ? format(e, 'yyyy-MM-dd') : null

            let queryObj = {}
            if (startDate) {
                queryObj = { ...queryObj, startDate }
            }
            if (endDate) {
                queryObj = { ...queryObj, endDate }
            }

            const q = new URLSearchParams(queryObj).toString()
            navigate(`${PATH_DASHBOARD.commissions.root}?${q}`)
        } catch (err: any) {
            const msg =
                err?.error || err.message || 'Error loading attendant details'
            enqueueSnackbar(msg, { variant: 'error' })
        }
    }

    // console.log(commissions, 'commssions')

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <ErrorBoundary
                // fallback={<InternalError error="Error loading payments data" />}
                fallbackRender={fallbackRender}
            >
                <CustomBreadcrumbs
                    heading="Commissions"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'commissions',
                            href: PATH_DASHBOARD.commissions.root,
                        },
                    ]}
                    // action={
                    //     <Button
                    //         component={Link}
                    //         to="/payments/overdue"
                    //         endIcon={
                    //             <Iconify icon="eva:arrow-ios-forward-outline" />
                    //         }
                    //     >
                    //         Overdue payments
                    //     </Button>
                    // }
                />

                <Suspense fallback={<p>Loading...</p>}>
                    <Grid container spacing={4}>
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

                        <Grid item xs={12}>
                            {/* <PaymentsTable
                                data={payments}
                                mutate={mutate}
                                accounts={accounts}
                            /> */}

                            <GroupedCommissionTable data={commissions ?? []} />
                        </Grid>
                    </Grid>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default Commissions
