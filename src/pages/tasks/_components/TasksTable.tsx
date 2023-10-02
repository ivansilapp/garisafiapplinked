/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import { Card, Paper, Table, TableBody, TableContainer } from '@mui/material'

import { mutate as doMutate } from 'swr'

import { LoadingButton } from '@mui/lab'
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from '../../../components/table'
import Scrollbar from '../../../components/scrollbar'
import GeneralTableToolbar from '../../../components/shared/GeneralTableToolbar'
import TasksTableRow from './TasksTableRow'
import axios from '../../../utils/axios'
import { useSnackbar } from '../../../components/snackbar'
import ConfirmDialog from '../../../components/confirm-dialog'
import TaskPaymentModal from './TaskPaymentModal'
import { apiUrl } from '../../../config-global'
import { AuthContext } from '../../../auth/JwtContext'
import { useAuthContext } from '../../../auth/useAuthContext'

const TABLE_HEAD = [
    { id: 'CreatedAt', label: 'Created at', align: 'left' },
    { id: 'vehicle', label: 'Vehicle', align: 'left' },
    { id: 'pigeohole', label: 'Key No.', align: 'left' },
    { id: 'services', label: 'Services', align: 'left' },
    { id: 'attendant', label: 'Attendant', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: 'cost', label: 'Cost / Sales', align: 'left' },
    { id: 'payment', label: 'Payment', align: 'left' },
    { id: 'complete_action', label: 'Quick action', align: 'left' },
]

