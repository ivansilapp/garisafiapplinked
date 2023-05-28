/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react'
// @mui
import { Card, CardHeader, Box } from '@mui/material'
// components
import { CustomSmallSelect } from '../../../components/custom-input'
import Chart, { useChart } from '../../../components/chart'

// ----------------------------------------------------------------------

export default function AnnualChart({
    title,
    subheader,
    chart,
    ...other
}: any) {
    const { categories, colors, series, options } = chart

    const [seriesData, setSeriesData] = useState('Year')

    const chartOptions = useChart({
        colors,
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories,
        },
        tooltip: {
            y: {
                formatter: (value: any) => `KES ${value}`,
            },
        },
        ...options,
    })

    return (
        <Card {...other}>
            <CardHeader
                title={title}
                subheader={subheader}
                // action={
                //     <CustomSmallSelect
                //         value={seriesData}
                //         onChange={(event: any) =>
                //             setSeriesData(event.target.value)
                //         }
                //     >
                //         {series.map((option: any) => (
                //             <option key={option.type} value={option.type}>
                //                 {option.type}
                //             </option>
                //         ))}
                //     </CustomSmallSelect>
                // }
            />

            {series.map((item: any) => (
                <Box key={item.type} sx={{ mt: 3, mx: 3 }} dir="ltr">
                    {item.type === seriesData && (
                        <Chart
                            type="bar"
                            series={item.data}
                            options={chartOptions}
                            height={364}
                        />
                    )}
                </Box>
            ))}
        </Card>
    )
}
