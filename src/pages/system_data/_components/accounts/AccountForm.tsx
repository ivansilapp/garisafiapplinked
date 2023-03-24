/* eslint-disable react/jsx-props-no-spreading */
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useMemo } from 'react'
import {
    Box,
    Button,
    Stack,
    Autocomplete,
    Chip,
    TextField,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import FormProvider, {
    RHFSelect,
    RHFSwitch,
    RHFTextField,
} from '../../../../components/hook-form'
import { useSnackbar } from '../../../../components/snackbar'

function AccountForm({
    account,
    onSubmit,
    loading,
    handleClose,
    clients,
    bodyTypes,
}: any) {
    const { enqueueSnackbar } = useSnackbar()

    const NewAccountSchema = Yup.object().shape({
        name: Yup.string().required('Account name required'),
        balance: Yup.number(),
        status: Yup.string().required('status required'),
    })

    const defaultValues = useMemo(
        () => ({
            name: account?.name || '',
            balance: account?.balance || 0,
            status: account?.status || '',
        }),
        [account]
    )
    const isEdit = account?.id && account.id !== ''

    const methods = useForm({
        resolver: yupResolver(NewAccountSchema),
        defaultValues,
    })

    const {
        handleSubmit,
        control,
        setValue,
        formState: { isSubmitting },
    } = methods

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
                sx={{ pt: 3 }}
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                }}
            >
                <RHFTextField name="name" label="Account name" />

                <RHFTextField name="balance" label="Balance" />

                <RHFSelect native name="status" label="Account status">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <option value="" defaultValue="" />
                    {['active', 'inactive'].map((status: string) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </RHFSelect>
            </Box>

            <Stack alignItems="flex-end " sx={{ mt: 3 }}>
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        paddingBottom: '8px',
                    }}
                >
                    <Button
                        variant="outlined"
                        disabled={loading}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <LoadingButton
                        loading={isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        {!isEdit ? 'Save' : 'Save Changes'}
                    </LoadingButton>
                </div>
            </Stack>
        </FormProvider>
    )
}

export default AccountForm
