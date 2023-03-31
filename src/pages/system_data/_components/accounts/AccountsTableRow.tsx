import PropTypes from 'prop-types'
import { useState } from 'react'
// @mui
import {
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    IconButton,
    Typography,
} from '@mui/material'
// components
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/system'
import LoadingButton from '@mui/lab/LoadingButton'
import Label from '../../../../components/label'
import Iconify from '../../../../components/iconify'
import MenuPopover from '../../../../components/menu-popover'
import ConfirmDialog from '../../../../components/confirm-dialog'
import { PATH_DASHBOARD } from '../../../../routes/paths'
import AccountChangeModal from './AccountChangeModal'
import axios from '../../../../utils/axios'
import { apiUrl } from '../../../../config-global'
import { useSnackbar } from '../../../../components/snackbar'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function AccountTableRow({
    row,
    selected,
    onEditRow,
    onDeleteRow,
    deleteLoader,
    accounts,
    mutate,
}: any) {
    const { id, name, balance, status }: any = row

    const [openConfirm, setOpenConfirm] = useState(false)

    const [depositLoader, setDepositLoader] = useState(false)

    const [depositModal, setDepositModal] = useState(false)
    const [withdrawModal, setWithdrawModal] = useState(false)

    const theme = useTheme()

    const { enqueueSnackbar } = useSnackbar()

    const handleOpenConfirm = () => {
        setOpenConfirm(true)
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
    }

    const handleDeposit = async (payload: any) => {
        try {
            setDepositLoader(true)
            const response = await axios.put(
                `${apiUrl}/account/deposit`,
                payload
            )

            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Deposit successful', { variant: 'success' })
                setDepositModal(false)
            } else {
                const { data } = response
                throw new Error(data.error ?? 'Something went wrong')
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Something went wrong'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setDepositLoader(false)
        }
    }
    const handleWithdraw = async (payload: any) => {
        try {
            setDepositLoader(true)
            const response = await axios.put(
                `${apiUrl}/account/withdraw`,
                payload
            )

            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Deposit successful', { variant: 'success' })
                setWithdrawModal(false)
            } else {
                const { data } = response
                throw new Error(data.error ?? 'Something went wrong')
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Something went wrong'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setDepositLoader(false)
        }
    }

    const styles: any = {
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
        textDecoration: 'none',
    }

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                            <Link
                                style={styles}
                                to={PATH_DASHBOARD.users.details(id)}
                            >
                                {name}
                            </Link>
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="left">{balance}</TableCell>

                <TableCell align="left">{status ?? 'Inactive'}</TableCell>

                <TableCell align="center">
                    <Button
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        onClick={onEditRow}
                    >
                        Edit
                    </Button>
                </TableCell>

                <TableCell align="right">
                    <LoadingButton
                        color="error"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={handleOpenConfirm}
                    >
                        Delete
                    </LoadingButton>
                </TableCell>

                <TableCell align="left">
                    <Button
                        onClick={() => setWithdrawModal(true)}
                        variant="outlined"
                        color="warning"
                    >
                        Widthdraw
                    </Button>
                </TableCell>

                <TableCell align="left">
                    <Button
                        onClick={() => setDepositModal(true)}
                        variant="outlined"
                        color="success"
                    >
                        Deposit
                    </Button>
                </TableCell>
            </TableRow>

            <AccountChangeModal
                handleClose={() => setDepositModal(false)}
                open={depositModal}
                title={`Deposit to ${name}`}
                accounts={accounts}
                action={handleDeposit}
                accountId={id}
                loader={depositLoader}
            />
            <AccountChangeModal
                handleClose={() => setWithdrawModal(false)}
                open={withdrawModal}
                title={`Withdraw to ${name}`}
                accounts={accounts}
                action={handleWithdraw}
                accountId={id}
                loader={depositLoader}
            />

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <LoadingButton
                        variant="contained"
                        color="error"
                        onClick={onDeleteRow}
                        loading={deleteLoader}
                    >
                        Delete
                    </LoadingButton>
                }
            />
        </>
    )
}
