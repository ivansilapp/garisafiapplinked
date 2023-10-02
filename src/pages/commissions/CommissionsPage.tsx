/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { LoadingButton } from '@mui/lab'
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
import Iconify from '../../components/iconify'
import useAttendantList from '../../hooks/attendant/useAttendantList'
import useAccountList from '../../hooks/account/useAccountList'
import axios from '../../utils/axios'
import { fCurrency } from '../../utils/formatNumber'

function Commissions() {
    const { themeStretch } = useSettingsContext()
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')

    const { attendants, mutate } = useAttendantList()
    const { accounts } = useAccountList()
    const [open, setOpen] = useState(false)
    const [payModal, setPayModal] = useState(false)
    const [paymentLoader, setPaymentLoader] = useState(false)
    const [account, setAccount] = useState<any>('')
    const [reference, setReference] = useState<any>('')
    const [hasReference, setHasReference] = useState(false)

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

    const totalCommission = attendants.reduce((acc: any, curr: any) => {
        const currCommission = curr.commissions.reduce((a: any, c: any) => {
            return a + c.amount
        }, 0)
        return acc + currCommission
    }, 0)
    const totalTips = attendants.reduce((acc: any, curr: any) => {
        const currTips =
            curr?.tips.reduce((a: any, c: any) => {
                return a + c.amount
            }, 0) ?? 0
        return acc + currTips
    }, 0)

    const handleAccountChange = (e: SelectChangeEvent) => {
        setAccount(e.target.value)
        const ac = accounts.find((a: any) => a.id === e.target.value)
        // console.log(ac, 'is the account')
        const hr = ac?.name?.toLowerCase()?.includes('cash')
        setHasReference(!!hr)
    }

    const handleBulkPayment = async () => {
        try {
            setPaymentLoader(true)
            const response = await axios.post('/commission/pay-all', {
                accountId: Number(account),
                reference,
            })

            if (response.status !== 200) {
                throw new Error(response.data.error || 'Operation failed')
            }
            setPayModal(false)
            mutate()
            enqueueSnackbar('Payment successful', {
                variant: 'success',
            })
        } catch (err: any) {
            const msg = err.error || err.message || 'Operation failed'
            enqueueSnackbar(msg || 'Operation failed', {
                variant: 'error',
            })
        } finally {
            setPaymentLoader(false)
        }
    }

    // console.log(commissions, 'commissions')

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
                    action={
                        <Stack direction="row" gap={2}>
                            <Button
                                variant="outlined"
                                startIcon={<Iconify icon="eva:npm-outline" />}
                                onClick={() => setPayModal(true)}
                                color="info"
                                disabled={totalCommission === 0}
                            >
                                Pay all
                            </Button>
                            <Button
                                component={Link}
                                to="/payments/overdue"
                                endIcon={
                                    <Iconify icon="eva:arrow-ios-forward-outline" />
                                }
                            >
                                Overdue payments
                            </Button>
                        </Stack>
                    }
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

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4} xl={3}>
                                <Card sx={{ my: 4 }}>
                                    <CardContent>
                                        <Typography variant="h6" color="info">
                                            Commission not paid
                                        </Typography>
                                        <Typography variant="h4" color="info">
                                            {fCurrency(totalCommission)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4} xl={3}>
                                <Card sx={{ my: 4 }}>
                                    <CardContent>
                                        <Typography variant="h6" color="info">
                                            Tips not submitted
                                        </Typography>
                                        <Typography variant="h4" color="info">
                                            {fCurrency(totalTips)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            {/* <PaymentsTable
                                data={payments}
                                mutate={mutate}
                                accounts={accounts}
                            /> */}

                            <GroupedCommissionTable data={commissions ?? []} />

                            <Dialog
                                fullWidth
                                maxWidth="sm"
                                open={payModal}
                                onClose={() => {
                                    setPayModal(false)
                                }}
                            >
                                <DialogTitle>Bulk payment</DialogTitle>
                                <DialogContent>
                                    <Box sx={{ p: 2 }} gap={2} display="grid">
                                        <FormControl fullWidth>
                                            <InputLabel id="account-selection-label">
                                                Account
                                            </InputLabel>
                                            <Select
                                                labelId="account-selection-label"
                                                id="account-selection"
                                                value={account}
                                                label="Account"
                                                onChange={handleAccountChange}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {accounts?.map((ac: any) => {
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

                                        {/* <TextField
                                fullWidth
                                id="amount-txt"
                                label="Amount"
                                type="number"
                                variant="outlined"
                                value={amount}
                                onChange={handleAmountChange}
                            /> */}
                                        <TextField
                                            fullWidth
                                            id="reference-txt"
                                            label="Payment reference"
                                            variant="outlined"
                                            value={reference}
                                            disabled={hasReference}
                                            onChange={(e) => {
                                                setReference(e.target.value)
                                            }}
                                        />

                                        <Stack
                                            display="flex"
                                            alignItems="flex-end"
                                            gap={2}
                                            sx={{ my: 3 }}
                                        >
                                            <Box display="flex" gap={2}>
                                                <Button
                                                    color="warning"
                                                    variant="contained"
                                                    onClick={() =>
                                                        setPayModal(false)
                                                    }
                                                >
                                                    Cancel
                                                </Button>

                                                <LoadingButton
                                                    loading={paymentLoader}
                                                    variant="contained"
                                                    onClick={handleBulkPayment}
                                                >
                                                    Make bulk payment
                                                </LoadingButton>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </DialogContent>
                            </Dialog>
                        </Grid>
                    </Grid>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default Commissions
