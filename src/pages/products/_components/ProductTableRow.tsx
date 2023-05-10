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
    SelectChangeEvent,
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
import ProductSaleModal from '../../tasks/_components/ProductSaleModal'
import { apiUrl } from '../../../config-global'
import { useSnackbar } from '../../../components/snackbar'
import axios from '../../../utils/axios'
// import LoadingButton from '@mui/lab/LoadingButton'

// ----------------------------------------------------------------------

export default function ProductTableRow({
    row,
    accounts,
    selected,
    onEditRow,
    onDeleteRow,
    deleteLoader,
}: any) {
    const { id, name, price, inStock }: any = row

    const [openConfirm, setOpenConfirm] = useState(false)
    const [saleModal, setSaleModal] = useState(false)
    const [saleLoader, setSaleLoader] = useState(false)
    // const [product, setProduct] = useState<any>(null)
    const [vehicle, setVehicle] = useState<any>(null)
    const [quantity, setQuantity] = useState<any>('1')
    const [addVehicleModal, setAddVehicleModal] = useState(false)
    const [account, setAccount] = useState<any>('')
    const [reference, setReference] = useState<any>('')
    const [hasReference, setHasReference] = useState(false)

    const handleAccountChange = (e: SelectChangeEvent) => {
        setAccount(e.target.value)
        const ac = accounts.find((a: any) => a.id === e.target.value)
        // console.log(ac, 'is the account')
        setHasReference(ac?.name?.toLowerCase()?.includes('cash'))
    }

    const { enqueueSnackbar } = useSnackbar()

    const handleSale = async () => {
        try {
            if (!vehicle) {
                throw new Error('Please select a vehicle')
            }

            // check if quantity is valid valid number greater than 0
            if (!quantity || Number(quantity) <= 0) {
                throw new Error('Please enter a valid quantity')
            }

            if (!account) {
                throw new Error('Please select an account')
            }
            const ref = reference.trim()
            if (!hasReference && !ref) {
                throw new Error('Please enter payment reference')
            }
            // create sale
            setSaleLoader(true)
            // const b = 1

            // if (b === 1) {
            //     throw new Error('Test case: OK')
            // }
            const url = `${apiUrl}/sales`
            const payload = {
                vehicleId: vehicle.id,
                accountId: account,
                reference,
                amount: price * Number(quantity) ?? 0,
                saleProducts: [
                    {
                        productId: id,
                        quantity: Number(quantity) ?? 0,
                        amount: price * Number(quantity) ?? 0,
                    },
                ],
            }

            const response = await axios.post(url, payload)
            if (response.status === 200) {
                // mutate()
                enqueueSnackbar('Sale recorded successfully', {
                    variant: 'success',
                })
                setSaleModal(false)
            } else {
                const { data } = response
                throw new Error(data.error)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Something went wrong'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setSaleLoader(false)
        }
    }

    const theme = useTheme()

    const handleOpenConfirm = () => {
        setOpenConfirm(true)
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
    }

    // const styles: any = {
    //     color: theme.palette.mode === 'dark' ? 'white' : 'black',
    //     textDecoration: 'none',
    // }

    return (
        <>
            <TableRow hover selected={selected}>
                {/* <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell> */}

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                            {name}
                            {/* <Link
                                style={styles}
                                to={PATH_DASHBOARD.users.details(id)}
                            >
                                {name}
                            </Link> */}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell align="left">{price}</TableCell>
                <TableCell align="left">
                    {inStock ? 'In Stock' : 'Out of stock'}
                </TableCell>

                <TableCell align="left">
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        onClick={onEditRow}
                    >
                        Edit
                    </Button>
                </TableCell>

                <TableCell align="left">
                    <LoadingButton
                        color="error"
                        variant="outlined"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={handleOpenConfirm}
                    >
                        Delete
                    </LoadingButton>
                </TableCell>

                <TableCell align="left">
                    <Button
                        color="info"
                        variant="outlined"
                        startIcon={<Iconify icon="eva:shopping-bag-fill" />}
                        onClick={() => setSaleModal(true)}
                    >
                        Sell
                    </Button>
                </TableCell>
            </TableRow>
            <ProductSaleModal
                open={saleModal}
                handleClose={() => {
                    setSaleModal(false)
                    setVehicle(null)
                    setQuantity('1')
                    setAccount('')
                    setReference('')
                }}
                loading={saleLoader}
                handleSubmit={handleSale}
                setProduct={() => {}}
                productName={name}
                setVehicle={setVehicle}
                setQuantity={setQuantity}
                quantity={quantity}
                accounts={accounts}
                account={account}
                reference={reference}
                vehicle={vehicle}
                setReference={setReference}
                hasReference={hasReference}
                handleAccountChange={handleAccountChange}
                setAddVehicleModal={setAddVehicleModal}
            />
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
