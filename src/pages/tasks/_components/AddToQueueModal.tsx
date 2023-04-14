import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
} from '@mui/material'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import VehicleForm from '../../system_data/_components/vehicle/VehicleForm'
import { apiUrl } from '../../../config-global'
import { useSnackbar } from '../../../components/snackbar'
import axios from '../../../utils/axios'
import Iconify from '../../../components/iconify'
import VehicleAutocomplete from '../../system_data/_components/vehicle/VehicleAutocomplete'

function AddToQueueModal({ task, mutate, bodyTypes, clients }: any) {
    const [open, setOpen] = useState(false)
    const [activeVehilce, setActiveVehilce] = useState<any>(null)
    const [addToQueueLoader, setAddToQueueLoader] = useState(false)
    const [addVehicleModal, setAddVehicleModal] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const initAddVehicle = () => {
        setActiveVehilce(null)
        setAddVehicleModal(true)
    }

    const handleVehicleModalClose = () => {
        setAddVehicleModal(false)
    }
    // const onSubmitVehicle = () => {}

    const onSubmitVehicle = async (payload: any) => {
        try {
            // update record
            const { data } = await axios.post('/vehicle', payload)
            if (data && data.vehicle) {
                mutate()
                enqueueSnackbar('Vehicle added successfully', {
                    variant: 'success',
                })
                setAddVehicleModal(false)
                // setActiveVehilce(data.vehicle)
            }
        } catch (err: any) {
            enqueueSnackbar(err.message || 'Opearation failed', {
                variant: 'error',
            })
        }
    }

    const handleAddToQueue = async () => {
        try {
            const url = `${apiUrl}/waitlist`
            setAddToQueueLoader(true)
            const response = await axios.post(url, {
                vehicleId: activeVehilce.id,
                registration: activeVehilce.registration,
            })
            if (response.status !== 200) {
                throw new Error(
                    `Error adding to queue: ${response?.data?.error}}`
                )
            }
            setOpen(false)
            enqueueSnackbar('Added to queue', { variant: 'success' })
        } catch (err: any) {
            const msg = err.error || err.message || 'Error adding to queue'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setAddToQueueLoader(false)
        }
    }

    return (
        <>
            <Button
                variant="outlined"
                color="info"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => setOpen(true)}
            >
                Add to queue
            </Button>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>Add to queue</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText /> */}
                    <Box display="grid" gap={2} sx={{ p: 2 }}>
                        <VehicleAutocomplete
                            setVehicle={setActiveVehilce}
                            vehicle={activeVehilce}
                            setAddVehicleModal={initAddVehicle}
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Stack
                        direction="row"
                        alignItems="flex-end"
                        gap={2}
                        sx={{ mt: 3 }}
                    >
                        <Button
                            onClick={() => setOpen(false)}
                            variant="contained"
                            color="warning"
                        >
                            Cancel
                        </Button>

                        <LoadingButton
                            variant="contained"
                            onClick={handleAddToQueue}
                            loading={addToQueueLoader}
                        >
                            {' '}
                            Save
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={addVehicleModal}
                onClose={handleVehicleModalClose}
            >
                <DialogTitle>Add vehicle</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText /> */}

                    <VehicleForm
                        onSubmit={onSubmitVehicle}
                        vehicle={activeVehilce}
                        handleClose={handleVehicleModalClose}
                        clients={clients}
                        bodyTypes={bodyTypes}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddToQueueModal
