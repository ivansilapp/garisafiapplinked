/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import { Card, Table, TableBody, TableContainer } from '@mui/material'

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
import GroupedTasksTableRow from './GroupedTasksTableRow'
import axios from '../../../utils/axios'
import { useSnackbar } from '../../../components/snackbar'

const TABLE_HEAD = [
    { id: 'CreatedAt', label: 'Task date', align: 'left' },
    { id: 'cost', label: 'Total tasks', align: 'left' },
    { id: 'total', label: 'Number of tasks', align: 'left' },
    { id: 'more', label: 'More', align: 'left' },
    { id: '' },
]

function GroupedTasksTable({ data }: any) {
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
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

    const [openConfirm, setOpenConfirm] = useState(false)

    const [filterName, setFilterName] = useState('')

    const [filterRole, setFilterRole] = useState('all')

    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        setTableData(data)
    }, [data])

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
    })

    const isFiltered =
        filterName !== '' || filterRole !== 'all' || filterStatus !== 'all'

    const dataInPage = dataFiltered?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    )

    const denseHeight = dense ? 52 : 72

    const isNotFound =
        (!dataFiltered?.length && !!filterName) ||
        (!dataFiltered?.length && !!filterRole) ||
        (!dataFiltered?.length && !!filterStatus)

    const handleFilterName = (event: any) => {
        setPage(0)
        setFilterName(event.target.value)
    }

    const handleResetFilter = () => {
        setFilterName('')
        setFilterRole('all')
        setFilterStatus('all')
    }

    return (
        <Card>
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
                            headLabel={TABLE_HEAD}
                            rowCount={tableData?.length}
                            numSelected={selected?.length}
                            onSort={onSort}
                            onSelectAllRows={(checked: any) =>
                                onSelectAllRows(
                                    checked,
                                    tableData?.map((row: any) => row.id)
                                )
                            }
                        />

                        <TableBody>
                            {dataFiltered
                                ?.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                ?.map((row: any) => (
                                    <GroupedTasksTableRow
                                        key={row.created_at}
                                        row={row}
                                        selected={selected.includes(row.id)}
                                        onSelectRow={() => onSelectRow(row.id)}
                                        onDeleteRow={() => {}}
                                        deleteLoader={deleteLoader}
                                        onEditRow={() => {}}
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
        </Card>
    )
}

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterStatus,
    filterRole,
}: any) {
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

    if (filterName) {
        inputData = inputData.filter(
            (user: any) =>
                user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        )
    }

    if (filterStatus !== 'all') {
        inputData = inputData.filter(
            (user: any) => user.status === filterStatus
        )
    }

    if (filterRole !== 'all') {
        inputData = inputData.filter((user: any) => user.role === filterRole)
    }

    return inputData
}

export default GroupedTasksTable
