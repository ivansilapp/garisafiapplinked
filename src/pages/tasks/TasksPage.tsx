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
import useTaskAnalytics from '../../hooks/task/useTaskAnalytics'
import { PATH_DASHBOARD } from '../../routes/paths'
import axios from '../../utils/axios'
import VehicleAutocomplete from '../system_data/_components/vehicle/VehicleAutocomplete'
import AnalyticsBar from './_components/AnalyticsBar'
import InfoTable from './_components/InfoTable'

function Tasks() {
    const { themeStretch } = useSettingsContext()
    const { enqueueSnackbar } = useSnackbar()
    const { info } = useTaskAnalytics()

    const [open, setOpen] = useState(false)
    const [activeVehilce, setActiveVehilce] = useState<any>(null)
    const [addToQueueLoader, setAddToQueueLoader] = useState(false)

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

                <Suspense fallback={<p>Loading...</p>}>
                    <AnalyticsBar info={info} />
                    <InfoTable info={info} />
                </Suspense>

                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <DialogTitle>Add vehicle</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText /> */}
                        <Box display="grid" gap={2} sx={{ p: 2 }}>
                            <VehicleAutocomplete
                                setVehicle={setActiveVehilce}
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
            </ErrorBoundary>
        </Container>
    )
}

export default Tasks
