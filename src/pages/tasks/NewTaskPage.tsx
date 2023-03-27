/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import * as Yup from 'yup'
import { Box, Button, Card, Container, Stack } from '@mui/material'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { PATH_DASHBOARD } from '../../routes/paths'
import { useSnackbar } from '../../components/snackbar'
import { apiUrl } from '../../config-global'
import axios from '../../utils/axios'
import TaskForm from './_components/TaskForm'
import FormProvider from '../../components/hook-form'
import useServiceList from '../../hooks/service/useServiceList'
import usePrices from '../../hooks/prices/usePrices'
import AttendantAutocomplete from '../../hooks/attendant/AttendantAutocomplete'

const currentInvoice: any = {}

export default function NewTaskPage() {
    const navigate = useNavigate()
    const { themeStretch } = useSettingsContext()
    const { enqueueSnackbar } = useSnackbar()
    const { services } = useServiceList()
    const { prices } = usePrices()

    const [open, setOpen] = useState(false)
    const [vehicleLoader, setVehicleLoader] = useState(false)
    const [vehicles, setVehicles] = useState<any>([])
    const [attendant, setAttendant] = useState<any>(null)
    // const [submitLoader, setSubmitLoader] = useState(false)
    const [vehicle, setVehicle] = useState<any>(null)

    const [searchParams] = useSearchParams()

    const vehicleIdParam = searchParams.get('vehicle_id')

    // const [loadingSave, setLoadingSave] = useState(false)

    // const [loadingSend, setLoadingSend] = useState(false)

    const NewTaskSchema = Yup.object().shape({
        vehicleId: Yup.string(),
    })

    const defaultValues = useMemo(
        () => ({
            status: currentInvoice?.status || 'pending',
            discount: currentInvoice?.discount || 0,
            vehicleId: currentInvoice?.vehicleId || '',
            items: currentInvoice?.items || [
                {
                    service: '',
                    quantity: 1,
                    price: 0,
                    total: 0,
                },
            ],
            totalPrice: currentInvoice?.totalPrice || 0,
        }),
        []
    )

    const methods: any = useForm({
        resolver: yupResolver(NewTaskSchema),
        defaultValues,
    })

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const isEdit = false

    useEffect(() => {
        if (isEdit && currentInvoice) {
            reset(defaultValues)
        }
        if (!isEdit) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentInvoice])

    useEffect(() => {
        if (vehicleIdParam) {
            getVehicle()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleIdParam])

    const fetchVehicles = async (e: any) => {
        try {
            const query = e.target.value
            if (query.length <= 0) {
                return
            }
            setVehicleLoader(true)
            const res = await axios(`${apiUrl}/vehicle/search/${query}`)
            const data = await res.data
            setVehicles(data?.vehicles ?? [])
        } catch (err: any) {
            const msg = err.error || err.message || 'Error loading vehicles'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setVehicleLoader(false)
        }
    }

    async function getVehicle() {
        const res = await axios(`${apiUrl}/vehicle/${vehicleIdParam}`)
        if (res.status === 200) {
            const data = await res.data
            const v = data?.vehicle
            setVehicles([v])
            setVehicle(v ?? null)
        }
    }

    const submitTask = async (payload: any) => {
        try {
            if (!attendant) {
                enqueueSnackbar('Please select an attendant', {
                    variant: 'error',
                })
                return
            }
            if (!vehicle) {
                enqueueSnackbar('Please select a vehicle', {
                    variant: 'error',
                })
                return
            }

            if (payload.items.length <= 0) {
                enqueueSnackbar('Please add at least one service', {
                    variant: 'error',
                })
                return
            }

            const url = `${apiUrl}/task`
            let options = {
                ...payload,
                vehicleId: vehicle.id,
                carKeys: true,
            }

            if (attendant) {
                options = {
                    ...options,
                    deleteWaitlist: !!vehicleIdParam,
                    attendantId: attendant.id,
                }
            }

            const response = await axios.post(url, options)
            const { data } = response
            if (response.status !== 200) {
                throw new Error(data.error)
            }
            // console.log(data, 'data', response.status)
            if (data.task && data.task.id !== 0) {
                navigate(PATH_DASHBOARD.tasks.details(data?.task?.id), {
                    replace: true,
                })
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error creating task'
            // console.log(msg, 'msg')
            enqueueSnackbar(msg, { variant: 'error' })
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
                        {
                            name: 'New tasks',
                            href: PATH_DASHBOARD.tasks.new,
                        },
                    ]}
                    // action={
                    //     <Button
                    //         onClick={() => setOpen(true)}
                    //         variant="contained"
                    //         startIcon={<Iconify icon="eva:plus-fill" />}
                    //     >
                    //         New Task
                    //     </Button>
                    // }
                />

                <Suspense fallback={<p>Loading...</p>}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <Autocomplete
                                id="vehicle-autocomplete"
                                open={open}
                                onOpen={() => {
                                    setOpen(true)
                                }}
                                onClose={() => {
                                    setOpen(false)
                                }}
                                isOptionEqualToValue={(
                                    option: any,
                                    value: any
                                ) => option.registration === value.registration}
                                getOptionLabel={(option) => {
                                    return option?.registration ?? ''
                                }}
                                options={vehicles}
                                loading={vehicleLoader}
                                onChange={(e, value) => {
                                    setVehicle(value)
                                }}
                                value={vehicle ?? null}
                                inputValue={vehicle?.registration ?? ''}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search vehicle"
                                        onChange={fetchVehicles}
                                        // value={vehicle?.registration ?? ''}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {vehicleLoader ? (
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                        />
                                                    ) : null}
                                                    {
                                                        params.InputProps
                                                            .endAdornment
                                                    }
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            <AttendantAutocomplete
                                setAttendant={setAttendant}
                            />
                        </Box>

                        {/* <Stack
                            sx={{ mt: 3 }}
                            spacing={2}
                            direction={{ xs: 'column-reverse', md: 'row' }}
                            alignItems={{ xs: 'flex-center', md: 'center' }}
                        >
                            <Button variant="outlined">Add service</Button>
                        </Stack> */}
                        <FormProvider methods={methods}>
                            <TaskForm
                                services={services}
                                vehicle={vehicle}
                                pricelist={prices}
                            />

                            <Stack
                                justifyContent="flex-end"
                                direction="row"
                                spacing={2}
                                sx={{ mt: 3 }}
                            >
                                {/* <LoadingButton
                                    color="inherit"
                                    size="large"
                                    variant="contained"
                                    loading={loadingSave && isSubmitting}
                                    onClick={handleSubmit(handleCreateAndSend)}
                                >
                                    Save as Draft
                                </LoadingButton> */}

                                <LoadingButton
                                    size="large"
                                    variant="contained"
                                    loading={isSubmitting}
                                    onClick={handleSubmit(submitTask)}
                                >
                                    {isEdit ? 'Update' : 'Create'}
                                </LoadingButton>
                            </Stack>
                        </FormProvider>
                    </Card>

                    {/* <Stack display="flex" alignItems="flex-end" sx={{ mt: 3 }}>
                        <LoadingButton
                            onClick={createTask}
                            loading={submitLoader}
                            variant="contained"
                        >
                            Create task
                        </LoadingButton>
                    </Stack> */}
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}
