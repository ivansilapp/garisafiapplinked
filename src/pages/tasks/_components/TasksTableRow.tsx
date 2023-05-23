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
import { toUpper } from 'lodash'
import Label from '../../../components/label'
import Iconify from '../../../components/iconify'
import MenuPopover from '../../../components/menu-popover'
import ConfirmDialog from '../../../components/confirm-dialog'
import { PATH_DASHBOARD } from '../../../routes/paths'
import { fDateTime } from '../../../utils/formatTime'
import { fCurrency } from '../../../utils/formatNumber'
import { removeSpecialCharacters } from '../../../components/animate'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function TaskTableRow({
    row,
    selected,
    splitRevenue,
    onEditRow,
    readOnly,
    onDeleteRow,
    deleteLoader,
    handleInitComplete,
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
        jobs,
        sales,
    }: any = row

    const serviceInitials =
        jobs
            ?.map((j: any) => {
                const names = j?.name.split(' ')
                const initials = names.map((n: any) => n[0]).join('')
                return removeSpecialCharacters(initials)
            })
            .join(', ') ?? ''

    const [openConfirm, setOpenConfirm] = useState(false)

    // const [openPopover, setOpenPopover] = useState(null)

    const theme = useTheme()

    const isLight = theme.palette.mode === 'light'

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

    const revenue = splitRevenue ? Math.floor(cost / attendees.length) : cost

    // console.log('row', row)
    const salesCost =
        sales?.reduce((acc: any, sale: any) => {
            return acc + sale.amount
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
                            <Button
                                color="primary"
                                component={Link}
                                to={PATH_DASHBOARD.tasks.details(id)}
                            >
                                {fDateTime(CreatedAt, null)}
                            </Button>
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
                        {vehicle?.registration} - {vehicle?.model}
                    </Link>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2" noWrap>
                        <Label color="error"> {row?.pigeonhole} </Label>
                    </Typography>
                </TableCell>
                <TableCell align="left">{toUpper(serviceInitials)}</TableCell>

                <TableCell align="left">
                    <Stack display="flex" direction="row" spacing={1}>
                        {attendees?.map((a: any, i: number) => {
                            return (
                                <Button
                                    color="info"
                                    component={Link}
                                    style={styles}
                                    key={a.id}
                                    to={PATH_DASHBOARD.attendants.details(a.id)}
                                >
                                    {a?.name}
                                    {i !== attendees.length - 1 && ','}
                                </Button>
                            )
                        })}
                    </Stack>
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

                <TableCell align="right">
                    {fCurrency(revenue + salesCost)}
                </TableCell>
                <TableCell align="right">
                    <Label
                        variant={isLight ? 'soft' : 'filled'}
                        color={fullyPaid ? 'success' : 'error'}
                    >
                        {fullyPaid ? 'Paid' : 'Not paid'}
                    </Label>
                </TableCell>

                <TableCell align="right">
                    <Button
                        onClick={() => handleInitComplete(row)}
                        variant="contained"
                        color="info"
                        size="small"
                        disabled={status === 'complete'}
                    >
                        Complete
                    </Button>
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
                        color="info"
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
