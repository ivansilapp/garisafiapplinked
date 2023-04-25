/* eslint-disable @typescript-eslint/naming-convention */
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
import { format } from 'date-fns'
import Label from '../../../components/label'
import Iconify from '../../../components/iconify'
import MenuPopover from '../../../components/menu-popover'
import ConfirmDialog from '../../../components/confirm-dialog'
import { PATH_DASHBOARD } from '../../../routes/paths'
import { fDate, fDateTime } from '../../../utils/formatTime'
import { fCurrency, fNumber } from '../../../utils/formatNumber'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function CommissionTableRow({ row }: any) {
    const { id, total, tasks, revenue, taskId, amount, CreatedAt, paid }: any =
        row

    const theme = useTheme()

    return (
        <TableRow hover>
            <TableCell> {fDate(CreatedAt, null)}</TableCell>

            <TableCell align="left">{fCurrency(amount)}</TableCell>

            <TableCell align="left">
                {paid ? <Label>Paid</Label> : <Label> Not paid</Label>}
            </TableCell>
            <TableCell align="left">
                <Button
                    component={Link}
                    to={PATH_DASHBOARD.tasks.details(taskId)}
                >
                    Task info
                </Button>
            </TableCell>

            {/* <TableCell align="left">
                <IconButton
                    component={Link}
                    to={PATH_DASHBOARD.attendants.details(id)}
                >
                    <Iconify icon="bx:bx-show" width={20} height={20} />
                </IconButton>
            </TableCell> */}
        </TableRow>
    )
}
