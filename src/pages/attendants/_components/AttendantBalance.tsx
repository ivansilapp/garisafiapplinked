/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import {
    Button,
    Card,
    Typography,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material'
// utils
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import { fCurrency } from '../../../utils/formatNumber'
import { useSnackbar } from '../../../components/snackbar'
import { apiUrl } from '../../../config-global'
import axios from '../../../utils/axios'

// ----------------------------------------------------------------------

export default function AttendantBalance({
    title,
    currentBalance,
    unpaidTasks,
    accounts,
    tips,
    id,
    mutate,
    sx,
    ...other
}: any) {
    // const totalAmount = currentBalance + unpaidTasks
    const [paymentModal, setPaymentModal] = useState(false)
    const [account, setAccount] = useState('')
    const [amount, setAmount] = useState('')
    const [paymentLoader, setPaymentLoader] = useState(false)
    const [reference, setReference] = useState('')

    const [comissionPayment, setComissionPayment] = useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const tipsTotal = tips.reduce((acc: any, cur: any) => {
        return acc + cur.amount
    }, 0)

    const handleMakePayment = async () => {
        try {
            //  make payment request
            setPaymentLoader(true)
            const amt = Number(amount) ?? 0
            const ref = reference ?? ''
            const acc = account ?? ''
            if (amt <= 0) {
                throw new Error('Amount must be greater than zero')
            }
            if (acc === '') {
                throw new Error('Select paying account')
            }
            const payload = {
                accountId: acc,
                amount: amt,
                reference: ref,
                attendantId: id,
            }

            //  make payment request
            const url = comissionPayment
                ? 'commission/pay'
                : 'commission/pay-tips'
            const response = await axios.post(`${apiUrl}/${url}`, payload)

            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Payment successful', { variant: 'success' })
                setPaymentModal(false)
            } else {
                const { data } = response
                throw new Error(data.error ?? 'Something went wrong')
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Something went wrong'
            console.log('err', err)
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setPaymentLoader(false)
        }
    }

    return (
        <Card sx={{ p: 3, ...sx }} {...other}>
            <Typography variant="subtitle2" gutterBottom>
                {title}
            </Typography>

            <Stack spacing={2}>
                <Typography variant="h3">
                    {fCurrency(currentBalance + tipsTotal)}
                </Typography>

                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Current commision
                    </Typography>
                    <Typography variant="body2">
                        {fCurrency(currentBalance)}
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Total tips
                    </Typography>
                    <Typography variant="subtitle1">
                        {fCurrency(tipsTotal)}
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Attendant commission
                    </Typography>
                    <Typography variant="subtitle1">
                        {fCurrency(tipsTotal + currentBalance)}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    {/* <Button fullWidth variant="contained" color="warning">
                        Transfer
                    </Button> */}

                    <Button
                        color="info"
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            setComissionPayment(false)
                            setPaymentModal(true)
                        }}
                    >
                        Pay tips
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            setComissionPayment(true)
                            setPaymentModal(true)
                        }}
                    >
                        Pay commission
                    </Button>
                </Stack>
            </Stack>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={paymentModal}
                onClose={() => {
                    setPaymentModal(false)
                    setAmount('')
                }}
            >
                <DialogTitle>
                    {comissionPayment ? 'Pay commision' : 'Pay tips'}
                </DialogTitle>
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
                                onChange={(e: any) =>
                                    setAccount(e.target.value)
                                }
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {accounts.map((ac: any) => {
                                    return (
                                        <MenuItem key={ac.id} value={ac.id}>
                                            {ac.name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            id="amount-txt"
                            label="Amount"
                            type="number"
                            variant="outlined"
                            value={amount}
                            onChange={(e: any) => setAmount(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            id="reference-txt"
                            label="Payment reference"
                            variant="outlined"
                            value={reference}
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
                                    onClick={() => setPaymentModal(false)}
                                >
                                    Cancel
                                </Button>

                                <LoadingButton
                                    loading={paymentLoader}
                                    variant="contained"
                                    onClick={handleMakePayment}
                                >
                                    Make payment
                                </LoadingButton>
                            </Box>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
