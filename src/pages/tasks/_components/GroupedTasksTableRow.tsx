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

export default function GroupedTaskTableRow({ row }: any) {
    const { total, cost, created_at }: any = row

    const [openConfirm, setOpenConfirm] = useState(false)

    const theme = useTheme()

    const styles: any = {
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
        textDecoration: 'none',
    }

    return (
        <TableRow hover>
            <TableCell>{fDate(created_at, null)}</TableCell>

            <TableCell align="left">{fCurrency(cost)}</TableCell>

            <TableCell align="left">{fNumber(total)}</TableCell>

            <TableCell align="left">
                <IconButton
                    component={Link}
                    to={PATH_DASHBOARD.reports.durationTasks(
                        format(new Date(created_at), 'yyyy-MM-dd')
                    )}
                >
                    <Iconify icon="bx:bx-show" width={20} height={20} />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
