/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import { useTheme } from '@mui/material/styles'
import { Card, Typography, Stack, Divider } from '@mui/material'
// hooks
import useResponsive from '../../../hooks/useResponsive'
// utils
import { fNumber } from '../../../utils/formatNumber'
// components
import Chart, { useChart } from '../../../components/chart'

// ----------------------------------------------------------------------

const CHART_SIZE = {
    width: 106,
    height: 106,
}

export default function TaskCountCard({ chart, ...other }: any) {
    const theme = useTheme()

    const isDesktop = useResponsive('up', 'sm', '')

    const { colors, series, options } = chart

    const chartOptionsCheckIn = useChart({
        chart: {
            sparkline: {
                enabled: true,
            },
        },
        colors,
        grid: {
            padding: {
                top: -9,
                bottom: -9,
            },
        },
        legend: {
            show: false,
        },
        plotOptions: {
            radialBar: {
                hollow: { size: '64%' },
                track: { margin: 0 },
                dataLabels: {
                    name: { show: false },
                    // show: false,
                    value: {
                        offsetY: 6,
                        fontSize: theme.typography.subtitle2.fontSize,
                    },
                },
            },
        },
        ...options,
    })

    // console.log(colors, 'colors')

    // const chartOptionsCheckOut = {
    //     ...chartOptionsCheckIn,
    //     colors: [colors[1]],
    // }
    const makeOption = (i: number) => {
        const cs = colors[i] ?? colors[0]
        return {
            ...chartOptionsCheckIn,
            colors: [cs],
        }
    }
    return (
        <Card {...other}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                divider={
                    <Divider
                        orientation={isDesktop ? 'vertical' : 'horizontal'}
                        flexItem
                        sx={{ borderStyle: 'dashed' }}
                    />
                }
            >
                {series.map((item: any, index: any) => (
                    <Stack
                        key={item.label}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={3}
                        sx={{ width: 1, py: 5 }}
                    >
                        <Chart
                            type="radialBar"
                            series={[item.percent]}
                            options={makeOption(index)}
                            {...CHART_SIZE}
                        />

                        <div>
                            <Typography variant="h4" sx={{ mb: 0.5 }}>
                                {fNumber(item.total)}
                            </Typography>

                            <Typography variant="body2" sx={{ opacity: 0.72 }}>
                                {item.label}
                            </Typography>
                        </div>
                    </Stack>
                ))}
            </Stack>
        </Card>
    )
}
