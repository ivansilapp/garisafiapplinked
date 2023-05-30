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
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/system'
import LoadingButton from '@mui/lab/LoadingButton'
// import Label from '../../../../components/label'
import Iconify from '../../../../components/iconify'
// import MenuPopover from '../../../../components/menu-popover'
import ConfirmDialog from '../../../../components/confirm-dialog'
import { PATH_DASHBOARD } from '../../../../routes/paths'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function PricelistTableRow({
    row,
    selected,
    onEditRow,
    onDeleteRow,
    deleteLoader,
}: any) {
    const { id, price, label }: any = row

    const [openConfirm, setOpenConfirm] = useState(false)

    const theme = useTheme()

    const handleOpenConfirm = () => {
        setOpenConfirm(true)
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
    }

    const styles: any = {
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
        textDecoration: 'none',
    }

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                            {label}
                            {/* <Link
                                style={styles}
                                to={PATH_DASHBOARD.users.details(id)}
                            >
                                {label}
                            </Link> */}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="left">{price}</TableCell>

                <TableCell align="center">
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        onClick={onEditRow}
                    >
                        Edit
                    </Button>
                </TableCell>

                <TableCell align="right">
                    <LoadingButton
                        variant="outlined"
                        color="error"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={handleOpenConfirm}
                    >
                        Delete
                    </LoadingButton>
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
