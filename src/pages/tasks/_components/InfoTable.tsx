import { Box, Card, CardContent, Divider, Tab, Tabs } from '@mui/material'
import { Suspense, useState } from 'react'
import Label from '../../../components/label'
import TasksTable from './TasksTable'
import WaitlistTable from './WaitlistTable'

export default function InfoTable({ info, tableData, mutate }: any) {
    // const [filterStatus, setFilterStatus] = useState('waitlist')
    const [currentTab, setCurrentTab] = useState('waitlist')

    const getLengthByStatus = (status: string) =>
        (tableData ?? []).filter((item: any) => item.status === status).length

    const deleteWaitlistRecord = (id: number) => {
        console.log('delete waitlist record', id)
    }

    const TABS = [
        {
            value: 'waitlist',
            label: 'Queue',
            color: 'default',
            count: info?.waitlist?.length ?? 0,
            component: (
                <WaitlistTable
                    onDeleteRow={deleteWaitlistRecord}
                    mutate={mutate}
                    data={info?.waitlist ?? []}
                />
            ),
        },
        {
            value: 'pending',
            label: 'Pending',
            color: 'warning',
            count: info?.pending?.length ?? 0,
            component: (
                <Suspense fallback={<p>Loading...</p>}>
                    <TasksTable
                        onDeleteRow={() => {}}
                        mutate={mutate}
                        data={info.pending ?? []}
                    />
                </Suspense>
            ),
        },
        {
            value: 'ongoing',
            label: 'On Going',
            color: 'info',
            count: info?.ongoing?.length ?? 0,
            component: (
                <Suspense fallback={<p>Loading...</p>}>
                    <TasksTable
                        onDeleteRow={() => {}}
                        mutate={mutate}
                        data={info.ongoing ?? []}
                    />
                </Suspense>
            ),
        },
        {
            value: 'complete',
            label: 'Completed',
            color: 'success',
            count: info?.complete?.length ?? 0,
            component: (
                <Suspense fallback={<p>Loading...</p>}>
                    <TasksTable
                        onDeleteRow={() => {}}
                        mutate={mutate}
                        data={info.complete ?? []}
                    />
                </Suspense>
            ),
        },
        {
            value: 'cancelled',
            label: 'Cancelled',
            color: 'error',
            count: info?.cancelled?.length ?? 0,
            component: (
                <Suspense fallback={<p>Loading...</p>}>
                    <TasksTable
                        onDeleteRow={() => {}}
                        mutate={mutate}
                        data={info.canceled ?? []}
                    />
                </Suspense>
            ),
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
