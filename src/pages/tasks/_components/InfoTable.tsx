import { Box, Card, CardContent, Divider, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import Label from '../../../components/label'

export default function InfoTable({ info, tableData }: any) {
    // const [filterStatus, setFilterStatus] = useState('waitlist')
    const [currentTab, setCurrentTab] = useState('waitlist')

    const getLengthByStatus = (status: string) =>
        (tableData ?? []).filter((item: any) => item.status === status).length
    const TABS = [
        {
            value: 'waitlist',
            label: 'Queue',
            color: 'default',
            count: info?.waitlist?.length ?? 0,
            component: <div>Waitlist</div>,
        },
        {
            value: 'pending',
            label: 'Pending',
            color: 'warning',
            count: info?.pending?.length ?? 0,
            component: <div>pending</div>,
        },
        {
            value: 'ongoing',
            label: 'On Going',
            color: 'info',
            count: info?.ongoing?.length ?? 0,
            component: <div>Ongoing</div>,
        },
        {
            value: 'complete',
            label: 'Completed',
            color: 'success',
            count: info?.complete?.length ?? 0,
            component: <div>Completed</div>,
        },
        {
            value: 'cancelled',
            label: 'Cancelled',
            color: 'error',
            count: info?.cancelled?.length ?? 0,
            component: <div>canceled</div>,
        },
    ]
    const setPage = (val: number) => {}

    return (
        <Card>
            <Tabs
                value={currentTab}
                onChange={(event: any, newValue: any) =>
                    setCurrentTab(newValue)
                }
                sx={{
                    px: 2,
                    bgcolor: 'background.neutral',
                }}
            >
                {TABS.map((tab) => (
                    <Tab
                        key={tab.value}
                        value={tab.value}
                        label={tab.label}
                        icon={
                            <Label color={tab.color} sx={{ mr: 1 }}>
                                {tab.count}
                            </Label>
                        }
                    />
                ))}
            </Tabs>

            <Divider />

            <CardContent>
                {TABS.map(
                    (tab: any) =>
                        tab.value === currentTab && (
                            <Box key={tab.value}> {tab.component} </Box>
                        )
                )}
            </CardContent>
        </Card>
    )
}
