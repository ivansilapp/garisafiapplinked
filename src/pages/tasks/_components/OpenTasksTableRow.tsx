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
import { mutate } from 'swr'
import Label from '../../../components/label'
import Iconify from '../../../components/iconify'
import MenuPopover from '../../../components/menu-popover'
import ConfirmDialog from '../../../components/confirm-dialog'
import { PATH_DASHBOARD } from '../../../routes/paths'
import { fDateTime } from '../../../utils/formatTime'
import { fCurrency, fNumber } from '../../../utils/formatNumber'
import axios from '../../../utils/axios'
import { apiUrl } from '../../../config-global'
import { useSnackbar } from '../../../components/snackbar'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function OpenTasksTableRow({ row }: any) {
    const { attendant, task, CreatedAt, id }: any = row

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')
    const initialEndDate = searchParams.get('endDate')
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = useState(false)

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

    const handleCloseTask = async (itemId: number | string) => {
        try {
            const url = `${apiUrl}/task/close-open/${itemId}`
            const response = await axios.put(url, {})
            if (response.status === 200) {
                mutate(`${apiUrl}/task/open`)
                enqueueSnackbar('Task close', {
                    variant: 'success',
                })
            } else {
                throw new Error(response.data.error)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Failed to close task'
            enqueueSnackbar(msg, {
                variant: 'error',
            })
        }
    }

    return (
        <TableRow hover>
            <TableCell> {fDateTime(CreatedAt, 'dd-MM-yyyy')}</TableCell>
            <TableCell align="left">
                <Button
                    component={Link}
                    to={`${PATH_DASHBOARD.attendants.details(
                        attendant?.id
                    )}?${query}`}
                >
                    {attendant.name}
                </Button>
            </TableCell>

            <TableCell align="left">
                <Button
                    component={Link}
                    to={PATH_DASHBOARD.tasks.details(task?.id)}
                >
                    Task {task?.id}
                </Button>
            </TableCell>

            <TableCell align="left">
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="warning"
                    onClick={() => handleCloseTask(id)}
                >
                    {' '}
                    Close Task{' '}
                </LoadingButton>
            </TableCell>
        </TableRow>
    )
}
