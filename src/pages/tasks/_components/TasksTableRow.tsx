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

export default function TaskTableRow({
    row,
    selected,
    onEditRow,
    readOnly,
    onDeleteRow,
    deleteLoader,
}: any) {
    const {
        id,
        cost,
        CreatedAt,
        attendant,
        fullyPaid,
        payments,
        status,
        vehicle,
        attendants,
    }: any = row

    const [openConfirm, setOpenConfirm] = useState(false)

    const [openPopover, setOpenPopover] = useState(null)

    const theme = useTheme()

    const paidAmount =
        payments?.reduce((acc: any, payment: any) => {
            return acc + payment.amount
        }, 0) ?? 0

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
    }

    const styles: any = {
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
        textDecoration: 'none',
    }

    const attendees = attendants
        ? attendants?.map((a: any) => a?.attendant)
        : []

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
                                to={PATH_DASHBOARD.tasks.details(id)}
                            >
                                {fDateTime(CreatedAt, null)}
                            </Link>
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="left">
                    <Link
                        style={styles}
                        to={PATH_DASHBOARD.systemData.vehilceDetails(
                            vehicle?.id
                        )}
                    >
                        {vehicle.registration}
                    </Link>
                </TableCell>

                <TableCell align="center">
                    <Typography variant="subtitle2" noWrap>
                        {row?.pigeonhole}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    {attendees.map((a: any) => {
                        return (
                            <Link
                                style={styles}
                                key={a.id}
                                to={PATH_DASHBOARD.attendants.details(a.id)}
                            >
                                {a.name}
                            </Link>
                        )
                    })}
                </TableCell>

                <TableCell align="left">
                    <Label
                        color={
                            (status === 'complete' && 'success') ||
                            (status === 'cancelled' && 'error') ||
                            (status === 'pending' && 'warning') ||
                            (status === 'ongoing' && 'info')
                        }
                    >
                        {status}
                    </Label>
                </TableCell>

                <TableCell align="right">{fCurrency(cost)}</TableCell>

                {/* <TableCell align="left">{fCurrency(paidAmount)}</TableCell> */}
                {/* <TableCell align="left">
                    {fullyPaid ? 'Fully paid' : 'Not fully paid'}
                </TableCell> */}

                {/* <TableCell align="center">
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        onClick={onEditRow}
                    >
                        Edit
                    </Button>
                </TableCell> */}

                {!readOnly ? (
                    <TableCell align="right">
                        <Button
                            variant="outlined"
                            color="warning"
                            startIcon={<Iconify icon="eva:close-outline" />}
                            onClick={() => {}}
                        >
                            Cancel
                        </Button>
                    </TableCell>
                ) : null}
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
