/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
import { LoadingButton } from '@mui/lab'
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
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
// import DeleteIcon from '@mui/icons-material/Delete'

import { useTheme } from '@mui/material/styles'
import { Fragment, Suspense, useEffect, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../components/confirm-dialog'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import { RHFSelect, RHFTextField } from '../../components/hook-form'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { useSnackbar } from '../../components/snackbar'
import { apiUrl } from '../../config-global'
import useAccountList from '../../hooks/account/useAccountList'
import AttendantAutocomplete from '../../hooks/attendant/AttendantAutocomplete'
import usePrices from '../../hooks/prices/usePrices'
import useServiceList from '../../hooks/service/useServiceList'
import useTask from '../../hooks/task/useTask'
import { PATH_DASHBOARD } from '../../routes/paths'
import axios from '../../utils/axios'
import { fCurrency } from '../../utils/formatNumber'
import { fDateTime } from '../../utils/formatTime'
import ProductSaleModal from './_components/ProductSaleModal'
import TaskPaymentCard from './_components/TaskPayment'
import VehicleDetailCard from './_components/VehicleDetail'
import Label from '../../components/label/Label'
import VehicleForm from '../system_data/_components/vehicle/VehicleForm'
import AddToQueueModal from './_components/AddToQueueModal'
import useBodyTypes from '../../hooks/body-types/useBodyTypes'
import useClientList from '../../hooks/client/useClientList'
import { taskStatus } from '../../auth/utils'
import { useAuthContext } from '../../auth/useAuthContext'

function TaskDetail() {
    const { themeStretch } = useSettingsContext()
    const { settings }: any = useAuthContext()

    const { clients } = useClientList()
    const { bodyTypes } = useBodyTypes()

    const theme = useTheme()
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [reassignModal, setReassignModal] = useState(false)
    const [cancelModal, setCancelModal] = useState(false)
    const [attendant, setAttendant] = useState<any>(null)
    const [completeModal, setCompleteModal] = useState(false)
    const [paymentModal, setPaymentModal] = useState(false)
    const [addServiceModal, setAddServiceModal] = useState(false)
    const [addAttendantModal, setAddAttendantModal] = useState(false)
    const [saleModal, setSaleModal] = useState(false)

    const [hasRefrence, setHasRefrence] = useState(false)

    const [cancelLoader, setCancelLoader] = useState(false)
    const [reassignLoader, setReassignLoader] = useState(false)
    const [completeLoader, setCompleteLoader] = useState(false)
    const [paymentLoader, setPaymentLoader] = useState(false)
    const [addServiceLoader, setAddServiceLoader] = useState(false)
    const [closingLoader, setClosingLoader] = useState(false)
    const [saleLoader, setSaleLoader] = useState(false)
    const [redeemLoader, setRedeemLoader] = useState(false)

    const [product, setProduct] = useState<any>(null)
    const [quantity, setQuantity] = useState<any>(1)
    const [account, setAccount] = useState<any>('')
    // const [amount, setAmount] = useState<any>('')
    const [reference, setReference] = useState<any>('')
    const [activeIds, setActiveIds] = useState<any>([])
    const [activeSevice, setActiveService] = useState<any>('')
    const [serviceDeleteLoader, setServiceDeleteLoader] = useState(false)
    const [productDeleteLoader, setProductDeleteLoader] = useState(false)
    const [carpetLength, setCarpetLength] = useState('')
    const [carpetWidth, setCarpetWidth] = useState('')

    const [confirmRemoveServiceModal, setConfirmRemoveServiceModal] =
        useState(false)

    const [removeServiceId, setRemoveServiceId] = useState<any>(null)
    const [removeProductId, setRemoveProductId] = useState<any>(null)

    const [confirmRemoveAttendantModal, setConfirmRemoveAttendantModal] =
        useState(false)
    const [confirmRemoveProductModal, setConfirmRemoveProductModal] =
        useState(false)

    const [removeAttendantId, setRemoveAttendantId] = useState<any>(null)

    const [isCarpetCleaning, setIsCarpetCleaning] = useState(false)

    const { enqueueSnackbar } = useSnackbar()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { task, mutate }: any = useTask({ id })
    const { accounts } = useAccountList()
    const { services } = useServiceList()
    const { prices } = usePrices()

    const activeClient = useMemo(() => {
        const cl = clients.find((c: any) => c.id === task?.vehicle?.clientId)
        // console.log(cl, 'is the client', clients.length)
        return cl
    }, [task, clients])

    const taskTotals: number = useMemo(() => {
        if (!task) return 0
        const totalPaid = task?.payments?.reduce(
            (acc: any, payment: any) =>
                payment?.type === 'task_cancellation'
                    ? acc
                    : acc + payment.amount,
            0
        )
        const salesCost = task?.sales[0] ? task.sales[0].amount : 0
        const due = salesCost + (task?.cost ?? 0) - totalPaid
        return due
    }, [task])

    const [amount, setAmount] = useState<any>(taskTotals)

    const handleReassign = async () => {
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
            setReassignLoader(true)
            const response = await axios.put(`/task/${task.id}`, {
                attendantId: attendant.id,
            })

            // const { data } = response
            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Task reassigned successfully', {
                    variant: 'success',
                })
                setReassignModal(false)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error reassigning task'
            console.log(msg)
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setReassignLoader(false)
        }
    }

    const handleAddAttendant = async () => {
        try {
            if (!attendant) {
                enqueueSnackbar('Please select an attendant', {
                    variant: 'error',
                })
                return
            }

            // check if the task.attendants has 2 attendants return
            if (task.attendants.length === 2) {
                enqueueSnackbar('Task already has 2 attendants', {
                    variant: 'error',
                })
                return
            }

            const attendantIds = task.attendants.map(
                (taskAttendant: any) => taskAttendant.attendant.id
            )
            if (attendantIds.includes(attendant.id)) {
                enqueueSnackbar('Attendant already assigned to this task', {
                    variant: 'error',
                })
                return
            }
            setReassignLoader(true)
            const response = await axios.put(`/task/attendant/add`, {
                attendantId: attendant.id,
                taskId: task.id,
            })

            // const { data } = response
            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Attendant added successfully', {
                    variant: 'success',
                })
                setAddAttendantModal(false)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error reassigning task'
            // console.log(msg)
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setReassignLoader(false)
        }
    }

    const handleCancel = async () => {
        try {
            setCancelLoader(true)
            const response = await axios.put(`/task/${task.id}`, {
                status: taskStatus.cancelled,
            })

            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Task  cancelled', {
                    variant: 'success',
                })
                setCancelModal(false)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error cancelling task'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setCancelLoader(false)
        }
    }

    const handleComplete = async () => {
        try {
            setCompleteLoader(true)
            const response = await axios.put(`/task/${task.id}`, {
                status: 'complete',
            })

            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Marked as complete', {
                    variant: 'success',
                })
                setCompleteModal(false)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error completing task'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setCompleteLoader(false)
        }
    }

    const handleAccountChange = (e: SelectChangeEvent) => {
        setAccount(e.target.value)
        const ac = accounts.find((a: any) => a.id === e.target.value)
        // console.log(ac, 'is the account')
        setHasRefrence(ac?.name?.toLowerCase()?.includes('cash'))
    }

    const handleAmountChange = (e: any) => {
        const val = e.target.value
        if (isNaN(val)) return
        setAmount(val)
    }

    useEffect(() => {
        setActiveIds(task?.jobs.map((s: any) => s.serviceId))
    }, [services, task?.jobs])

    const handleAddPayment = async () => {
        try {
            if (!account) {
                enqueueSnackbar('Please select an account', {
                    variant: 'error',
                })
                return
            }
            if (!amount) {
                enqueueSnackbar('Please enter an amount', {
                    variant: 'error',
                })
                return
            }
            if (isNaN(amount)) {
                enqueueSnackbar('Please enter a valid amount', {
                    variant: 'error',
                })
                return
            }
            // check if account is mpesa and has refrence
            if (!hasRefrence && reference === '') {
                enqueueSnackbar('Please enter a refrence', {
                    variant: 'error',
                })
                return
            }

            setPaymentLoader(true)
            const payload = {
                amount: Number(amount) ?? 0,
                accountId: account,
                reference,
                taskId: task.id,
                saleId: 1,
            }
            // console.log(payload)
            const response = await axios.post(`${apiUrl}/payment`, payload)

            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Payment added successfully', {
                    variant: 'success',
                })
                setPaymentModal(false)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error adding payment'
            console.log(msg)
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setPaymentLoader(false)
        }
    }

    const handleAddService = async () => {
        try {
            setAddServiceLoader(true)
            if (!activeSevice) {
                enqueueSnackbar('Please select a service', {
                    variant: 'error',
                })
                return
            }
            let priceId = 0
            const servicePayload: any = {}
            if (!isCarpetCleaning) {
                priceId = prices.find(
                    (p: any) =>
                        p.serviceId === activeSevice &&
                        p.bodyId === task?.vehicle?.bodyId
                )?.id
                // console.log('price id', priceId)
                // const response = {}
                // // add service
                if (!priceId) {
                    enqueueSnackbar(
                        'Price not found. Confirm its correctly configured',
                        {
                            variant: 'error',
                        }
                    )
                    return
                }
            } else {
                // check carpetLength & carpetWidth
                const length = Number(carpetLength) || 0
                const width = Number(carpetWidth) || 0

                if (!length || !width) {
                    enqueueSnackbar('Carpet length and width required', {
                        variant: 'error',
                    })
                    return
                }

                servicePayload.length = length
                servicePayload.width = width
            }
            // console.log({ activeService, id, priceId })
            const response = await axios.post(
                `${apiUrl}/task/service-add/${activeSevice}/${id}/${priceId}`,
                { ...servicePayload }
            )

            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Service added successfully', {
                    variant: 'success',
                })
                setAddServiceModal(false)
                setCarpetLength('')
                setCarpetWidth('')
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error adding service'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setAddServiceLoader(false)
        }
    }

    const handleRemoveService = async (itemId: any) => {
        try {
            if (removeServiceId === '') {
                enqueueSnackbar('Failed to delete service', {})
                return
            }
            setServiceDeleteLoader(true)
            const response = await axios.delete(
                `${apiUrl}/task/service-remove/${removeServiceId}/${id}`
            )
            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Service removed successfully', {
                    variant: 'success',
                })
                setConfirmRemoveServiceModal(false)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error removing service'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setServiceDeleteLoader(false)
        }
    }
    const handleRemoveAttendant = async () => {
        try {
            const attendantId = removeAttendantId
            if (attendantId === 0) {
                enqueueSnackbar('Failed to remove attendant', {})
                return
            }
            setServiceDeleteLoader(true)
            const response = await axios.put(
                `${apiUrl}/task/attendant/remove`,
                {
                    attendantId: Number(attendantId),
                    taskId: Number(id),
                }
            )
            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Attendant removed successfully', {
                    variant: 'success',
                })
                setConfirmRemoveAttendantModal(false)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error removing attendant'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setServiceDeleteLoader(false)
        }
    }

    const closeTask = async () => {
        try {
            setClosingLoader(true)
            const url =
                task.status === taskStatus.ongoing
                    ? `${apiUrl}/tasks/release-pigeonhole`
                    : `${apiUrl}/task/close/${task.id}`
            const response = await axios.put(url, {
                id: `${task.id}`,
            })
            if (response.status === 200) {
                task.closed = true
                mutate()
                enqueueSnackbar('Task closed successfully', {
                    variant: 'success',
                })

                navigate('/tasks')
            } else {
                enqueueSnackbar('Error closing task', {
                    variant: 'error',
                })
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error closing task'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setClosingLoader(false)
        }
    }

    const handleSale = async () => {
        if (isNaN(quantity) || Number(quantity) === 0) {
            enqueueSnackbar('Please enter a valid quantity', {
                variant: 'error',
            })
            return
        }
        try {
            setSaleLoader(true)
            if (task.sales.length > 0) {
                // add product to sale
                const saleId = task.sales[0].id

                const payload = {
                    saleId,
                    quantity: Number(quantity) ?? 0,
                    productId: product.id,
                }
                const url = `${apiUrl}/sales/add-product`
                const response = await axios.put(url, payload)

                if (response.status === 200) {
                    mutate()
                    enqueueSnackbar('Product added to sale successfully', {
                        variant: 'success',
                    })
                    setSaleModal(false)
                } else {
                    const { data } = response
                    throw new Error(data.error)
                }
            } else {
                // create sale
                const url = `${apiUrl}/sales`
                const payload = {
                    taskId: task.id,

                    vehicleId: task.vehicle.id,
                    saleProducts: [
                        {
                            productId: product.id,
                            quantity: Number(quantity) ?? 0,
                            amount: product.price * Number(quantity) ?? 0,
                        },
                    ],
                }

                const response = await axios.post(url, payload)
                if (response.status === 200) {
                    mutate()
                    enqueueSnackbar('Product added to sale successfully', {
                        variant: 'success',
                    })
                    setSaleModal(false)
                } else {
                    const { data } = response
                    throw new Error(data.error)
                }
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error creating sale'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setSaleLoader(false)
        }
    }

    const handleRemoveSaleProduct = async () => {
        try {
            setProductDeleteLoader(true)
            const url = `${apiUrl}/sales/remove-product`
            const sale = task?.sales[0]

            if (!sale) {
                throw new Error('Invalid sale detail')
            }

            if (removeProductId === 0) {
                throw new Error('Invalid product detail')
            }

            const response = await axios.put(url, {
                saleId: sale.id,
                productId: removeProductId,
            })

            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Product removed from sale', {
                    variant: 'success',
                })
                setConfirmRemoveProductModal(false)
            } else {
                const { data } = response
                throw new Error(data.error ?? 'Error removing product')
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error removing product'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setProductDeleteLoader(false)
        }
    }

    const salesCost = task?.sales[0] ? task.sales[0].amount : 0
    const serviceCost = task?.cost ?? 0

    const handleRedeem = async () => {
        try {
            setRedeemLoader(true)
            const url = `${apiUrl}/payment/redeem`

            const payload = {
                taskId: task.id,
            }

            const reponse = await axios.put(url, payload)

            if (reponse.status === 200) {
                mutate()
                enqueueSnackbar('Task redeemed successfully', {
                    variant: 'success',
                })
            } else {
                const { data } = reponse
                throw new Error(data.error ?? 'Error redeeming task')
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error redeeming task'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setRedeemLoader(false)
        }
    }

    // console.log('task', task)
    const payViaMpesa = async () => {
        try {
            setRedeemLoader(true)
            const url = `${apiUrl}/mpesa-pay`

            const payload = {
                taskId: task.id,
                amount,
                phone_number: activeClient?.phone,
            }

            // console.log('payload', payload, activeClient)

            const response = await axios.post(url, payload)

            if (response.status === 200) {
                mutate()
                enqueueSnackbar('Task redeemed successfully', {
                    variant: 'success',
                })
            } else {
                const { data } = response
                throw new Error(data.error ?? 'Error redeeming task')
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error redeeming task'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setRedeemLoader(false)
        }
    }

    // const handleSizeChange = () => {
    //     console.log('not implemented')
    // }

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
                        <AddToQueueModal
                            task={task}
                            mutate={mutate}
                            bodyTypes={bodyTypes}
                            clients={clients}
                        />
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
                                {task.status === 'complete' ||
                                    task.status === taskStatus.ongoing ? (
                                    <LoadingButton
                                        loading={closingLoader}
                                        onClick={closeTask}
                                        variant="contained"
                                        disabled={
                                            task.closed || task.pigeonhole === 0
                                        }
                                    >
                                        Issue key
                                    </LoadingButton>
                                ) : null}

                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => setCancelModal(true)}
                                    disabled={task.status === 'cancelled'}
                                >
                                    {task.status === 'cancelled'
                                        ? 'Cancelled'
                                        : 'Cancel'}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setSaleModal(true)}
                                    disabled={
                                        task.status === 'cancelled' ||
                                        task.payments.length > 0
                                    }
                                >
                                    Add product
                                </Button>
                                {/* <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setReassignModal(true)}
                                    disabled={
                                        task.status === 'cancelled' ||
                                        task.status === 'complete'
                                    }
                                >
                                    Re Assign
                                </Button> */}

                                <Button
                                    variant="outlined"
                                    onClick={() => setCompleteModal(true)}
                                    disabled={
                                        task.status === 'cancelled' ||
                                        task.status === 'complete'
                                    }
                                >
                                    Complete task
                                </Button>
                                {task.status === 'complete' ? (
                                    task?.vehicle?.points?.points === 9 &&
                                        !task.isRedeemed ? (
                                        <LoadingButton
                                            loading={redeemLoader}
                                            color="info"
                                            variant="contained"
                                            disabled={task.fullyPaid}
                                            onClick={handleRedeem}
                                        >
                                            Redeem points
                                        </LoadingButton>
                                    ) : (
                                        <>
                                            <Button
                                                color="info"
                                                variant="contained"
                                                disabled={task.fullyPaid}
                                                onClick={() =>
                                                    setPaymentModal(true)
                                                }
                                            >
                                                {task.fullyPaid
                                                    ? 'Fully Paid'
                                                    : 'Add Payment '}
                                            </Button>
                                            <Button onClick={payViaMpesa}>
                                                Pay via mpesa
                                            </Button>
                                        </>
                                    )
                                ) : null}
                            </Box>
                        </Stack>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Box
                                            rowGap={3}
                                            columnGap={2}
                                            display="grid"
                                        >
                                            <Grid spacing={2} container>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography variant="h5">
                                                        {fDateTime(
                                                            new Date(
                                                                task.CreatedAt
                                                            ),
                                                            null
                                                        )}
                                                    </Typography>
                                                </Grid>
                                                {task.pigeonhole !== 0 ? (
                                                    <Grid item xs={12} sm={4}>
                                                        <Typography variant="h5">
                                                            <b>Key Number: </b>{' '}
                                                            <Label
                                                                sx={{
                                                                    fontSize:
                                                                        '18px',
                                                                }}
                                                                color="error"
                                                            >
                                                                {task?.pigeonhole ??
                                                                    ''}
                                                            </Label>
                                                        </Typography>
                                                    </Grid>
                                                ) : null}

                                                <Grid item xs={12} sm={4}>
                                                    <Typography variant="h5">
                                                        <b>
                                                            Status:{' '}
                                                            <Label
                                                                color={
                                                                    (task.status ===
                                                                        'complete' &&
                                                                        'success') ||
                                                                    (task.status ===
                                                                        'cancelled' &&
                                                                        'error') ||
                                                                    (task.status ===
                                                                        'pending' &&
                                                                        'warning') ||
                                                                    (task.status ===
                                                                        'ongoing' &&
                                                                        'info')
                                                                }
                                                            >
                                                                {task?.status}
                                                            </Label>
                                                        </b>
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12} sm={4}>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            <b>
                                                                Service cost:{' '}
                                                            </b>{' '}
                                                            {fCurrency(
                                                                serviceCost
                                                            )}
                                                        </Typography>

                                                        <Typography variant="subtitle2">
                                                            <b>
                                                                Sales total:{' '}
                                                                {fCurrency(
                                                                    salesCost
                                                                )}
                                                            </b>
                                                        </Typography>

                                                        <Typography
                                                            color="primary"
                                                            variant="h6"
                                                        >
                                                            <b> Total: </b>
                                                            {fCurrency(
                                                                serviceCost +
                                                                salesCost
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12} sm={4}>
                                                    <Typography variant="h5" />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography variant="h6">
                                                        <b>
                                                            Car Keys:{' '}
                                                            {task?.carKeys
                                                                ? 'Yes'
                                                                : 'No'}
                                                            {task?.closed ? (
                                                                <small>
                                                                    {
                                                                        ' (submitted)'
                                                                    }
                                                                </small>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </b>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TaskPaymentCard
                                    payments={task.payments}
                                    task={task}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
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
                                            {task.vehicle ? (
                                                <VehicleDetailCard
                                                    id={task?.vehicle?.id}
                                                />
                                            ) : (
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h4">
                                                            Vehicle not found{' '}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Card>
                                    <CardContent>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                        >
                                            <Typography variant="h4">
                                                Services
                                            </Typography>

                                            <Box>
                                                <Button
                                                    onClick={() =>
                                                        setAddServiceModal(true)
                                                    }
                                                    color="info"
                                                    variant="outlined"
                                                    disabled={
                                                        task.status ===
                                                        'cancelled' ||
                                                        task.fullyPaid
                                                    }
                                                >
                                                    Add service
                                                </Button>
                                            </Box>
                                        </Box>
                                        <List>
                                            {task.jobs.map((job: any) => {
                                                return (
                                                    <ListItem
                                                        key={job.id}
                                                        secondaryAction={
                                                            <IconButton
                                                                disabled={
                                                                    task.status ===
                                                                    'cancelled' ||
                                                                    task.fullyPaid
                                                                }
                                                                color="warning"
                                                                edge="end"
                                                                aria-label="delete"
                                                                onClick={() => {
                                                                    setConfirmRemoveServiceModal(
                                                                        true
                                                                    )
                                                                    setRemoveServiceId(
                                                                        job.id
                                                                    )
                                                                }}
                                                            >
                                                                <Iconify icon="eva:trash-fill" />{' '}
                                                            </IconButton>
                                                        }
                                                    >
                                                        <ListItemText
                                                            primary={job.name}
                                                            secondary={` ${job?.description ??
                                                                ''
                                                                }  ${fCurrency(
                                                                    job.cost
                                                                )}`}
                                                        />
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Card>
                                    <CardContent>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                        >
                                            <Typography variant="h4">
                                                Attendants
                                            </Typography>

                                            <Box>
                                                <Button
                                                    onClick={() =>
                                                        setAddAttendantModal(
                                                            true
                                                        )
                                                    }
                                                    color="primary"
                                                    variant="outlined"
                                                    disabled={
                                                        task.status ===
                                                        'cancelled' ||
                                                        task.fullyPaid
                                                    }
                                                >
                                                    Add attendant
                                                </Button>
                                            </Box>
                                        </Box>
                                        <List>
                                            {task?.attendants?.map(
                                                (taskAttendant: any) => {
                                                    return (
                                                        <ListItem
                                                            key={
                                                                taskAttendant.id
                                                            }
                                                            secondaryAction={
                                                                <IconButton
                                                                    disabled={
                                                                        task.status ===
                                                                        'cancelled' ||
                                                                        task.fullyPaid
                                                                    }
                                                                    edge="end"
                                                                    color="warning"
                                                                    aria-label="delete"
                                                                    onClick={() => {
                                                                        setRemoveAttendantId(
                                                                            taskAttendant
                                                                                .attendant
                                                                                .id
                                                                        )
                                                                        setConfirmRemoveAttendantModal(
                                                                            true
                                                                        )
                                                                    }}
                                                                >
                                                                    <Iconify icon="eva:trash-fill" />{' '}
                                                                </IconButton>
                                                            }
                                                        >
                                                            <ListItemText>
                                                                <Button
                                                                    component={
                                                                        Link
                                                                    }
                                                                    to={PATH_DASHBOARD.attendants.details(
                                                                        taskAttendant
                                                                            .attendant
                                                                            .id
                                                                    )}
                                                                >
                                                                    {
                                                                        taskAttendant
                                                                            .attendant
                                                                            .name
                                                                    }
                                                                </Button>
                                                            </ListItemText>
                                                        </ListItem>
                                                    )
                                                }
                                            )}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Card>
                                    <CardContent>
                                        <Box>
                                            <Typography variant="h4">
                                                Sale items
                                            </Typography>
                                        </Box>

                                        <List>
                                            {task.sales.length > 0 &&
                                                task?.sales[0]?.products?.map(
                                                    (item: any) => {
                                                        return (
                                                            <ListItem
                                                                key={item.id}
                                                                secondaryAction={
                                                                    <IconButton
                                                                        disabled={
                                                                            task.status ===
                                                                            'cancelled' ||
                                                                            task.fullyPaid
                                                                        }
                                                                        edge="end"
                                                                        color="warning"
                                                                        aria-label="delete"
                                                                        onClick={() => {
                                                                            setRemoveProductId(
                                                                                item
                                                                                    ?.product
                                                                                    ?.id
                                                                            )
                                                                            setConfirmRemoveProductModal(
                                                                                true
                                                                            )
                                                                        }}
                                                                    >
                                                                        <Iconify icon="eva:trash-fill" />{' '}
                                                                    </IconButton>
                                                                }
                                                            >
                                                                <ListItemText
                                                                    primary={
                                                                        item
                                                                            ?.product
                                                                            ?.name
                                                                    }
                                                                    secondary={`Quantity: ${item.quantity
                                                                        } @ ${fCurrency(
                                                                            item.price
                                                                        )}`}
                                                                />
                                                            </ListItem>
                                                        )
                                                    }
                                                )}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                    {/* prouduct sale modal */}
                    <ProductSaleModal
                        open={saleModal}
                        handleClose={() => setSaleModal(false)}
                        loading={saleLoader}
                        handleSubmit={handleSale}
                        setProduct={setProduct}
                        vehicleReg={task?.vehicle?.registration}
                        quantity={quantity}
                        setQuantity={setQuantity}
                    />
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
                                    <Box gap={2} display="flex">
                                        <Button
                                            color="warning"
                                            variant="contained"
                                            onClick={() =>
                                                setReassignModal(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <LoadingButton
                                            loading={reassignLoader}
                                            variant="contained"
                                            onClick={handleReassign}
                                        >
                                            Re assign
                                        </LoadingButton>
                                    </Box>
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
                                            variant="outlined"
                                            onClick={() =>
                                                setCancelModal(false)
                                            }
                                        >
                                            No
                                        </Button>
                                        <LoadingButton
                                            loading={cancelLoader}
                                            color="warning"
                                            variant="contained"
                                            onClick={handleCancel}
                                        >
                                            Yes cancel
                                        </LoadingButton>
                                    </Box>
                                </Stack>
                            </Box>
                        </DialogContent>
                    </Dialog>

                    {/* Complete Modal */}
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={completeModal}
                        onClose={() => setCompleteModal(false)}
                    >
                        <DialogTitle>Mark completed</DialogTitle>
                        <DialogContent>
                            <Box sx={{ p: 2 }}>
                                <Stack
                                    display="flex"
                                    alignItems="flex-end"
                                    gap={2}
                                    sx={{ my: 3 }}
                                >
                                    <Box display="flex" gap={2}>
                                        <Button
                                            color="warning"
                                            variant="contained"
                                            onClick={() =>
                                                setCompleteModal(false)
                                            }
                                        >
                                            Cancel
                                        </Button>

                                        <LoadingButton
                                            loading={completeLoader}
                                            variant="contained"
                                            onClick={handleComplete}
                                        >
                                            Complete
                                        </LoadingButton>
                                    </Box>
                                </Stack>
                            </Box>
                        </DialogContent>
                    </Dialog>

                    {/* Complete payment */}
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={paymentModal}
                        onClose={() => {
                            setPaymentModal(false)
                            setAmount(taskTotals ?? '')
                        }}
                    >
                        <DialogTitle>Add payment</DialogTitle>
                        <DialogContent>
                            <Box sx={{ p: 2 }} gap={2} display="grid">
                                <FormControl fullWidth>
                                    <InputLabel id="account-selection-label">
                                        Account
                                    </InputLabel>
                                    <Select
                                        labelId="account-selection-label"
                                        id="account-selection"
                                        value={account}
                                        label="Account"
                                        onChange={handleAccountChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {accounts.map((ac: any) => {
                                            return (
                                                <MenuItem
                                                    key={ac.id}
                                                    value={ac.id}
                                                >
                                                    {ac.name}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    id="amount-txt"
                                    label="Amount"
                                    type="number"
                                    variant="outlined"
                                    value={amount}
                                    onChange={handleAmountChange}
                                />
                                <TextField
                                    fullWidth
                                    id="reference-txt"
                                    label="Payment reference"
                                    variant="outlined"
                                    value={reference}
                                    disabled={hasRefrence}
                                    onChange={(e) => {
                                        setReference(e.target.value)
                                    }}
                                />

                                <Stack
                                    display="flex"
                                    alignItems="flex-end"
                                    gap={2}
                                    sx={{ my: 3 }}
                                >
                                    <Box display="flex" gap={2}>
                                        <Button
                                            color="warning"
                                            variant="contained"
                                            onClick={() => {
                                                setReference('')
                                                setAmount(taskTotals ?? '')
                                                setAccount('')
                                                setPaymentModal(false)
                                            }}
                                        >
                                            Cancel
                                        </Button>

                                        <LoadingButton
                                            loading={paymentLoader}
                                            variant="contained"
                                            onClick={handleAddPayment}
                                        >
                                            Add payment
                                        </LoadingButton>
                                    </Box>
                                </Stack>
                            </Box>
                        </DialogContent>
                    </Dialog>

                    {/* Add service Modal */}
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={addServiceModal}
                        onClose={() => {
                            setAddServiceModal(false)
                        }}
                    >
                        <DialogTitle>Add service</DialogTitle>
                        <DialogContent>
                            <Box sx={{ p: 2 }} gap={2} display="grid">
                                <FormControl fullWidth>
                                    <InputLabel id="services-label">
                                        Services
                                    </InputLabel>
                                    <Select
                                        labelId="services-label"
                                        id="services-selection"
                                        value={activeSevice}
                                        label="Service"
                                        onChange={(e) => {
                                            const { value } = e.target
                                            setActiveService(value)
                                            const service: any = services.find(
                                                (s: any) =>
                                                    s.id === Number(value) || 0
                                            )
                                            // console.log(service, 'service')
                                            if (
                                                service &&
                                                service.name
                                                    ?.toLowerCase()
                                                    .includes('carpet')
                                            ) {
                                                setIsCarpetCleaning(true)
                                            } else {
                                                setIsCarpetCleaning(false)
                                            }
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {services.map((service: any) => {
                                            return (
                                                <MenuItem
                                                    key={service.id}
                                                    value={service.id}
                                                    disabled={activeIds.includes(
                                                        service?.id
                                                    )}
                                                >
                                                    {service.name}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                    {/* <FormHelperText>
                                        Choose the account client is paying with
                                    </FormHelperText> */}
                                </FormControl>

                                {isCarpetCleaning ? (
                                    <Stack
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        gap={2}
                                        sx={{ my: 3 }}
                                    >
                                        <TextField
                                            size="small"
                                            type="number"
                                            name="height"
                                            label="Length"
                                            placeholder="0"
                                            value={carpetLength}
                                            onChange={(event: any) =>
                                                setCarpetLength(
                                                    event.target.value
                                                )
                                            }
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ maxWidth: { md: 96 } }}
                                        />
                                        <TextField
                                            size="small"
                                            type="number"
                                            name="width"
                                            label="Width"
                                            value={carpetWidth}
                                            placeholder="0"
                                            onChange={(event: any) =>
                                                setCarpetWidth(
                                                    event.target.value
                                                )
                                            }
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ maxWidth: { md: 96 } }}
                                        />
                                        <TextField
                                            sx={{ maxWidth: { md: 96 } }}
                                            size="small"
                                            disabled
                                            label="Size"
                                            type="number"
                                            value={
                                                Number(carpetWidth) *
                                                Number(carpetLength)
                                            }
                                        />

                                        <div>
                                            {fCurrency(
                                                Number(carpetWidth) *
                                                Number(carpetLength) *
                                                (settings?.carpet ?? 30)
                                            )}
                                        </div>
                                    </Stack>
                                ) : null}

                                <Stack
                                    display="flex"
                                    alignItems="flex-end"
                                    gap={2}
                                    sx={{ my: 3 }}
                                >
                                    <Box display="flex" gap={2}>
                                        <Button
                                            color="warning"
                                            variant="contained"
                                            onClick={() =>
                                                setAddServiceModal(false)
                                            }
                                        >
                                            Cancel
                                        </Button>

                                        <LoadingButton
                                            loading={addServiceLoader}
                                            variant="contained"
                                            onClick={handleAddService}
                                        >
                                            Add service
                                        </LoadingButton>
                                    </Box>
                                </Stack>
                            </Box>
                        </DialogContent>
                    </Dialog>

                    {/* Add attendant  modal */}
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={addAttendantModal}
                        onClose={() => {
                            setAddAttendantModal(false)
                        }}
                    >
                        <DialogTitle>Add attendant</DialogTitle>
                        <DialogContent>
                            <Box sx={{ p: 2 }} gap={2} display="grid">
                                <AttendantAutocomplete
                                    setAttendant={setAttendant}
                                    reset
                                />

                                <Stack
                                    display="flex"
                                    alignItems="flex-end"
                                    gap={2}
                                    sx={{ my: 3 }}
                                >
                                    <Box display="flex" gap={2}>
                                        <Button
                                            color="warning"
                                            variant="contained"
                                            onClick={() =>
                                                setAddAttendantModal(false)
                                            }
                                        >
                                            Cancel
                                        </Button>

                                        <LoadingButton
                                            loading={reassignLoader}
                                            variant="contained"
                                            onClick={handleAddAttendant}
                                        >
                                            Add attendant
                                        </LoadingButton>
                                    </Box>
                                </Stack>
                            </Box>
                        </DialogContent>
                    </Dialog>

                    <ConfirmDialog
                        open={confirmRemoveServiceModal}
                        onClose={() => {
                            setConfirmRemoveServiceModal(false)
                            setRemoveServiceId('')
                        }}
                        title="Remove service"
                        content="Are you sure want to remove service?"
                        action={
                            <LoadingButton
                                variant="contained"
                                color="error"
                                onClick={handleRemoveService}
                                loading={serviceDeleteLoader}
                            >
                                Remove
                            </LoadingButton>
                        }
                    />
                    <ConfirmDialog
                        open={confirmRemoveAttendantModal}
                        onClose={() => {
                            setConfirmRemoveAttendantModal(false)
                            setRemoveAttendantId(0)
                        }}
                        title="Remove attendant"
                        content="Are you sure want to remove attendant?"
                        action={
                            <LoadingButton
                                variant="contained"
                                color="error"
                                onClick={handleRemoveAttendant}
                                loading={serviceDeleteLoader}
                            >
                                Remove
                            </LoadingButton>
                        }
                    />
                    <ConfirmDialog
                        open={confirmRemoveProductModal}
                        onClose={() => {
                            setConfirmRemoveProductModal(false)
                            setRemoveProductId(0)
                        }}
                        title="Remove Product"
                        content="Are you sure want to remove this sale item?"
                        action={
                            <LoadingButton
                                variant="contained"
                                color="error"
                                onClick={handleRemoveSaleProduct}
                                loading={productDeleteLoader}
                            >
                                Remove
                            </LoadingButton>
                        }
                    />
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default TaskDetail
