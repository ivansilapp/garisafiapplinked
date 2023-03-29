/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import { useTheme } from '@mui/material/styles'
import { Typography, Box, Stack, Theme } from '@mui/material'
// utils
import { fNumber } from '../../../../utils/formatNumber'
// components
import Iconify from '../../../../components/iconify'
import Chart, { useChart } from '../../../../components/chart'

// ----------------------------------------------------------------------

export default function PointsWidget({
    title,
    total,
    icon,
    color = 'primary',
    chart,
    sx,
    ...other
}: any) {
    const theme: any = useTheme<Theme>()

    const { series, options } = chart

    const chartOptions = useChart({
        colors: [theme.palette[color].light],
        chart: {
            sparkline: {
                enabled: true,
            },
        },
        legend: {
            show: false,
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '78%',
                },
                track: {
                    margin: 0,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        offsetY: 6,
                        color: theme.palette.common.white,
                        fontSize: theme.typography.subtitle2.fontSize,
                    },
                },
            },
        },
        ...options,
    })

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                p: 3,
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                color: 'common.white',
                bgcolor: `${color}.dark`,
                ...sx,
            }}
            {...other}
        >
            <Chart
                type="radialBar"
                series={[series]}
                options={chartOptions}
                width={106}
                height={106}
            />

            <Box sx={{ ml: 3 }}>
                <Typography variant="h3"> {fNumber(total)}</Typography>

                <Typography variant="h6" sx={{ opacity: 0.72 }}>
                    {title}
                </Typography>
            </Box>

            <Iconify
                icon={icon}
                sx={{
                    width: 120,
                    height: 120,
                    opacity: 0.12,
                    position: 'absolute',
                    right: theme.spacing(-3),
                }}
            />
        </Stack>
    )
}
