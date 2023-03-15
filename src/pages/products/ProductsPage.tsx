import {
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { useSnackbar } from '../../components/snackbar'
import useProductList from '../../hooks/product/useProductList'
import { PATH_DASHBOARD } from '../../routes/paths'
import axios from '../../utils/axios'
import ProductForm from './_components/ProductForm'
import ProductsTable from './_components/ProductsTable'

function ProductsPage() {
    const { themeStretch } = useSettingsContext()

    const { products, mutate } = useProductList()

    const [open, setOpen] = useState(false)
    const [activeProduct, setActiveProduct] = useState<any>(null)

    const { enqueueSnackbar } = useSnackbar()

    const handleClose = () => {
        setOpen(false)
        setActiveProduct(null)
    }

    const handleUpdate = async (data: any) => {
        try {
            setActiveProduct(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }
    // console.log(products)
    const onSubmit = async (payload: any) => {
        try {
            if (activeProduct && activeProduct.id) {
                // update record
                const { data } = await axios.put(
                    `/product/${activeProduct.id}`,
                    payload
                )
                // console.log(data, 'data response data')
                if (data) {
                    mutate()
                    enqueueSnackbar('Product updated successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveProduct(null)
                }
            } else {
                // update record
                const { data } = await axios.post('/product', payload)
                if (data) {
                    mutate()
                    enqueueSnackbar('Product added successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveProduct(null)
                }
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Opearation failed'
            enqueueSnackbar(msg, {
                variant: 'error',
            })
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <ErrorBoundary
                fallback={<InternalError error="Error loading products data" />}
            >
                <CustomBreadcrumbs
                    heading="Products"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'products',
                            href: PATH_DASHBOARD.products.root,
                        },
                    ]}
                    action={
                        <Button
                            onClick={() => setOpen(true)}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New product
                        </Button>
                    }
                />

                <Suspense fallback={<p>Loading...</p>}>
                    <ProductsTable
                        data={products}
                        mutate={mutate}
                        handleUpdate={handleUpdate}
                    />

                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>Add Service</DialogTitle>
                        <DialogContent>
                            {/* <DialogContentText /> */}

                            <ProductForm
                                onSubmit={onSubmit}
                                product={activeProduct}
                                handleClose={handleClose}
                            />
                        </DialogContent>
                    </Dialog>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default ProductsPage
