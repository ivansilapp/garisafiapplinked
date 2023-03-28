/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import { Button, Card, Typography, Stack } from '@mui/material'
// utils
import { fCurrency } from '../../../utils/formatNumber'

// ----------------------------------------------------------------------

export default function AttendantBalance({
    title,
    currentBalance,
    unpaidTasks,
    sx,
    ...other
}: any) {
    const totalAmount = currentBalance + unpaidTasks

    return (
        <Card sx={{ p: 3, ...sx }} {...other}>
            <Typography variant="subtitle2" gutterBottom>
                {title}
            </Typography>

            <Stack spacing={2}>
                <Typography variant="h3">
                    {fCurrency(currentBalance)}
                </Typography>

                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Your Current commision
                    </Typography>
                    <Typography variant="body2">
                        {fCurrency(currentBalance)}
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Unpaid tasks
                    </Typography>
                    <Typography variant="body2">
                        {fCurrency(unpaidTasks)}
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Total Amount
                    </Typography>
                    <Typography variant="subtitle1">
                        {fCurrency(totalAmount)}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    {/* <Button fullWidth variant="contained" color="warning">
                        Transfer
                    </Button> */}

                    <Button fullWidth variant="contained">
                        Pay attendant
                    </Button>
                </Stack>
            </Stack>
        </Card>
    )
}
