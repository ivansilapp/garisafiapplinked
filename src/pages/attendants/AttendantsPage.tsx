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
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { LoadingButton } from '@mui/lab'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { useSnackbar } from '../../components/snackbar'
import useAttendantList from '../../hooks/attendant/useAttendantList'
import { PATH_DASHBOARD } from '../../routes/paths'
import axios from '../../utils/axios'
import AttendantForm from './_components/AttendantForm'
import AttendantsTable from './_components/AttendantsTable'
import { fCurrency } from '../../utils/formatNumber'
import useAccountList from '../../hooks/account/useAccountList'

function AttendantsPage() {
    const { themeStretch } = useSettingsContext()
    const { attendants, mutate } = useAttendantList()
    const { accounts } = useAccountList()
    const [open, setOpen] = useState(false)
    const [payModal, setPayModal] = useState(false)
    const [paymentLoader, setPaymentLoader] = useState(false)
    const [account, setAccount] = useState<any>('')
    const [reference, setReference] = useState<any>('')
    const [hasReference, setHasReference] = useState(false)

    const [activeAttendant, setActiveAttendant] = useState<any>(null)

    const { enqueueSnackbar } = useSnackbar()

    const handleClose = () => {
        setOpen(false)
        setActiveAttendant(null)
    }

    const handleUpdate = async (data: any) => {
        try {
            setActiveAttendant(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }

    const onSubmit = async (payload: any) => {
        try {
            if (activeAttendant && activeAttendant.id) {
                // update record
                const { data } = await axios.put(
                    `/attendant/${activeAttendant.id}`,
                    payload
                )
                if (data) {
                    mutate()
                    enqueueSnackbar('Attendant updated successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveAttendant(null)
                }
            } else {
                // update record
                const { data } = await axios.post('/attendant', payload)
                if (data) {
                    mutate()
                    enqueueSnackbar('Attendant added successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveAttendant(null)
                }
            }
        } catch (err: any) {
            enqueueSnackbar(err.message || 'Opearation failed', {
                variant: 'error',
            })
        }
    }

    const totalCommision = attendants.reduce((acc: any, curr: any) => {
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
                throw new Error(response.data.error || 'Opearation failed')
            }
            setPayModal(false)
            mutate()
            enqueueSnackbar('Payment successful', {
                variant: 'success',
            })
        } catch (err: any) {
            const msg = err.error || err.message || 'Opearation failed'
            enqueueSnackbar(msg || 'Opearation failed', {
                variant: 'error',
            })
        } finally {
            setPaymentLoader(false)
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <ErrorBoundary
                fallback={
                    <InternalError error="Error loading attendants data" />
                }
            >
                <CustomBreadcrumbs
                    heading="Attendants"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'Attendants',
                            href: PATH_DASHBOARD.attendants.root,
                        },
                    ]}
                    action={
                        <Stack direction="row" gap={2}>
                            <Button
                                variant="outlined"
                                startIcon={<Iconify icon="eva:npm-outline" />}
                                onClick={() => setPayModal(true)}
                                color="info"
                                disabled={totalCommision === 0}
                            >
                                Pay all
                            </Button>
                            <Button
                                onClick={() => setOpen(true)}
                                variant="contained"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                            >
                                New attendant
                            </Button>
                        </Stack>
                    }
                />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4} xl={3}>
                        <Card sx={{ my: 4 }}>
                            <CardContent>
                                <Typography variant="h6" color="info">
                                    Commission not paid
                                </Typography>
                                <Typography variant="h4" color="info">
                                    {fCurrency(totalCommision)}
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

                <AttendantsTable
                    data={attendants}
                    mutate={mutate}
                    handleUpdate={handleUpdate}
                />

                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>Add attendant</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText /> */}

                        <AttendantForm
                            onSubmit={onSubmit}
                            attendant={activeAttendant}
                            handleClose={handleClose}
                        />
                    </DialogContent>
                </Dialog>

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
                                            <MenuItem key={ac.id} value={ac.id}>
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
                                        onClick={() => setPayModal(false)}
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
            </ErrorBoundary>
        </Container>
    )
}

export default AttendantsPage
