/* eslint-disable no-param-reassign */
import sum from 'lodash/sum'
import { useCallback, useEffect, useState } from 'react'
// form
import { useFormContext, useFieldArray } from 'react-hook-form'
// @mui
import {
    Box,
    Stack,
    Button,
    Divider,
    Typography,
    InputAdornment,
    MenuItem,
} from '@mui/material'
// utils
import { fCurrency } from '../../../utils/formatNumber'
// components
import Iconify from '../../../components/iconify'
import {
    RHFCheckbox,
    RHFSelect,
    RHFTextField,
} from '../../../components/hook-form'
import { apiUrl } from '../../../config-global'
import axios from '../../../utils/axios'
import { useSnackbar } from '../../../components/snackbar'

// ----------------------------------------------------------------------

export default function TaskForm({ services, vehicle, pricelist }: any) {
    const { control, setValue, watch, resetField, getValues } = useFormContext()
    const { enqueueSnackbar } = useSnackbar()
    const [activeIds, setActiveIds] = useState<any>([])

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    })

    const values = watch()

    const totalOnRow = values.items.map((item: any) => 1 * item.price)

    const totalPrice = sum(totalOnRow) - values.discount

    useEffect(() => {
        setValue('cost', totalPrice)
    }, [setValue, totalPrice])

    useEffect(() => {
        if (vehicle) {
            const { items } = getValues()
            setValue('vehicleId', vehicle.id)
            const bodyId = vehicle.bodyType.id
            const newItems = items.map((item: any) => {
                const { service } = item
                const serviceItem = services.find(
                    (s: any) => s.name === service
                )
                const priceData = pricelist.find(
                    (p: any) =>
                        p.serviceId === serviceItem?.id && p.bodyId === bodyId
                )
                if (priceData && serviceItem) {
                    item.price = priceData.price
                } else {
                    item.price = 0
                }
                return item
            })
            setValue('items', newItems)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicle])

    const handleAdd = () => {
        append({
            title: '',
            description: '',
            service: '',
            quantity: 1,
            price: 0,
            total: 0,
        })
    }

    const handleRemove = (index: any) => {
        remove(index)
    }

    const handleClearService = useCallback(
        (index: any) => {
            resetField(`items[${index}].quantity`)
            resetField(`items[${index}].price`)
            resetField(`items[${index}].total`)
            resetField(`items[${index}].serviceId`)

            const vs = getValues()
            const { serviceId } = vs.items[index]
            const newActiveIds = activeIds.filter((id: any) => id !== serviceId)
            setActiveIds(newActiveIds)
            // console.log(vs, 'values')
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [resetField, activeIds]
    )

    const handleSelectService = useCallback(
        async (index: any, service: any) => {
            let price = 0
            // if (activeIds.includes(service.id)) {
            //     enqueueSnackbar('Service already added', {
            //         variant: 'error',
            //     })
            //     return
            // }
            setActiveIds([...activeIds, service.id])
            if (vehicle !== null) {
                const { data } = await axios.get(
                    `${apiUrl}/pricelist/details/${service.id}/${vehicle.bodyType.id}`
                )
                if (data.price) {
                    price = data.price.price
                    setValue(`items[${index}].price`, price)
                    setValue(`items[${index}].serviceId`, service?.id)
                    setValue(`items[${index}].priceId`, data.price?.id)
                    setValue(
                        `items[${index}].total`,
                        values.items.map(
                            (item: any) => item.quantity * item.price
                        )[index]
                    )
                    enqueueSnackbar('Service price updated', {
                        variant: 'success',
                    })
                } else {
                    // error snackbar
                    enqueueSnackbar('Service price not found', {
                        variant: 'error',
                    })
                }
            } else {
                // error snackbar
                enqueueSnackbar('Please select a vehicle', { variant: 'error' })
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setValue, values.items, vehicle]
    )

    const handleChangeQuantity = useCallback(
        (event: any, index: any) => {
            setValue(`items[${index}].quantity`, Number(event.target.value))
            setValue(
                `items[${index}].total`,
                values.items.map((item: any) => item.quantity * item.price)[
                    index
                ]
            )
        },
        [setValue, values.items]
    )

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
                Details:
            </Typography>

            <Stack
                divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
                spacing={3}
            >
                {fields?.map((item, index) => (
                    <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            sx={{ width: 1 }}
                        >
                            {/* <RHFTextField
                                size="small"
                                name={`items[${index}].title`}
                                label="Title"
                                InputLabelProps={{ shrink: true }}
                            /> */}

                            <RHFSelect
                                name={`items[${index}].service`}
                                size="small"
                                label="Service"
                                InputLabelProps={{ shrink: true }}
                                sx={{ maxWidth: { md: 360 } }}
                            >
                                <MenuItem
                                    value=""
                                    onClick={() => handleClearService(index)}
                                    sx={{
                                        fontStyle: 'italic',
                                        color: 'text.secondary',
                                    }}
                                >
                                    None
                                </MenuItem>

                                <Divider />

                                {services.map((service: any) => (
                                    <MenuItem
                                        disabled={activeIds.includes(
                                            service.id
                                        )}
                                        key={service.id}
                                        value={service.name}
                                        onClick={() =>
                                            handleSelectService(index, service)
                                        }
                                    >
                                        {service.name}
                                    </MenuItem>
                                ))}
                            </RHFSelect>

                            <RHFTextField
                                size="small"
                                type="number"
                                name={`items[${index}].quantity`}
                                label="Quantity"
                                placeholder="0"
                                onChange={(event: any) =>
                                    handleChangeQuantity(event, index)
                                }
                                InputLabelProps={{ shrink: true }}
                                sx={{ display: 'none', maxWidth: { md: 96 } }}
                            />

                            {/* <RHFTextField
                                size="small"
                                type="number"
                                name={`items[${index}].price`}
                                label="Price"
                                placeholder="0"
                                onChange={(event: any) =>
                                    handleChangePrice(event, index)
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            Ksh
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ maxWidth: { md: 96 } }}
                            /> */}

                            <RHFTextField
                                disabled
                                size="small"
                                name={`items[${index}].total`}
                                label="Total"
                                placeholder="0"
                                value={totalOnRow[index]}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            Ksh
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ maxWidth: { md: 146 } }}
                            />
                        </Stack>

                        <Button
                            size="small"
                            color="error"
                            startIcon={<Iconify icon="eva:trash-2-outline" />}
                            onClick={() => handleRemove(index)}
                        >
                            Remove
                        </Button>
                    </Stack>
                ))}
            </Stack>

            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

            <Stack
                spacing={2}
                direction={{ xs: 'column-reverse', md: 'row' }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
            >
                <Button
                    size="small"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleAdd}
                    sx={{ flexShrink: 0 }}
                >
                    Add Item
                </Button>

                <Stack
                    spacing={2}
                    justifyContent="flex-end"
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{ width: 1 }}
                >
                    <RHFTextField
                        size="small"
                        label="Discount"
                        name="discount"
                        onChange={(event: any) =>
                            setValue('discount', Number(event.target.value))
                        }
                        sx={{ maxWidth: { md: 200 } }}
                    />

                    {/* <RHFTextField
                        size="small"
                        label="Taxes"
                        name="taxes"
                        onChange={(event: any) =>
                            setValue('taxes', Number(event.target.value))
                        }
                        sx={{ maxWidth: { md: 200 } }}
                    /> */}
                </Stack>
            </Stack>
            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
            <Stack>
                <RHFCheckbox label="Car keys" name="carKeys" />
            </Stack>

            <Stack spacing={2} sx={{ mt: 3 }}>
                <Stack direction="row" justifyContent="flex-end">
                    <Typography>Subtotal :</Typography>
                    <Typography sx={{ textAlign: 'right', width: 120 }}>
                        {fCurrency(sum(totalOnRow)) || '-'}
                    </Typography>
                </Stack>

                {/* <Stack direction="row" justifyContent="flex-end">
                    <Typography>Discount :</Typography>
                    <Typography
                        sx={{
                            textAlign: 'right',
                            width: 120,
                            ...(values.discount && { color: 'error.main' }),
                        }}
                    >
                        {values.discount
                            ? `- ${fCurrency(values.discount)}`
                            : '-'}
                    </Typography>
                </Stack> */}

                {/* <Stack direction="row" justifyContent="flex-end">
                    <Typography>Taxes :</Typography>
                    <Typography sx={{ textAlign: 'right', width: 120 }}>
                        {values.taxes ? fCurrency(values.taxes) : '-'}
                    </Typography>
                </Stack> */}

                <Stack direction="row" justifyContent="flex-end">
                    <Typography variant="h6">Total price :</Typography>
                    <Typography
                        variant="h6"
                        sx={{ textAlign: 'right', width: 120 }}
                    >
                        {fCurrency(totalPrice) || '-'}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    )
}
