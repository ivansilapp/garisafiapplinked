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
import Label from '../../../components/label'
import Iconify from '../../../components/iconify'
import MenuPopover from '../../../components/menu-popover'
import ConfirmDialog from '../../../components/confirm-dialog'
import { PATH_DASHBOARD } from '../../../routes/paths'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function ServiceTableRow({
    row,
    selected,
    onEditRow,
    onDeleteRow,
    deleteLoader,
}: any) {
    const { id, name }: any = row

    const [openConfirm, setOpenConfirm] = useState(false)

    const [openPopover, setOpenPopover] = useState(null)

    const theme = useTheme()

    const handleOpenConfirm = () => {
        setOpenConfirm(true)
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
    }

    const handleOpenPopover = (event: any) => {
        setOpenPopover(event.currentTarget)
    }

    const handleClosePopover = () => {
        setOpenPopover(null)
    }

    const styles: any = {
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
        textDecoration: 'none',
    }

    return (
        <>
            <TableRow hover selected={selected}>
                {/* <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell> */}

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                            <Link
                                style={styles}
                                to={PATH_DASHBOARD.users.details(id)}
                            >
                                {name}
                            </Link>
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="left">
                    <Link style={styles} to={`/services/${id}`}>
                        Prices
                    </Link>
                </TableCell>

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
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={handleOpenConfirm}
                    >
                        Delete
                    </LoadingButton>
                </TableCell>

                {/* <TableCell align="left">{email}</TableCell>

                <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
                    {role}
                </TableCell>

                <TableCell align="center">
                    <Iconify
                        icon={
                            isVerified
                                ? 'eva:checkmark-circle-fill'
                                : 'eva:clock-outline'
                        }
                        sx={{
                            width: 20,
                            height: 20,
                            color: 'success.main',
                            ...(!isVerified && { color: 'warning.main' }),
                        }}
                    />
                </TableCell>

                <TableCell align="left">
                    <Label
                        variant="soft"
                        color={(status === 'banned' && 'error') || 'success'}
                        sx={{ textTransform: 'capitalize' }}
                    >
                        {status}
                    </Label>
                </TableCell> */}

                {/* <TableCell align="right">
                    <IconButton
                        color={openPopover ? 'inherit' : 'default'}
                        onClick={handleOpenPopover}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell> */}
            </TableRow>

            {/* <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem
                    onClick={() => {
                        handleOpenConfirm()
                        handleClosePopover()
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="eva:trash-2-outline" />
                    Delete
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onEditRow()
                        handleClosePopover()
                    }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Edit
                </MenuItem>
            </MenuPopover> */}

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
