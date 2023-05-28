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
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '@mui/system'
import LoadingButton from '@mui/lab/LoadingButton'
import Label from '../../../components/label'
import Iconify from '../../../components/iconify'
import MenuPopover from '../../../components/menu-popover'
import ConfirmDialog from '../../../components/confirm-dialog'
import { PATH_DASHBOARD } from '../../../routes/paths'
import { fDateTime } from '../../../utils/formatTime'
import { fCurrency } from '../../../utils/formatNumber'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function PaymentTableRow({ row, handlePaymentUpdate }: any) {
    const {
        id,
        amount,
        type,
        reference,
        user,
        incoming,
        CreatedAt,
        account,
    }: any = row

    const [openConfirm, setOpenConfirm] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)

    const theme = useTheme()

    const handleOpenConfirm = () => {
        setOpenConfirm(true)
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
    }

    const styles: any = {
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
        textDecoration: 'none',
    }

    return (
        <TableRow hover>
            <TableCell>{fDateTime(CreatedAt, 'dd/mm/yyyy')}</TableCell>

            <TableCell align="left">{incoming ? 'Debit' : 'Credit'}</TableCell>

            <TableCell align="left">
                <Button color={incoming ? 'success' : 'warning'}>
                    {incoming ? '+' : '-'} {fCurrency(amount)}
                </Button>
            </TableCell>

            <TableCell align="left">{account.name}</TableCell>

            <TableCell align="left">{reference}</TableCell>
            {/* <TableCell align="center">{type}</TableCell> */}
            <TableCell align="left">{user?.name}</TableCell>

            <TableCell align="left">
                <IconButton onClick={() => handlePaymentUpdate(row)}>
                    <Iconify icon="mdi:pencil" />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
