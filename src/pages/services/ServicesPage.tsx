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
import useServicesList from '../../hooks/service/useServiceList'
import { PATH_DASHBOARD } from '../../routes/paths'
import axios from '../../utils/axios'
import ServiceForm from './_components/ServiceForm'
import ServicesTable from './_components/ServicesTable'

function ServicesPage() {
    const { themeStretch } = useSettingsContext()
    const { services, mutate } = useServicesList()

    const [open, setOpen] = useState(false)
    const [activeService, setActiveService] = useState<any>(null)

    const { enqueueSnackbar } = useSnackbar()

    const handleClose = () => {
        setOpen(false)
        setActiveService(null)
    }

    const handleUpdate = async (data: any) => {
        try {
            setActiveService(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }

    const onSubmit = async (payload: any) => {
        try {
            if (activeService && activeService.id) {
                // update record
                const { data } = await axios.put(
                    `/service/${activeService.id}`,
                    payload
                )
                if (data) {
                    mutate()
                    enqueueSnackbar('Service updated successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveService(null)
                }
            } else {
                // update record
                const { data } = await axios.post('/service', payload)
                if (data) {
                    mutate()
                    enqueueSnackbar('Service added successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveService(null)
                }
            }
        } catch (err: any) {
            enqueueSnackbar(err.message || 'Opearation failed', {
                variant: 'error',
            })
        } finally {
            //  setUpdateLoader(false)
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Services"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'Services',
                        href: PATH_DASHBOARD.services.root,
                    },
                ]}
                action={
                    <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New service
                    </Button>
                }
            />

            <ErrorBoundary
                fallback={<InternalError error="Error loading services" />}
            >
                <Suspense fallback={<p>Loading...</p>}>
                    <ServicesTable
                        data={services}
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

                            <ServiceForm
                                onSubmit={onSubmit}
                                service={activeService}
                                handleClose={handleClose}
                            />
                        </DialogContent>
                    </Dialog>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default ServicesPage
