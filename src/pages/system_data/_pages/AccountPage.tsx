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
import useAccountList from '../../../hooks/account/useAccountList'
import useBodyTypes from '../../../hooks/body-types/useBodyTypes'
import useClientList from '../../../hooks/client/useClientList'
import useVehicleList from '../../../hooks/vehicle/useVehicleList'
import { PATH_DASHBOARD } from '../../../routes/paths'
import axios from '../../../utils/axios'
import AccountForm from '../_components/accounts/AccountForm'
import AccountsTable from '../_components/accounts/AccountsTable'
import VehicleForm from '../_components/vehicle/VehicleForm'
import VehicleTable from '../_components/vehicle/VehicleTable'

function AccountsPage() {
    const { themeStretch } = useSettingsContext()

    const { accounts, mutate } = useAccountList()
    const { bodyTypes } = useBodyTypes()

    const { clients } = useClientList()

    const { enqueueSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)
    const [updateLoader, setUpdateLoader] = useState(false)
    const [activeAccount, setActiveAccount] = useState<any>(null)

    const handleClose = () => {
        setOpen(false)
        setActiveAccount(null)
    }

    const handleUpdate = async (data: any) => {
        try {
            setActiveAccount(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }

    const onSubmit = async (payload: any) => {
        try {
            if (activeAccount && activeAccount.id) {
                // update record
                const { data } = await axios.put(
                    `/account/${activeAccount.id}`,
                    payload
                )
                if (data) {
                    mutate()
                    enqueueSnackbar('Account updated successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveAccount(null)
                }
            } else {
                // update record
                const { data } = await axios.post('/account', payload)
                if (data) {
                    mutate()
                    enqueueSnackbar('Account added successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveAccount(null)
                }
            }
        } catch (err: any) {
            enqueueSnackbar(err.message || 'Opearation failed', {
                variant: 'error',
            })
        } finally {
            setUpdateLoader(false)
        }
    }

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Accounts"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    {
                        name: 'Accounts',
                        href: PATH_DASHBOARD.systemData.accounts,
                    },
                ]}
                action={
                    <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New account
                    </Button>
                }
            />

            <ErrorBoundary
                fallback={
                    <InternalError error="Page did not load correctly try again" />
                }
            >
                <Suspense fallback={<p> loading... </p>}>
                    <AccountsTable
                        mutate={mutate}
                        handleUpdate={handleUpdate}
                        data={accounts}
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

                            <AccountForm
                                onSubmit={onSubmit}
                                account={activeAccount}
                                handleClose={handleClose}
                            />
                        </DialogContent>
                    </Dialog>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

export default AccountsPage
