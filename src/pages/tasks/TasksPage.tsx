import { LoadingButton } from '@mui/lab'
import {
    Button,
    Container,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Tabs,
    Tab,
    Card,
    Divider,
} from '@mui/material'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router-dom'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import Label from '../../components/label'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { useSnackbar } from '../../components/snackbar'
import { apiUrl } from '../../config-global'
import useBodyTypes from '../../hooks/body-types/useBodyTypes'
import useClientList from '../../hooks/client/useClientList'
import useTaskAnalytics from '../../hooks/task/useTaskAnalytics'
import { PATH_DASHBOARD } from '../../routes/paths'
import axios from '../../utils/axios'
import VehicleAutocomplete from '../system_data/_components/vehicle/VehicleAutocomplete'
import VehicleForm from '../system_data/_components/vehicle/VehicleForm'
import AnalyticsBar from './_components/AnalyticsBar'
import InfoTable from './_components/InfoTable'
import useUnpaidTasks from '../../hooks/task/useUnpaidTasks'

function Tasks() {
    const { themeStretch } = useSettingsContext()
    const { enqueueSnackbar } = useSnackbar()
    const { info, mutate } = useTaskAnalytics()
    const { clients } = useClientList()
    const { bodyTypes } = useBodyTypes()
    const overdueData = useUnpaidTasks()

    const [open, setOpen] = useState(false)
    const [activeVehilce, setActiveVehilce] = useState<any>(null)
    const [addToQueueLoader, setAddToQueueLoader] = useState(false)
    const [addVehicleModal, setAddVehicleModal] = useState(false)
    // const [submitVehicleLoader, setSubmitVehicleLoader] = useState(false)

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
            mutate()
            enqueueSnackbar('Added to queue', { variant: 'success' })
        } catch (err: any) {
            const msg = err.error || err.message || 'Error adding to queue'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setAddToQueueLoader(false)
        }
    }

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

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <ErrorBoundary
                fallback={<InternalError error="Error loading tasks" />}
            >
                <CustomBreadcrumbs
                    heading="Tasks"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'tasks',
                            href: PATH_DASHBOARD.tasks.root,
                        },
                    ]}
                    action={
                        <Box display="flex" gap={2}>
                            <Button
                                variant="outlined"
                                color="info"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                                onClick={() => setOpen(true)}
                            >
                                Add to queue
                            </Button>

                            <Button
                                component={Link}
                                to={PATH_DASHBOARD.tasks.new}
                                variant="contained"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                            >
                                New Task
                            </Button>
                        </Box>
                    }
                />

                {/* <Box sx={{ mt: 3 }}>
                    <Button variant="outlined"> Add vehicle </Button>
                </Box> */}

                <Suspense fallback={<p>Loading...</p>}>
                    <AnalyticsBar info={info} />
                </Suspense>

                <Suspense fallback={<p>Loading...</p>}>
                    <InfoTable
                        mutate={mutate}
                        info={info}
                        overdue={overdueData?.tasks ?? []}
                    />
                </Suspense>

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
                                Save{' '}
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
                    <Suspense fallback={<p>Loading...</p>}>
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
                    </Suspense>
                </Dialog>
            </ErrorBoundary>
        </Container>
    )
}

export default Tasks
