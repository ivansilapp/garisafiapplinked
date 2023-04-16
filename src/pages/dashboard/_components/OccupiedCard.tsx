/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import {
    Box,
    Card,
    Typography,
    LinearProgress,
    Stack,
    Button,
} from '@mui/material'
// utils
import { Link } from 'react-router-dom'
import { fData, fNumber } from '../../../utils/formatNumber'

export default function OccupiedCard({
    title,
    value,
    total,
    icon,
    sx,
    url,
    ...other
}: any) {
    return (
        <Card sx={{ p: 3, ...sx }} {...other}>
            <Box component="img" src={icon} sx={{ width: 48, height: 48 }} />

            <Typography variant="h6" sx={{ mt: 3 }}>
                <Button to={url} component={Link}>
                    {title}
                </Button>
            </Typography>

            <LinearProgress
                value={24}
                variant="determinate"
                color="inherit"
                sx={{
                    my: 2,
                    height: 6,
                    '&::before': {
                        bgcolor: 'background.neutral',
                        opacity: 1,
                    },
                }}
            />

            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Box
                    component="span"
                    sx={{ typography: 'body2', color: 'text.disabled' }}
                >
                    <b> {fNumber(value)}</b> occupied out of
                </Box>

                <Box
                    component="span"
                    sx={{ typography: 'subtitle2', color: 'text.disabled' }}
                >
                    {fNumber(total)}
                </Box>
            </Stack>
        </Card>
    )
}
