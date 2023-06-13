/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import { alpha } from '@mui/material/styles'
import {
    Card,
    CardHeader,
    Typography,
    Stack,
    LinearProgress,
    Box,
} from '@mui/material'
// utils
import { useNavigate } from 'react-router-dom'
import { fCurrency, fShortenNumber } from '../../../utils/formatNumber'

// ----------------------------------------------------------------------

export default function AccountsOverview({
    title,
    subheader,
    data,
    date,
    ...other
}: any) {
    const navigate = useNavigate()
    return (
        <Card {...other}>
            <CardHeader
                onClick={() => navigate(`/payments?startDate=${date}`)}
                title={title}
                subheader={subheader}
                style={{ cursor: 'pointer' }}
            />

            <Stack spacing={3} sx={{ px: 3, my: 5 }}>
                {data.map((progress: any) => (
                    <LinearProgress
                        variant="determinate"
                        key={progress.status}
                        value={progress.value}
                        color={
                            (progress.status?.toLowerCase() === 'cash' &&
                                'warning') ||
                            (progress.status?.toLowerCase() === 'mpesa' &&
                                'success') ||
                            'info'
                        }
                        sx={{
                            height: 8,
                            bgcolor: (theme) =>
                                alpha(theme.palette.grey[500], 0.16),
                        }}
                    />
                ))}
            </Stack>

            <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ px: 3, pb: 3 }}
            >
                {data.map((progress: any) => (
                    <Stack key={progress.status} alignItems="center">
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ mb: 1 }}
                        >
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 0.5,
                                    bgcolor: 'info.main',
                                    ...(progress.status?.toLowerCase() ===
                                        'cash' && {
                                        bgcolor: 'warning.main',
                                    }),
                                    ...(progress.status?.toLowerCase() ===
                                        'mpesa' && {
                                        bgcolor: 'success.main',
                                    }),
                                }}
                            />

                            <Typography
                                variant="subtitle2"
                                sx={{ color: 'text.secondary' }}
                            >
                                {progress.status}
                            </Typography>
                        </Stack>

                        <Typography variant="h6">
                            {fCurrency(progress.quantity)}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Card>
    )
}
