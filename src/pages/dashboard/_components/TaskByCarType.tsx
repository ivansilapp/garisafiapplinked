/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import { useTheme, styled } from '@mui/material/styles'
import { Card, CardHeader, Typography } from '@mui/material'
// utils
import { fCurrency, fNumber } from '../../../utils/formatNumber'
// components
import Chart, { useChart } from '../../../components/chart'

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400

const LEGEND_HEIGHT = 72

const StyledChart = styled('div')(({ theme }) => ({
    height: CHART_HEIGHT,
    marginTop: theme.spacing(5),
    '& .apexcharts-canvas svg': {
        height: CHART_HEIGHT,
    },
    '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
        overflow: 'visible',
    },
    '& .apexcharts-legend': {
        height: LEGEND_HEIGHT,
        alignContent: 'center',
        position: 'relative !important',
        borderTop: `solid 1px ${theme.palette.divider}`,
        top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
    },
}))

// ----------------------------------------------------------------------

export default function TaskByCarType({
    title,
    subheader,
    chart,
    type = 'pie',
    currency = false,
    ...other
}: any) {
    const theme = useTheme()

    const { colors, series, options } = chart

    const chartSeries = series.map((i: any) => i.value)

    const total = series.reduce((acc: any, i: any) => acc + i.value, 0)

    const chartOptions = useChart({
        chart: {
            sparkline: {
                enabled: true,
            },
        },
        colors,
        labels: series.map((i: any) => i.label),
        stroke: {
            colors: [theme.palette.background.paper],
        },
        legend: {
            floating: true,
            horizontalAlign: 'center',
        },
        dataLabels: {
            enabled: true,
            dropShadow: { enabled: false },
        },
        tooltip: {
            fillSeriesColor: false,
            y: {
                formatter: (value: any) => fNumber(value),
                title: {
                    formatter: (seriesName: any) => `${seriesName}`,
                },
            },
        },
        plotOptions: {
            pie: { donut: { labels: { show: false } } },
        },
        ...options,
    })

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <StyledChart dir="ltr">
                <Chart
                    type={type}
                    series={chartSeries}
                    options={chartOptions}
                    height={280}
                />
                <Typography variant="subtitle2" sx={{ p: 2 }}>
                    Total: {currency ? fCurrency(total) : total}{' '}
                </Typography>
            </StyledChart>
        </Card>
    )
}
