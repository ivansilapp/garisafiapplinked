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
import { Link, NavLink, useParams } from 'react-router-dom'
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
import http from '../../../utils/axios'
import { apiUrl } from '../../../config-global'
// import Label from '../../../components/label'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function SalesTableRow({ row }: any) {
    const { id, amount, cancelled, CreatedAt, vehicle, products }: any = row

    const [openConfirm, setOpenConfirm] = useState(false)
    const [deleteLoader, setDeleteLoader] = useState(false)

    const { date } = useParams<{ date: string }>()

    // const theme = useTheme()

    const onDeleteRow = async () => {
        try {
            // clear
            const url = `/tasks/sale/cancel/${id}`
            const response = await http.put(url, {})
            setDeleteLoader(true)

            if (response.status === 200) {
                mutate(`${apiUrl}/report/ungrouped-sales?startDate=${date}`)
                setOpenConfirm(false)
            } else {
                const { data }: any = response
                throw new Error(data?.error)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setDeleteLoader(false)
        }
    }

    const items =
        products?.map((item: any) => item?.product?.name ?? '').join(', ') ?? ''

    // const styles: any = {
    //     color: theme.palette.mode === 'dark' ? 'white' : 'black',
    //     textDecoration: 'none',
    // }

    return (
        <TableRow hover>
            <TableCell>{fDateTime(CreatedAt, null)}</TableCell>

            <TableCell align="left">{vehicle?.registration}</TableCell>

            <TableCell align="left">
                {cancelled ? (
                    <Label color="error"> cancelled </Label>
                ) : (
                    <Label> </Label>
                )}
            </TableCell>

            <TableCell align="left">{items}</TableCell>

            <TableCell align="left">{fCurrency(amount)}</TableCell>

            <TableCell align="left">
                <Button
                    variant="outlined"
                    size="small"
                    color="warning"
                    disabled={cancelled}
                    onClick={() => setOpenConfirm(true)}
                >
                    Cancel
                </Button>
            </TableCell>

            {/* <TableCell align="left">{fCurrency(amountPaid)}</TableCell> */}

            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                title="Cancel sale"
                content="Are you sure want to cancel sale?"
                action={
                    <LoadingButton
                        variant="contained"
                        color="error"
                        onClick={onDeleteRow}
                        loading={deleteLoader}
                    >
                        Yes
                    </LoadingButton>
                }
            />
        </TableRow>
    )
}
