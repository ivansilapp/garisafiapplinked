/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import { useTheme, styled } from '@mui/material/styles'
import { Card, CardHeader } from '@mui/material'
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

export default function AccountBalances({
    title,
    subheader,
    chart,
    ...other
}: any) {
    const theme = useTheme()

    const { colors, series, options }: any = chart

    const chartSeries = series.map((i: any) => i.value)

    const chartOptions = useChart({
        chart: {
            sparkline: {
                enabled: true,
            },
        },
        colors,
        labels: series.map((i: any) => i.label),
        stroke: { colors: [theme.palette.background.paper] },
        legend: { floating: true, horizontalAlign: 'center' },
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
            pie: {
                donut: {
                    size: '90%',
                    labels: {
                        value: {
                            formatter: (value: any) => fCurrency(value),
                        },
                        total: {
                            formatter: (w: any) => {
                                const sum = w.globals.seriesTotals.reduce(
                                    (a: any, b: any) => a + b,
                                    0
                                )
                                return fCurrency(sum)
                            },
                        },
                    },
                },
            },
        },
        ...options,
    })

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <StyledChart dir="ltr">
                <Chart
                    type="donut"
                    series={chartSeries}
                    options={chartOptions}
                    height={280}
                />
            </StyledChart>
        </Card>
    )
}
