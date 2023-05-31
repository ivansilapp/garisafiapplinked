/* eslint-disable @typescript-eslint/no-use-before-define */
import { Button, Container, Grid, Stack } from '@mui/material'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import usePaymentList from '../../hooks/payments/usePaymentList'
import { PATH_DASHBOARD } from '../../routes/paths'
import PaymentsTable from './_components/PaymentTable'
import Iconify from '../../components/iconify'
import useAccountList from '../../hooks/account/useAccountList'
import { useSnackbar } from '../../components/snackbar'

function PaymentPage() {
    const { themeStretch } = useSettingsContext()
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')

    // console.log('>>>>>>>>>>>>>> loading page >>>>>>>>>>>>>')

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

    const { enqueueSnackbar } = useSnackbar()

    const { payments, mutate } = usePaymentList({ query })
    const { accounts } = useAccountList()

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
            navigate(`${PATH_DASHBOARD.payments.root}?${q}`)
        } catch (err: any) {
            const msg =
                err?.error || err.message || 'Error loading attendant details'
            enqueueSnackbar(msg, { variant: 'error' })
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <ErrorBoundary
                fallback={<InternalError error="Error loading payments data" />}
            >
                <CustomBreadcrumbs
                    heading="Payments"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'payments',
                            href: PATH_DASHBOARD.payments.root,
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
                            <PaymentsTable
                                data={payments}
                                mutate={mutate}
                                accounts={accounts}
                            />
                        </Grid>
                    </Grid>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default PaymentPage
