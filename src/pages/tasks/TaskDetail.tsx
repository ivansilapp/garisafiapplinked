import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material'
import { Fragment, Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useNavigate, useParams } from 'react-router-dom'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { useSnackbar } from '../../components/snackbar'
import AttendantAutocomplete from '../../hooks/attendant/AttendantAutocomplete'
import useTask from '../../hooks/task/useTask'
import { PATH_DASHBOARD } from '../../routes/paths'
import { fCurrency } from '../../utils/formatNumber'
import { fDateTime } from '../../utils/formatTime'
import VehicleDetailCard from './_components/VehicleDetail'

function TaskDetail() {
    const { themeStretch } = useSettingsContext()
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [reassignModal, setReassignModal] = useState(false)
    const [cancelModal, setCancelModal] = useState(false)
    const [attendant, setAttendant] = useState<any>(null)

    const { enqueueSnackbar } = useSnackbar()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { task } = useTask({ id })

    const handleReassign = () => {
        try {
            if (!attendant) {
                enqueueSnackbar('Please select an attendant', {
                    variant: 'error',
                })
                return
            }
            if (attendant.id === task.attendantId) {
                enqueueSnackbar('Attendant already assigned to this task', {
                    variant: 'error',
                })
                return
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error reassigning task'
        }
        console.log('Reassigning task to ', attendant.name)
    }

    const handleCancel = () => {
        try {
            console.log('canceling')
        } catch (err: any) {
            const msg = err.error || err.message || 'Error cancelling task'
        }
    }
    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Task detail"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'Tasks',
                        href: PATH_DASHBOARD.tasks.root,
                    },
                    {
                        name: 'Task detail',
                        href: PATH_DASHBOARD.tasks.new,
                    },
                ]}
                action={
                    <Box display="flex" rowGap={2} columnGap={2}>
                        <Button
                            onClick={() => navigate(PATH_DASHBOARD.tasks.new)}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New Task
                        </Button>
                    </Box>
                }
            />

            <ErrorBoundary
                fallback={<InternalError error="Error loading task detail" />}
            >
                <Suspense fallback={<p>Loading...</p>}>
                    <Box rowGap={3} columnGap={2} display="grid">
                        <Stack alignItems="flex-end " sx={{ mt: 3 }}>
                            <Box display="flex" columnGap={2} rowGap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setCancelModal(true)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setReassignModal(true)}
                                >
                                    Re Assign
                                </Button>
                                <Button variant="outlined">
                                    Complete task
                                </Button>
                            </Box>
                        </Stack>
                        <Card>
                            <CardContent>
                                <Box rowGap={3} columnGap={2} display="grid">
                                    <Grid spacing={2} container>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h5">
                                                {fDateTime(
                                                    new Date(task.CreatedAt),
                                                    null
                                                )}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h5">
                                                <b>Total: </b>{' '}
                                                {fCurrency(task?.cost ?? 0)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h5">
                                                <b>
                                                    Attendant:{' '}
                                                    {task?.attendant?.name}{' '}
                                                </b>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h5">
                                                <b>Status: {task?.status} </b>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>

                        <Card>
                            {/* <CardHeader title="Attendant" /> */}
                            <CardContent>
                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                    }}
                                >
                                    {/* <Typography variant="h4">
                                        {task.vehicle.registration}
                                    </Typography>
                                    <Typography variant="h4">
                                        {task.vehicle.registration}
                                    </Typography> */}
                                    <VehicleDetailCard id={task.vehicle.id} />
                                </Box>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                {task.jobs.map((job: any) => {
                                    return (
                                        <Fragment key={job.id}>
                                            {/* <CardHeader title={job.name} /> */}

                                            <Box
                                                rowGap={1}
                                                columnGap={1}
                                                display="grid"
                                                sx={{ my: 3 }}
                                            >
                                                <Typography variant="subtitle1">
                                                    {job.name}
                                                </Typography>

                                                <Typography
                                                    sx={{ px: 2 }}
                                                    variant="subtitle1"
                                                >
                                                    <b>Cost: </b>
                                                    {fCurrency(job.cost)}
                                                </Typography>
                                            </Box>
                                            <Divider />
                                        </Fragment>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </Box>
                    {/* Reassign modal */}
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={reassignModal}
                        onClose={() => setReassignModal(false)}
                    >
                        <DialogTitle>Reasign task</DialogTitle>
                        <DialogContent>
                            <Box sx={{ p: 2 }}>
                                <AttendantAutocomplete
                                    setAttendant={setAttendant}
                                />
                                <Stack alignItems="flex-end" sx={{ my: 3 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleReassign}
                                    >
                                        Save
                                    </Button>
                                </Stack>
                            </Box>
                        </DialogContent>
                    </Dialog>

                    {/* Cancel Modal */}
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={cancelModal}
                        onClose={() => setCancelModal(false)}
                    >
                        <DialogTitle>Cancel task</DialogTitle>
                        <DialogContent>
                            <Box sx={{ p: 2 }}>
                                <p>
                                    Are you sure you want to cancel this task?
                                </p>
                                <Stack
                                    display="flex"
                                    alignItems="flex-end"
                                    gap={2}
                                    sx={{ my: 3 }}
                                >
                                    <Box display="flex" gap={2}>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                setCancelModal(false)
                                            }
                                        >
                                            No
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleCancel}
                                        >
                                            Yes cancel
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>
                        </DialogContent>
                    </Dialog>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default TaskDetail
