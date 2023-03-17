import { Card, Divider, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Scrollbar from '../../../components/scrollbar'
import TaskAnalyticsItem from './TaskAnalyticsItem'

export default function AnalyticsBar() {
    const theme = useTheme()
    return (
        <Card sx={{ mb: 5 }}>
            <Scrollbar>
                <Stack
                    direction="row"
                    divider={
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ borderStyle: 'dashed' }}
                        />
                    }
                    sx={{ py: 2 }}
                >
                    <TaskAnalyticsItem
                        title="Total"
                        total={300}
                        percent={100}
                        price={300}
                        icon="ic:round-receipt"
                        color={theme.palette.info.main}
                    />

                    <TaskAnalyticsItem
                        title="Paid"
                        total={12}
                        percent={10}
                        price={300}
                        icon="eva:checkmark-circle-2-fill"
                        color={theme.palette.success.main}
                    />

                    <TaskAnalyticsItem
                        title="Unpaid"
                        total={3000}
                        percent={40}
                        price={300}
                        icon="eva:clock-fill"
                        color={theme.palette.warning.main}
                    />

                    {/* <TaskAnalyticsItem
                        title="Overdue"
                        total={1000}
                        percent={3}
                        price={250}
                        icon="eva:bell-fill"
                        color={theme.palette.error.main}
                    /> */}

                    <TaskAnalyticsItem
                        title="Draft"
                        total={4}
                        percent={2}
                        price={600}
                        icon="eva:file-fill"
                        color={theme.palette.text.secondary}
                    />
                </Stack>
            </Scrollbar>
        </Card>
    )
}
