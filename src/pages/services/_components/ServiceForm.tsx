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
} from '../../../components/hook-form'
import { useSnackbar } from '../../../components/snackbar'

function ServiceForm({ service, onSubmit, handleClose }: any) {
    const { enqueueSnackbar } = useSnackbar()

    const NewServiceSchema = Yup.object().shape({
        name: Yup.string().required('Service required'),
    })

    const defaultValues = useMemo(
        () => ({
            name: service?.name || '',
        }),
        [service]
    )
    const isEdit = service?.id && service.id !== ''

    const methods = useForm({
        resolver: yupResolver(NewServiceSchema),
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
                <RHFTextField name="name" label="Service" />
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

export default ServiceForm
