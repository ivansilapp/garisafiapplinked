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
// import { Link as RouterLink } from 'react-router-dom'
// components
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '@mui/system'
import LoadingButton from '@mui/lab/LoadingButton'
import Label from '../../../components/label'
import Iconify from '../../../components/iconify'
import MenuPopover from '../../../components/menu-popover'
import ConfirmDialog from '../../../components/confirm-dialog'
import { PATH_DASHBOARD } from '../../../routes/paths'
import { fDateTime } from '../../../utils/formatTime'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function WaitlistTableRow({
    row,
    selected,
    onDeleteRow,
    deleteLoader,
}: any) {
    const { id, registration, vehicleId, CreatedAt }: any = row

    // console.log(row)

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
                            <Link
                                style={styles}
                                to={PATH_DASHBOARD.systemData.vehilceDetails(
                                    vehicleId
                                )}
                            >
                                {registration}
                            </Link>
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="left">{fDateTime(CreatedAt, null)}</TableCell>
                <TableCell align="center">
                    <LoadingButton
                        onClick={() => setOpenConfirm(true)}
                        color="warning"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                    >
                        Remove{' '}
                    </LoadingButton>
                </TableCell>
                <TableCell align="right">
                    <Button
                        endIcon={<Iconify icon="eva:arrow-forward-outline" />}
                        component={Link}
                        to={PATH_DASHBOARD.tasks.newWithId(vehicleId)}
                    >
                        Create task
                    </Button>
                </TableCell>

                {/* <TableCell align="right">
                    <LoadingButton
                        variant="outlined"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={handleOpenConfirm}
                    >
                        Delete
                    </LoadingButton>
                </TableCell> */}
            </TableRow>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Delete"
                content="Are you sure want to delete this entry?"
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
