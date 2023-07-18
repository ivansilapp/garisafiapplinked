/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import { Card, CardHeader, Box } from '@mui/material'
// components
import Chart, { useChart } from '../../../components/chart'

// ----------------------------------------------------------------------

export default function AnalyticsChart({
    title,
    subheader,
    chart,
    ...other
}: any) {
    const { labels, colors, series, options } = chart

    const chartOptions = useChart({
        colors,
        plotOptions: {
            bar: {
                columnWidth: '16%',
            },
        },
        fill: {
            type: series.map((i: any) => i.fill),
        },
        labels,
        xaxis: {
            type: 'datetime',
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (value: any) => {
                    if (typeof value !== 'undefined') {
                        return `${value.toFixed(0)} visits`
                    }
                    return value
                },
            },
        },
        ...options,
    })

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <Chart
                    type="line"
                    series={series}
                    options={chartOptions}
                    height={364}
                />
            </Box>
        </Card>
    )
}
