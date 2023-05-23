import { Card, Divider, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import Scrollbar from '../../../components/scrollbar'
import {
    computeCumalativeTaskTotals,
    computeTaskTotals,
} from '../../../utils/common'
import TaskAnalyticsItem from './TaskAnalyticsItem'

export default function AnalyticsBar({ info }: any) {
    const theme = useTheme()

    const [totalTasks, setTotalTasks] = useState(0)
    const [totalVehicles, setTotalVehicles] = useState(0)

    // console.log(info)

    useEffect(() => {
        const totalComplete: number = computeTaskTotals(info?.complete ?? [])
        const totalOngoing: number = computeTaskTotals(info?.ongoing ?? [])
        const totalPending: number = computeTaskTotals(info?.pending ?? [])

        setTotalTasks(totalComplete + totalOngoing + totalPending)
        const totalV =
            (info?.complete?.length ?? 0) +
            (info?.ongoing?.length ?? 0) +
            (info?.pending?.length ?? 0)
        setTotalVehicles(totalV)
    }, [info])

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
                        title="Queued"
                        total={info?.waitlist?.length ?? 0}
                        percent={100}
                        price={0}
                        icon="eva:file-fill"
                        color={theme.palette.text.secondary}
                    />

                    <TaskAnalyticsItem
                        title="Ongoing"
                        total={
                            (info?.ongoing?.length ?? 0) +
                            (info?.pending?.length ?? 0)
                        }
                        percent={100}
                        price={computeCumalativeTaskTotals([
                            ...(info?.ongoing ?? []),
                            ...(info?.pending ?? []),
                        ])}
                        icon="eva:clock-fill"
                        color={theme.palette.warning.main}
                    />

                    <TaskAnalyticsItem
                        title="Completed"
                        total={info?.complete?.length ?? 0}
                        percent={10}
                        price={computeCumalativeTaskTotals(info?.complete)}
                        icon="eva:checkmark-circle-2-fill"
                        color={theme.palette.success.main}
                    />

                    <TaskAnalyticsItem
                        title="Total"
                        total={totalVehicles}
                        percent={100}
                        price={totalTasks}
                        icon="ic:round-receipt"
                        color={theme.palette.info.main}
                    />
                </Stack>
            </Scrollbar>
        </Card>
    )
}
