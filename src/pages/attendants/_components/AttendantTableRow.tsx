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
import { fCurrency } from '../../../utils/formatNumber'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function AttendantTableRow({
    row,
    selected,
    onEditRow,
    onDeleteRow,
    deleteLoader,
}: any) {
    const { id, name, phone, email, status, commissions, tips }: any = row

    const [openConfirm, setOpenConfirm] = useState(false)

    const [openPopover, setOpenPopover] = useState(null)

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

    const calculateCommission = (comm: any) => {
        return (
            commissions?.reduce((acc: any, com: any) => {
                return acc + com.amount
            }, 0) ?? 0
        )
    }

    const totalTips =
        tips?.reduce((acc: any, tip: any) => {
            return acc + tip.amount
        }, 0) ?? 0

    return (
        <>
            <TableRow hover selected={selected}>
                {/* <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell> */}

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                            <Link
                                style={styles}
                                to={PATH_DASHBOARD.attendants.details(id)}
                            >
                                {name}
                            </Link>
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="left">{phone}</TableCell>
                <TableCell align="left">
                    {fCurrency(calculateCommission(commissions))}
                </TableCell>
                <TableCell align="left">{fCurrency(totalTips)}</TableCell>
                <TableCell align="left">{status}</TableCell>

                <TableCell align="center">
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        onClick={onEditRow}
                        color="info"
                    >
                        Edit
                    </Button>
                </TableCell>

                <TableCell align="right">
                    <LoadingButton
                        variant="outlined"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={handleOpenConfirm}
                        color="error"
                    >
                        Delete
                    </LoadingButton>
                </TableCell>
            </TableRow>

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
