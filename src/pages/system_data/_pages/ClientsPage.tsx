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
import useClientList from '../../../hooks/client/useClientList'
import { PATH_DASHBOARD } from '../../../routes/paths'
import axios from '../../../utils/axios'
import ProductForm from '../../products/_components/ProductForm'
import ClientForm from '../_components/client/ClientForm'
import ClientsTable from '../_components/client/ClientTable'

function ClientsPage() {
    const { themeStretch } = useSettingsContext()
    const [open, setOpen] = useState(false)
    const [activeClient, setActiveClient] = useState<any>(null)

    const { clients, mutate } = useClientList()

    const { enqueueSnackbar } = useSnackbar()

    const handleClose = () => {
        setOpen(false)
        setActiveClient(null)
    }

    const handleUpdate = async (data: any) => {
        try {
            setActiveClient(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }

    const onSubmit = async (payload: any) => {
        try {
            if (activeClient && activeClient.id) {
                // update record
                await axios.put(`/client/${activeClient.id}`, payload)
                mutate()
                enqueueSnackbar('Client updated successfully', {
                    variant: 'success',
                })
                setOpen(false)
                setActiveClient(null)
            } else {
                // update record
                await axios.post('/client', payload)

                mutate()
                enqueueSnackbar('Client added successfully', {
                    variant: 'success',
                })
                setOpen(false)
                setActiveClient(null)
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
                fallback={<InternalError error="Error loading clients data" />}
            >
                <CustomBreadcrumbs
                    heading="Clients"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'clients',
                            href: PATH_DASHBOARD.systemData.clients,
                        },
                    ]}
                    action={
                        <Button
                            onClick={() => setOpen(true)}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New client
                        </Button>
                    }
                />
                <Suspense fallback={<p> loading... </p>}>
                    <ClientsTable
                        data={clients}
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
                            <ClientForm
                                onSubmit={onSubmit}
                                client={activeClient}
                                handleClose={handleClose}
                            />
                        </DialogContent>
                    </Dialog>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default ClientsPage
