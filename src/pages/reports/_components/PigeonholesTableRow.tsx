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
import { fDateTime } from '../../../utils/formatTime'
import { fCurrency, fNumber } from '../../../utils/formatNumber'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function TopAttendantsTableRow({ row }: any) {
    const { id, number, task, occupied, CreatedAt, closedAt }: any = row

    const theme = useTheme()

    return (
        <TableRow hover>
            <TableCell> {fDateTime(CreatedAt, null)}</TableCell>

            <TableCell align="left">{fNumber(number)}</TableCell>

            <TableCell align="left">
                {occupied ? (
                    <Label color="error">Occupied</Label>
                ) : (
                    <Label variant="ghost" color="error">
                        Released
                    </Label>
                )}
            </TableCell>

            <TableCell align="left">
                {closedAt ? fDateTime(closedAt, null) : '--'}
            </TableCell>

            <TableCell align="left">
                <Button
                    to={PATH_DASHBOARD.tasks.details(task.id)}
                    component={Link}
                >
                    task {task.id}
                </Button>
            </TableCell>
        </TableRow>
    )
}
