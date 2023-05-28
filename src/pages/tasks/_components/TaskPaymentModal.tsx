import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    PropTypes,
    Select,
    Stack,
    TextField,
} from '@mui/material'
import { useState } from 'react'

import axios from '../../../utils/axios'
import { useSnackbar } from '../../../components/snackbar'
import { apiUrl } from '../../../config-global'

export default function TaskPaymentModal({
    paymentModal,
    setPaymentModal,
    handleAddPayment,
    accounts,
}: {
    paymentModal: boolean
    setPaymentModal: any
    handleAddPayment: any
    accounts: any[]
}): JSX.Element {
    const [amount, setAmount] = useState('')
    const [account, setAccount] = useState('')
    const [reference, setReference] = useState('')
    const [loader, setLoader] = useState(false)
    const [hasReference, setHasReference] = useState(true)

    const { enqueueSnackbar } = useSnackbar()

    const handleSubmitPayment = async () => {
        try {
            setLoader(true)
            if (!account) {
                enqueueSnackbar('Please select an account', {
                    variant: 'error',
                })
                return
            }
            if (!amount) {
                enqueueSnackbar('Please enter an amount', {
                    variant: 'error',
                })
                return
            }
            // eslint-disable-next-line no-restricted-globals
            if (isNaN(Number(amount))) {
                enqueueSnackbar('Please enter a valid amount', {
                    variant: 'error',
                })
                return
            }
            // check if account is mpesa and has refrence
            if (!hasReference && reference === '') {
                enqueueSnackbar('Please enter a refrence', {
                    variant: 'error',
                })
                return
            }
            const payload = {
                amount: Number(amount) ?? 0,
                accountId: account,
                reference,
                saleId: 1,
            }
            await handleAddPayment(payload)
        } catch (err) {
            /// console error
        } finally {
            setLoader(false)
        }
    }

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={paymentModal}
            onClose={() => {
                setPaymentModal(false)
                setAmount('')
            }}
        >
            <DialogTitle>Add payment</DialogTitle>
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
                            onChange={(e) => {
                                setAccount(e.target.value)
                                const ac = accounts.find(
                                    (a: any) => a.id === e.target.value
                                )
                                // console.log(ac, 'is the account')
                                setHasReference(
                                    ac?.name?.toLowerCase()?.includes('cash')
                                )
                            }}
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
                        onChange={(e) => {
                            const val = e.target?.value ?? ''
                            setAmount(val)
                        }}
                    />
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
                                onClick={() => {
                                    setReference('')
                                    setAmount('')
                                    setAccount('')
                                    setPaymentModal(false)
                                }}
                            >
                                Cancel
                            </Button>

                            <LoadingButton
                                loading={loader}
                                variant="contained"
                                onClick={handleSubmitPayment}
                            >
                                Add payment
                            </LoadingButton>
                        </Box>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