function TasksTable({
    data,
    handleUpdate,
    mutate,
    readOnly,
    splitRevenue,
    accounts,
}: any) {
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({})

    const { enqueueSnackbar } = useSnackbar()
    const [deleteLoader, setDeleteLoader] = useState(false)

    const [tableData, setTableData] = useState(data ?? [])

    const userCtx: any = useAuthContext()

    const AC = accounts && accounts?.length ? accounts : userCtx?.accounts ?? []

    // console.log(accounts, AC, 'task table')

    // const [openConfirm, setOpenConfirm] = useState(false)

    const [filterName, setFilterName] = useState('')

    const [completeModal, setCompleteModal] = useState(false)
    const [activeItem, setActiveItem] = useState<any>(null)
    const [completeLoader, setCompleteLoader] = useState(false)

    const [filterStatus, setFilterStatus] = useState('all')
    const [paymentModal, setPaymentModal] = useState(false)
    const [redeemLoader, setRedeemLoader] = useState(false)

    useEffect(() => {
        setTableData(data)
    }, [data])

    // console.log('split revenue', splitRevenue)

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterStatus,
    })

    const isFiltered = filterName !== '' || filterStatus !== 'all'

    const dataInPage = dataFiltered?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    )

    const denseHeight = dense ? 52 : 72

    const isNotFound =
        (!dataFiltered?.length && !!filterName) ||
        (!dataFiltered?.length && !!filterStatus)

    const handleFilterName = (event: any) => {
        setPage(0)
        setFilterName(event.target.value)
    }

    const handleResetFilter = () => {
        setFilterName('')
        setFilterStatus('all')
    }

    const handleDeleteRow = async (id: any) => {
        try {
            setDeleteLoader(true)
            const url = `/service/${id}`
            const response = await axios.delete(url)
            if (!response.data) {
                throw new Error('Error deleting service')
            }
            const deleteRow = tableData.filter((row: any) => row?.id !== id)
            mutate()
            setSelected([])
            setTableData(deleteRow)

            if (page > 0) {
                if (dataInPage.length < 2) {
                    setPage(page - 1)
                }
            }
            enqueueSnackbar('Service deleted', { variant: 'success' })
        } catch (err: any) {
            // console.log(err)
            enqueueSnackbar(err.message, { variant: 'error' })
        } finally {
            setDeleteLoader(false)
        }
    }

    const handleComplete = async () => {
        try {
            if (!activeItem) {
                throw new Error('Invalid item selected')
            }
            const { id } = activeItem

            if (!id) {
                throw new Error('Invalid item selected')
            }
            setCompleteLoader(true)
            const response = await axios.put(`/task/${id}`, {
                status: 'complete',
            })

            if (response.status === 200) {
                const index = tableData.findIndex(
                    (item: any) => item?.id === id
                )
                const updatedItem = {
                    ...tableData[index],
                    status: 'complete',
                }
                const updatedData = [
                    ...tableData.slice(0, index),
                    updatedItem,
                    ...tableData.slice(index + 1),
                ]
                mutate(updatedData)
                doMutate(`${apiUrl}/task/unpaid-tasks`)
                enqueueSnackbar('Marked as complete', {
                    variant: 'success',
                })
                setCompleteModal(false)
                setActiveItem(null)
            } else {
                const msg = response.data?.error || 'Error completing task'
                throw new Error(msg)
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error completing task'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setCompleteLoader(false)
        }
    }

    const handleRedeem = async (item: any) => {
        try {
            if (!item) {
                throw new Error('Invalid item selected')
            }
            const { id } = item

            if (!id) {
                throw new Error('Invalid item selected')
            }
            setCompleteLoader(true)
            const response = await axios.put(`/task/${id}`, {
                status: 'complete',
            })

            setRedeemLoader(true)
            const url = `${apiUrl}/payment/redeem`

            const payload = {
                taskId: id,
            }

            const reponse = await axios.put(url, payload)

            if (reponse.status === 200) {
                mutate()
                enqueueSnackbar('Task redeemed successfully', {
                    variant: 'success',
                })
            } else {
                // const { data } = reponse
                throw new Error(response?.data.error ?? 'Error redeeming task')
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error redeeming task'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setRedeemLoader(false)
        }
    }

    const handleInitComplete = (item: any) => {
        setActiveItem(item)
        setCompleteModal(true)
    }

    const handleInitPayment = (item: any) => {
        setActiveItem(item)
        setPaymentModal(true)
    }

    const handleSubmitPayment = async (payload: any) => {
        try {
            // console.log(payload)
            const response = await axios.post(`${apiUrl}/payment`, {
                ...payload,
                taskId: activeItem?.id,
            })

            if (response.status === 200) {
                mutate()
                doMutate(`${apiUrl}/task/unpaid-tasks`)
                enqueueSnackbar('Payment added successfully', {
                    variant: 'success',
                })
                setPaymentModal(false)
            } else {
                throw new Error(response.data.error)
            }
        } catch (err: any) {
            console.log(err)
            const msg = err.error || err.message || 'Failed to complete payment'
            enqueueSnackbar(msg, { variant: 'error' })
        }
    }

    return (
        <Paper>
            <GeneralTableToolbar
                isFiltered={isFiltered}
                filterName={filterName}
                onFilterName={handleFilterName}
                onResetFilter={handleResetFilter}
            />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                    <Table
                        size={dense ? 'small' : 'medium'}
                        sx={{ minWidth: 800 }}
                    >
                        <TableHeadCustom
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD.filter((item) => {
                                if (readOnly) {
                                    return item?.id !== 'cancel'
                                }
                                return item
                            })}
                            rowCount={tableData?.length}
                            numSelected={selected?.length}
                            onSort={onSort}
                            onSelectAllRows={(checked: any) =>
                                onSelectAllRows(
                                    checked,
                                    tableData.map((row: any) => row?.id)
                                )
                            }
                        />

                        <TableBody>
                            {dataFiltered
                                ?.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row: any) => (
                                    <TasksTableRow
                                        key={row?.id}
                                        row={row}
                                        readOnly={readOnly}
                                        splitRevenue={splitRevenue}
                                        selected={selected?.includes(row?.id)}
                                        onSelectRow={() => onSelectRow(row?.id)}
                                        onDeleteRow={() =>
                                            handleDeleteRow(row?.id)
                                        }
                                        deleteLoader={deleteLoader}
                                        onEditRow={() => handleUpdate(row)}
                                        handleInitComplete={handleInitComplete}
                                        handleInitPayment={handleInitPayment}
                                        accounts={AC}
                                        handleRedeem={handleRedeem}
                                        redeemLoader={redeemLoader}
                                        mutate={mutate}
                                    />
                                ))}

                            <TableEmptyRows
                                height={denseHeight}
                                emptyRows={emptyRows(
                                    page,
                                    rowsPerPage,
                                    tableData?.length
                                )}
                            />

                            <TableNoData isNotFound={isNotFound} />
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>

            <TaskPaymentModal
                paymentModal={paymentModal}
                setPaymentModal={setPaymentModal}
                handleAddPayment={handleSubmitPayment}
                accounts={AC ?? []}
            />

            <TablePaginationCustom
                count={dataFiltered?.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
            />
            <ConfirmDialog
                open={completeModal}
                onClose={() => {
                    setCompleteModal(false)
                    setActiveItem(null)
                }}
                title="Complete task"
                content={`Complete task for  ${activeItem?.vehicle?.registration} - ${activeItem?.vehicle?.model}`}
                action={
                    <LoadingButton
                        variant="contained"
                        color="info"
                        onClick={handleComplete}
                        loading={completeLoader}
                    >
                        Complete
                    </LoadingButton>
                }
            />
        </Paper>
    )
}

function applyFilter({ inputData, comparator, filterName, filterStatus }: any) {
    const stabilizedThis = inputData?.map((el: any, index: number) => [
        el,
        index,
    ])

    stabilizedThis?.sort((a: any, b: any) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })

    inputData = stabilizedThis?.map((el: any) => el[0])

    const attendees =
        inputData
            ?.map((t: any) => t?.attendants)
            ?.map((a: any) => {
                const names = a?.map((at: any) =>
                    at?.attendant?.name?.toLowerCase()
                )
                return names
            })
            .flat() ?? []

    if (filterName) {
        // console.log(attendees, 'attendees')
        inputData = inputData?.filter((item: any) => {
            const attendants = item?.attendants
                ?.map((a: any) => {
                    return a?.attendant?.name?.toLowerCase()
                })
                .map(
                    (name: any) =>
                        name?.indexOf(filterName?.toLowerCase()) !== -1
                )

            return (
                item?.vehicle?.registration
                    ?.toLowerCase()
                    ?.indexOf(filterName?.toLowerCase()) !== -1 ||
                attendants?.includes(true) ||
                item?.vehicle.model
                    ?.toLowerCase()
                    ?.indexOf(filterName?.toLowerCase()) !== -1
            )
        })
    }

    if (filterStatus !== 'all') {
        inputData = inputData?.filter(
            (user: any) => user?.status === filterStatus
        )
    }

    return inputData
}

export default TasksTable
