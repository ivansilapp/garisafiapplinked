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
    Select,
    Stack,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import { useSnackbar } from '../../../../components/snackbar'

function AccountChangeModal({
    accounts,
    title,
    open,
    handleClose,
    action,
    accountId,
    loader,
}: {
    accounts: []
    title: string
    open: boolean
    handleClose: () => void
    action: (payload: any) => void
    accountId: number
    loader: boolean
}) {
    const [paymentModal, setPaymentModal] = useState(false)
    // const [account, setAccount] = useState('')
    const [amount, setAmount] = useState('')
    const [paymentLoader, setPaymentLoader] = useState(false)
    const [reference, setReference] = useState('')

    const { enqueueSnackbar } = useSnackbar()

    const handleMakePayment = () => {
        const payload = {
            amount: Number(amount),
            reference,
            accountId,
        }

        if (payload.amount <= 0) {
            enqueueSnackbar('Amount must be greater than zero', {
                variant: 'error',
            })
            return
        }

        if (!payload.accountId) {
            enqueueSnackbar('Select paying account', {
                variant: 'error',
            })
            return
        }

        action(payload)
    }

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={() => {
                handleClose()
                setAmount('')
            }}
        >
            <DialogTitle>{title ?? 'Make payment'}</DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }} gap={2} display="grid">
                    {/* <FormControl fullWidth>
                        <InputLabel id="account-selection-label">
                            Account
                        </InputLabel>
                        <Select
                            labelId="account-selection-label"
                            id="account-selection"
                            value={account}
                            label="Account"
                            onChange={(e: any) => setAccount(e.target.value)}
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
                    </FormControl> */}

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
                                onClick={() => handleClose()}
                            >
                                Cancel
                            </Button>

                            <LoadingButton
                                loading={loader}
                                variant="contained"
                                onClick={handleMakePayment}
                            >
                                Submit
                            </LoadingButton>
                        </Box>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default AccountChangeModal
