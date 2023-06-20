/* eslint-disable no-nested-ternary */
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
import { apiUrl } from '../../../config-global'
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
    handleInitPayment,
    handleRedeem,
    redeemLoader,
}: any) {
    const {
        id,
        cost,
        CreatedAt,
        attendant,
        closed,
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

    const taskStatus: string = status

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

    // console.log({ status, fullyPaid })

    // console.log(vehicle.points)

    return (
        <>
            <TableRow hover selected={selected}>
                {/* <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell> */}

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        <Button
                            sx={{ p: 0 }}
                            color="primary"
                            component={Link}
                            to={PATH_DASHBOARD.tasks.details(id)}
                        >
                            {fDateTime(CreatedAt, null)}
                        </Button>
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2" noWrap>
                        <Link
                            style={styles}
                            to={PATH_DASHBOARD.systemData.vehilceDetails(
                                vehicle?.id
                            )}
                        >
                            {vehicle?.registration} - {vehicle?.model}
                        </Link>
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2" noWrap>
                        <Label sx={{ fontSize: '16px' }} color="error">
                            {row?.pigeonhole}
                        </Label>
                    </Typography>
                </TableCell>
                <TableCell align="left">{toUpper(serviceInitials)}</TableCell>

                <TableCell align="left">
                    <Stack display="flex" direction="row" spacing={1}>
                        {attendees?.map((a: any, i: number) => {
                            return (
                                <Link
                                    color="info"
                                    style={{ ...styles, pading: '3px' }}
                                    key={a.id}
                                    to={PATH_DASHBOARD.attendants.details(a.id)}
                                >
                                    {a?.name}
                                    {i !== attendees.length - 1 && ','}
                                </Link>
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
                    {status === 'ongoing' ||
                        (status === 'complete' && !fullyPaid) ? (
                        taskStatus === 'ongoing' ? (
                            <Button
                                onClick={() => handleInitComplete(row)}
                                variant="contained"
                                color="info"
                                size="small"
                                disabled={status === 'complete'}
                            >
                                Complete
                            </Button>
                        ) : (
                            <span>
                                {vehicle?.points?.points === 9 ? (
                                    <Typography variant="subtitle2" noWrap>
                                        <LoadingButton
                                            onClick={() => handleRedeem(row)}
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            loading={redeemLoader}
                                            disabled={fullyPaid}
                                        >
                                            Redeem
                                        </LoadingButton>
                                    </Typography>
                                ) : (
                                    <Typography variant="subtitle2" noWrap>
                                        <Button
                                            onClick={() =>
                                                handleInitPayment(row)
                                            }
                                            variant="contained"
                                            color="info"
                                            size="small"
                                            disabled={fullyPaid}
                                        >
                                            Add payment
                                        </Button>
                                    </Typography>
                                )}
                            </span>
                        )
                    ) : (
                        <Button
                            variant="contained"
                            color="info"
                            size="small"
                            disabled
                        >
                            Paid
                        </Button>
                        // <>
                        //     {status !== 'cancelled' && !closed ? (
                        //         <Button
                        //             onClick={() => handleInitComplete(row)}
                        //             variant="contained"
                        //             color="info"
                        //             size="small"
                        //             disabled={fullyPaid}
                        //         >
                        //             Close Task
                        //         </Button>
                        //     ) : (
                        //         <Button
                        //             variant="contained"
                        //             color="info"
                        //             size="small"
                        //             disabled={closed}
                        //         >
                        //             Closed
                        //         </Button>
                        //     )}
                        //     <span />
                        // </>
                    )}
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
            {/* <ConfirmDialog
                open={redeemConfirm}
                onClose={setRedeemConfirm}
                title="Redeem"
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
            /> */}
        </>
    )
}
