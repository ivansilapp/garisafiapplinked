import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { LoadingButton } from '@mui/lab'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { useSnackbar } from '../../components/snackbar'
import useAttendantList from '../../hooks/attendant/useAttendantList'
import { PATH_DASHBOARD } from '../../routes/paths'
import axios from '../../utils/axios'
import AttendantForm from './_components/AttendantForm'
import AttendantsTable from './_components/AttendantsTable'
import { fCurrency } from '../../utils/formatNumber'
import useAccountList from '../../hooks/account/useAccountList'

function AttendantsPage() {
    const { themeStretch } = useSettingsContext()
    const { attendants, mutate } = useAttendantList()
    const { accounts } = useAccountList()
    const [open, setOpen] = useState(false)
    const [payModal, setPayModal] = useState(false)
    const [paymentLoader, setPaymentLoader] = useState(false)
    const [account, setAccount] = useState<any>('')
    const [reference, setReference] = useState<any>('')
    const [hasReference, setHasReference] = useState(false)

    const [activeAttendant, setActiveAttendant] = useState<any>(null)

    const { enqueueSnackbar } = useSnackbar()

    const handleClose = () => {
        setOpen(false)
        setActiveAttendant(null)
    }

    const handleUpdate = async (data: any) => {
        try {
            setActiveAttendant(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }

    const onSubmit = async (payload: any) => {
        try {
            if (activeAttendant && activeAttendant.id) {
                // update record
                const { data } = await axios.put(
                    `/attendant/${activeAttendant.id}`,
                    payload
                )
                if (data) {
                    mutate()
                    enqueueSnackbar('Attendant updated successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveAttendant(null)
                }
            } else {
                // update record
                const { data } = await axios.post('/attendant', payload)
                if (data) {
                    mutate()
                    enqueueSnackbar('Attendant added successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveAttendant(null)
                }
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
                fallback={
                    <InternalError error="Error loading attendants data" />
                }
            >
                <CustomBreadcrumbs
                    heading="Attendants"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'Attendants',
                            href: PATH_DASHBOARD.attendants.root,
                        },
                    ]}
                    action={
                        <Stack direction="row" gap={2}>
                            {/* <Button
                                variant="outlined"
                                startIcon={<Iconify icon="eva:npm-outline" />}
                                onClick={() => setPayModal(true)}
                                color="info"
                                disabled={totalCommision === 0}
                            >
                                Pay all
                            </Button> */}
                            <Button
                                onClick={() => setOpen(true)}
                                variant="contained"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                            >
                                New attendant
                            </Button>
                        </Stack>
                    }
                />

                <AttendantsTable
                    data={attendants}
                    mutate={mutate}
                    handleUpdate={handleUpdate}
                />

                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>Add attendant</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText /> */}

                        <AttendantForm
                            onSubmit={onSubmit}
                            attendant={activeAttendant}
                            handleClose={handleClose}
                        />
                    </DialogContent>
                </Dialog>
            </ErrorBoundary>
        </Container>
    )
}

export default AttendantsPage
