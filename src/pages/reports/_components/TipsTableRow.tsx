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
import { Link, NavLink, useSearchParams } from 'react-router-dom'
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

export default function TipsTableRow({ row }: any) {
    const { attendant, amount, CreatedAt, task, paid }: any = row

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')

    let query = ''

    if (initialStartDate) {
        query = `${query}startDate=${initialStartDate}`
    }
    if (initialEndDate) {
        query = `${query}&endDate=${initialEndDate}`
    }

    const theme = useTheme()

    const styles: any = {
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
        textDecoration: 'none',
    }

    return (
        <TableRow hover>
            <TableCell> {fDateTime(CreatedAt, 'dd-MM-yyyy')}</TableCell>
            <TableCell align="left">
                <Button
                    component={Link}
                    to={`${PATH_DASHBOARD.attendants.details(
                        attendant.id
                    )}?${query}`}
                >
                    {attendant.name}
                </Button>
            </TableCell>

            <TableCell align="left">{fCurrency(amount)}</TableCell>
            <TableCell align="left">{paid ? 'Paid ' : 'Not paid'}</TableCell>

            <TableCell align="left">
                <IconButton
                    component={Link}
                    to={PATH_DASHBOARD.tasks.details(task.id)}
                >
                    <Iconify icon="bx:bx-show" width={20} height={20} />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
