import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs'
import Iconify from '../../../components/iconify'
import { useSettingsContext } from '../../../components/settings'
import InternalError from '../../../components/shared/500Error'
import snackbar, { useSnackbar } from '../../../components/snackbar'
import useBodyTypes from '../../../hooks/body-types/useBodyTypes'
import { PATH_DASHBOARD } from '../../../routes/paths'
import axios from '../../../utils/axios'
import BodyTypesTable from '../_components/bodytypes/BodyTypesTable'
import BodyTypeForm from '../_components/bodytypes/BodyTypeForm'

function BodyTypesPage() {
    const { bodyTypes, mutate }: any = useBodyTypes()
    const bodyRef = useRef<HTMLInputElement>(null)

    // const navigate = useNavigate()
    const { themeStretch } = useSettingsContext()

    const { enqueueSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)
    const [updateLoader, setUpdateLoader] = useState(false)
    const [createLoader, setCreateLoader] = useState(false)
    const [activeType, setActiveType] = useState<any>(null)

    const handleClose = () => {
        setOpen(false)
        setActiveType(null)
    }

    const handleUpdate = async (data: any) => {
        try {
            setActiveType(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }

    const onSubmit = async (data: any) => {
        try {
            setUpdateLoader(true)
            if (activeType && activeType.id) {
                // update record
                const response = await axios.put(
                    `/body-type/${activeType?.id}`,
                    data
                )

                if (response.data) {
                    mutate()
                    enqueueSnackbar('Body type updated successfully', {
                        variant: 'success',
                    })
                }
            } else {
                // create record
                const response = await axios.post('/body-type', {
                    ...data,
                })

                if (response.data) {
                    mutate()
                    enqueueSnackbar('Body type created successfully', {
                        variant: 'success',
                    })
                }
            }
        } catch (error) {
            enqueueSnackbar('Failed to create user record', {
                variant: 'error',
            })
        } finally {
            setUpdateLoader(false)
            setActiveType(null)
            setOpen(false)
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Vehicle body types"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    // { name: 'St', href: PATH_DASHBOARD.root },
                    {
                        name: 'Vehicle types',
                        href: PATH_DASHBOARD.systemData.bodyTypes,
                    },
                ]}
                action={
                    <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New Type
                    </Button>
                }
            />

            <ErrorBoundary
                fallback={
                    <InternalError error="Page did not load correctly try again" />
                }
            >
                <BodyTypesTable
                    mutate={mutate}
                    handleUpdate={handleUpdate}
                    data={bodyTypes}
                />

                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>Add type</DialogTitle>
                    <DialogContent>
                        <DialogContentText />

                        <BodyTypeForm
                            onSubmit={onSubmit}
                            type={activeType}
                            loading={updateLoader}
                            handleClose={handleClose}
                        />
                    </DialogContent>
                </Dialog>
            </ErrorBoundary>
        </Container>
    )
}

export default BodyTypesPage
