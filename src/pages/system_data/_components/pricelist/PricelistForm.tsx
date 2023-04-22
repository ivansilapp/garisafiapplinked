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
    RHFUploadAvatar,
} from '../../../../components/hook-form'
import { useSnackbar } from '../../../../components/snackbar'

function VehicleForm({
    price,
    onSubmit,
    loading,
    handleClose,
    bodyTypes,
    services,
}: any) {
    const { enqueueSnackbar } = useSnackbar()

    const NewPriceSchema = Yup.object().shape({
        price: Yup.string().required('Vehicle registration required'),
        serviceId: Yup.string().required('Service required'),
        bodyId: Yup.string().required('Body type required'),
    })

    const defaultValues = useMemo(
        () => ({
            price: price?.price || '',
            serviceId: price?.serviceId || '',
            bodyId: price?.bodyId || '',
        }),
        [price]
    )
    const isEdit = price?.id && price.id !== ''

    const methods = useForm({
        resolver: yupResolver(NewPriceSchema),
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
                <RHFTextField name="price" type="number" label="Cost" />

                <RHFSelect native name="bodyId" label="Body type">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <option value="" defaultValue="" />
                    {bodyTypes.map((type: any) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </RHFSelect>

                <RHFSelect native name="serviceId" label="Service">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <option value="" defaultValue="" />
                    {services.map((service: any) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </RHFSelect>

                {/* <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            {...field}
                            freeSolo
                            onChange={(event, newValue) => {
                                setValue('clientId', newValue?.id)
                                return field.onChange(newValue)
                            }}
                            options={clients.map((option: any) => ({
                                label: option.name,
                                id: option.id,
                            }))}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        {...getTagProps({ index })}
                                        key={option.id}
                                        size="small"
                                        label={option.label}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    name="clientId"
                                    label="Client"
                                    {...params}
                                />
                            )}
                        />
                    )}
                /> */}
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
                        color="warning"
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

export default VehicleForm
