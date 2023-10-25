/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import { Button, Card, Typography, Stack } from '@mui/material'
// utils
import { useMemo } from 'react'
import { fCurrency } from '../../../../utils/formatNumber'
import { fDateTime } from '../../../../utils/formatTime'

// ----------------------------------------------------------------------

export default function VehicleDetailCard({ vehicle, sx, ...other }: any) {
    const freeWashes = useMemo(() => {
        const freeTasks = vehicle?.tasks?.filter((v: any) => v.isRedeemed)
        return freeTasks ?? []
    }, [vehicle])

    return (
        <Card sx={{ p: 3, ...sx }} {...other}>
            {/* <Typography variant="subtitle2" gutterBottom>
                {v}
            </Typography> */}

            <Stack spacing={2}>
                <Typography variant="h3">{vehicle.registration}</Typography>

                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Body type
                    </Typography>
                    <Typography variant="body2">
                        {vehicle?.bodyType?.name}
                        {vehicle.model ? ` - ${vehicle.model}` : ''}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Date registered
                    </Typography>
                    <Typography variant="body2">
                        {fDateTime(vehicle?.CreatedAt, null)}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Number of visits
                    </Typography>
                    <Typography variant="body2">
                        {vehicle?.tasks?.length}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Free washes
                    </Typography>
                    <Typography variant="body2">{freeWashes.length}</Typography>
                </Stack>
                {/* 
                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Sent Amount
                    </Typography>
                    <Typography variant="body2">
                        - {fCurrency(sentAmount)}
                    </Typography>
                </Stack> */}

                {/* <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Total Amount
                    </Typography>
                    <Typography variant="subtitle1">
                        {fCurrency(totalAmount)}
                    </Typography>
                </Stack> */}

                {/* <Stack direction="row" spacing={1.5}>
                    <Button fullWidth variant="contained" color="warning">
                        Transfer
                    </Button>

                    <Button fullWidth variant="contained">
                        Receive
                    </Button>
                </Stack> */}
            </Stack>
        </Card>
    )
}
