import {
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs'
import Iconify from '../../../components/iconify'
import { useSettingsContext } from '../../../components/settings'
import InternalError from '../../../components/shared/500Error'
import { useSnackbar } from '../../../components/snackbar'
import useBodyTypes from '../../../hooks/body-types/useBodyTypes'
import usePrices from '../../../hooks/prices/usePrices'
import useServiceList from '../../../hooks/service/useServiceList'
import { PATH_DASHBOARD } from '../../../routes/paths'
import axios from '../../../utils/axios'
import PricelistForm from '../_components/pricelist/PricelistForm'
import PricelistTable from '../_components/pricelist/PricelistTable'

function PricelistPage() {
    const { themeStretch } = useSettingsContext()
    const { enqueueSnackbar } = useSnackbar()

    const { prices, mutate } = usePrices()
    const { bodyTypes } = useBodyTypes()
    const { services } = useServiceList()

    const [open, setOpen] = useState(false)
    const [activePrice, setActivePrice] = useState<any>(null)

    const handleUpdate = async (data: any) => {
        try {
            setActivePrice(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }

    const handleClose = () => {
        setOpen(false)
        setActivePrice(null)
    }

    const onSubmit = async (data: any) => {
        console.log(data)
        try {
            if (activePrice && activePrice.id) {
                // update record
                const response = await axios.put(
                    `/pricelist/${activePrice?.id}`,
                    data
                )

                if (response.data) {
                    if (response.data?.error) {
                        enqueueSnackbar(response.data?.error, {
                            variant: 'error',
                        })
                        return
                    }
                    mutate()
                    enqueueSnackbar('Price updated successfully', {
                        variant: 'success',
                    })
                    setActivePrice(null)
                    setOpen(false)
                }
            } else {
                // create record
                const response = await axios.post('/pricelist', {
                    ...data,
                })

                console.log(response.data)

                if (response.data) {
                    if (response.data.error) {
                        enqueueSnackbar(response.data.error, {
                            variant: 'error',
                        })
                        return
                    }
                    mutate()
                    enqueueSnackbar('Price created successfully', {
                        variant: 'success',
                    })
                    setActivePrice(null)
                    setOpen(false)
                }
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Failed to create  record'
            enqueueSnackbar(msg, {
                variant: 'error',
            })
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Service prices"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'Price list',
                        href: PATH_DASHBOARD.systemData.pricelist,
                    },
                ]}
                action={
                    <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New Price
                    </Button>
                }
            />

            <ErrorBoundary fallback={<InternalError error="Pricelist error" />}>
                <Suspense fallback={<p>Loading...</p>}>
                    <PricelistTable
                        data={prices}
                        mutate={mutate}
                        handleUpdate={handleUpdate}
                    />

                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>Add vehicle</DialogTitle>
                        <DialogContent>
                            {/* <DialogContentText /> */}

                            <PricelistForm
                                onSubmit={onSubmit}
                                price={activePrice}
                                handleClose={handleClose}
                                bodyTypes={bodyTypes}
                                services={services}
                            />
                        </DialogContent>
                    </Dialog>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default PricelistPage
