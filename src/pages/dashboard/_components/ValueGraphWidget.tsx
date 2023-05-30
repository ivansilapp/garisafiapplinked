/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
// @mui
import { alpha } from '@mui/material/styles'
import { Box, Card, Typography, Stack, Button } from '@mui/material'
// utils
import { Link } from 'react-router-dom'
import { fCurrency, fNumber, fPercent } from '../../../utils/formatNumber'
// components
import Iconify from '../../../components/iconify'
import Chart, { useChart } from '../../../components/chart'

// ----------------------------------------------------------------------

export default function ValueGraphWidget({
    title,
    percent,
    total,
    chart,
    currency,
    items,
    url,
    sx,
    ...other
}: any) {
    const { colors, series, options } = chart

    const chartOptions = useChart({
        colors,
        chart: {
            animations: {
                enabled: true,
            },
            sparkline: {
                enabled: true,
            },
        },
        stroke: {
            width: 2,
        },
        tooltip: {
            x: {
                show: false,
            },
            y: {
                formatter: (value: any) => fNumber(value),
                title: {
                    formatter: () => '',
                },
            },
            marker: {
                show: false,
            },
        },
        ...options,
    })

    return (
        <Card
            sx={{ display: 'flex', alignItems: 'center', p: 2, ...sx }}
            {...other}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" paragraph>
                    <Button component={Link} to={url}>
                        {title}
                    </Button>
                </Typography>

                <Typography variant="h4" gutterBottom>
                    {currency ? fCurrency(total) : fNumber(total)}
                </Typography>

                <Typography>
                    {items ? `${items.title} ${items.value}` : '_'}
                </Typography>

                {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
                <TrendingInfo percent={percent} />
            </Box>

            <Box sx={{ m: 1 }}>
                <Chart
                    type="line"
                    series={[{ data: series }]}
                    options={chartOptions}
                    width={120}
                    height={80}
                />
            </Box>
        </Card>
    )
}

// ----------------------------------------------------------------------

function TrendingInfo({ percent }: any) {
    return (
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
            <Iconify
                icon={
                    percent < 0
                        ? 'eva:trending-down-fill'
                        : 'eva:trending-up-fill'
                }
                sx={{
                    mr: 1,
                    p: 0.5,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    color: 'success.main',
                    bgcolor: (theme: any) =>
                        alpha(theme.palette.success.main, 0.16),
                    ...(percent < 0 && {
                        color: 'error.main',
                        bgcolor: (theme: any) =>
                            alpha(theme.palette.error.main, 0.16),
                    }),
                }}
            />

            <Typography variant="subtitle2" component="div" noWrap>
                {/* {percent > 0 && '+'}

                {fPercent(percent)} */}

                {/* <Box
                    component="span"
                    sx={{ color: 'text.secondary', typography: 'body2' }}
                >
                    {' than last week'}
                </Box> */}
            </Typography>
        </Stack>
    )
}
