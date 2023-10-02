/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Button,
    Container,
    Grid,
    Stack,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material'
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
    const initialAccount = searchParams.get('account')

    // console.log('>>>>>>>>>>>>>> loading page >>>>>>>>>>>>>')

    // get query params
    let query = ''
    if (initialStartDate) {
        query = `${query}startDate=${initialStartDate}`
    }
    if (initialEndDate) {
        query = `${query}&endDate=${initialEndDate}`
    }

    if (initialAccount) {
        // console.log('initialAccount', initialAccount)
        query = `${query}${query === '' ? '' : '&'}account=${initialAccount}`
    }
    // set initial account value
    const [account, setAccount] = useState<any>(initialAccount || 0)
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
        handleDateFilter({ s: newValue, e: filterEndDate, a: account })
    }
    const onFilterEndDate = (newValue: any) => {
        setFilterEndDate(newValue)
        handleDateFilter({ s: filterStartDate, e: newValue, a: account })
    }

    const handleDateFilter = async ({ s, e, a }: any) => {
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

            // check initial account value
            // const accountVal = Number(a) || 0

            queryObj = { ...queryObj, account: a }

            console.log(queryObj, 'queryObj')

            const q = new URLSearchParams(queryObj).toString()
            console.log(q)
            navigate(`${PATH_DASHBOARD.payments.root}?${q}`)
        } catch (err: any) {
            const msg =
                err?.error || err.message || 'Error loading attendant details'
            enqueueSnackbar(msg, { variant: 'error' })
        }
    }

    const handleAccountChange = (e: any) => {
        const value = e?.target?.value
        setAccount(value)
        console.log(value, 'value')

        handleDateFilter({ s: filterStartDate, e: filterEndDate, a: value })
        // const ac = accounts.find((a: any) => a.id === e.target.value)
        // console.log(ac, 'is the account')
        // setHasReference(ac?.name?.toLowerCase()?.includes('cash'))
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
                                    <FormControl fullWidth>
                                        <InputLabel> Select Account</InputLabel>
                                        <Select
                                            labelId="account-selection-label"
                                            id="account-selection"
                                            value={account}
                                            label="Select Account"
                                            onChange={handleAccountChange}
                                        >
                                            <MenuItem value={0}>
                                                <em>All</em>
                                            </MenuItem>
                                            {accounts.map((ac: any) => {
                                                return (
                                                    <MenuItem
                                                        key={ac.id}
                                                        value={ac.id}
                                                    >
                                                        {ac.name}
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>

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
