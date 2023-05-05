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
import useClientList from '../../../hooks/client/useClientList'
import useVehicleList from '../../../hooks/vehicle/useVehicleList'
import { PATH_DASHBOARD } from '../../../routes/paths'
import axios from '../../../utils/axios'
import VehicleForm from '../_components/vehicle/VehicleForm'
import VehicleTable from '../_components/vehicle/VehicleTable'

function VihiclesPage() {
    const { themeStretch } = useSettingsContext()

    const { vehicles, mutate } = useVehicleList()
    const { bodyTypes } = useBodyTypes()

    const { clients } = useClientList()

    const { enqueueSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)
    const [updateLoader, setUpdateLoader] = useState(false)
    const [activeVehilce, setActiveVehilce] = useState<any>(null)

    const handleClose = () => {
        setOpen(false)
        setActiveVehilce(null)
    }

    const handleUpdate = async (data: any) => {
        try {
            setActiveVehilce(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }

    const onSubmit = async (payloadData: any) => {
        try {
            if (Number(payloadData.points) > 9) {
                enqueueSnackbar('Reward points should be less than 10', {
                    variant: 'error',
                })
                return
            }

            const payload = {
                ...payloadData,
                points:
                    activeVehilce && activeVehilce.id
                        ? payloadData.points
                        : Number(payloadData.points),
            }
            if (activeVehilce && activeVehilce.id) {
                // update record
                const { data } = await axios.put(
                    `/vehicle/${activeVehilce.id}`,
                    payload
                )
                if (data) {
                    mutate()
                    enqueueSnackbar('Vehicle updated successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveVehilce(null)
                }
            } else {
                // update record
                const { data } = await axios.post('/vehicle', payload)
                if (data) {
                    mutate()
                    enqueueSnackbar('Vehicle added successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveVehilce(null)
                }
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Opearation failed'
            enqueueSnackbar(msg, {
                variant: 'error',
            })
        } finally {
            setUpdateLoader(false)
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Vehicles"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'Vehicle types',
                        href: PATH_DASHBOARD.systemData.vehicles,
                    },
                ]}
                action={
                    <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New vehiecle
                    </Button>
                }
            />

            <ErrorBoundary
                fallback={
                    <InternalError error="Page did not load correctly try again" />
                }
            >
                <Suspense fallback={<p> loading... </p>}>
                    <VehicleTable
                        mutate={mutate}
                        handleUpdate={handleUpdate}
                        data={vehicles}
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

                            <VehicleForm
                                onSubmit={onSubmit}
                                vehicle={activeVehilce}
                                handleClose={handleClose}
                                clients={clients}
                                bodyTypes={bodyTypes}
                            />
                        </DialogContent>
                    </Dialog>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default VihiclesPage
