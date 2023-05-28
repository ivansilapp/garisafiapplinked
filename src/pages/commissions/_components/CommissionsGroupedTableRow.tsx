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

export default function GroupedCommissionTableRow({ row }: any) {
    const [searchParams] = useSearchParams()

    const {
        amount_paid,
        amount_not_paid,
        total_amount,
        attendantName,
        attendantId,
        date,
    }: any = row
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')

    // get query params
    let query = ''
    if (initialStartDate) {
        query = `${query}startDate=${initialStartDate}`
    }
    if (initialEndDate) {
        query = `${query}&endDate=${initialEndDate}`
    }

    // console.log('query', query)

    const [openConfirm, setOpenConfirm] = useState(false)

    const theme = useTheme()

    if (query === '') {
        query = `startDate=${format(new Date(date), 'yyyy-MM-dd')}`
    }

    return (
        <TableRow hover>
            <TableCell>{attendantName}</TableCell>
            <TableCell>{fDateTime(date, 'dd/MM/yyyy')}</TableCell>

            <TableCell align="left">{fCurrency(total_amount)}</TableCell>

            <TableCell align="left">{fNumber(amount_paid)}</TableCell>
            <TableCell align="left">{fNumber(amount_not_paid)}</TableCell>

            <TableCell align="left">
                <IconButton
                    component={Link}
                    to={`${PATH_DASHBOARD.attendants.details(
                        // format(new Date(created_at), 'yyyy-MM-dd')
                        attendantId
                    )}?${query}`}
                >
                    <Iconify icon="bx:bx-show" width={20} height={20} />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
