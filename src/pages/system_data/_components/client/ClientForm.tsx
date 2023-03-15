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
    RHFTextField,
} from '../../../../components/hook-form'
// import { useSnackbar } from '../../../../components/snackbar'

function ClientForm({ client, onSubmit, handleClose }: any) {
    // const { enqueueSnackbar } = useSnackbar()

    const NewClientSchema = Yup.object().shape({
        name: Yup.string().required('Client name required'),
        phone: Yup.string().required('Client phone required'),
        email: Yup.string(),
    })

    const defaultValues = useMemo(
        () => ({
            name: client?.name || '',
            phone: client?.phone || '',
            email: client?.email || '',
        }),
        [client]
    )
    const isEdit = client?.id && client.id !== ''

    const methods = useForm({
        resolver: yupResolver(NewClientSchema),
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
                <RHFTextField name="name" label="Full name" />
                <RHFTextField name="phone" label="Phone number" />
                <RHFTextField name="email" label="Email" />
                {/* <RHFSelect native name="status" label="Status">
                    <option value="" />
                    {['active', 'suspended'].map((status: string) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </RHFSelect> */}
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
                        disabled={isSubmitting}
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

export default ClientForm
