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
} from '../../../components/table'
import Scrollbar from '../../../components/scrollbar'
import UserRightsTableRow from './UserRightsTableRow'
// import axios from '../../../utils/axios'
import { useSnackbar } from '../../../components/snackbar'
import http from '../../../utils/axios'
import { apiUrl } from '../../../config-global'

const TABLE_HEAD = [
    { id: 'name', label: 'Module', align: 'left' },
    { id: 'read', label: 'Read', align: 'left' },
    { id: 'write', label: 'Write', align: 'left' },
    { id: 'update', label: 'Update', align: 'left' },
    { id: 'delete', label: 'Delete', align: 'left' },
]

function UserRightsTable({ data, userId, rights, mutate }: any) {
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        //
        selected,
        onSelectAllRows,
        onSort,
    } = useTable({})

    const { enqueueSnackbar } = useSnackbar()
    const [loader, setLoader] = useState(false)

    const [tableData, setTableData] = useState(data ?? [])

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

    const denseHeight = dense ? 52 : 72

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterRole) ||
        (!dataFiltered.length && !!filterStatus)

    const handleUpdate = async ({
        id,
        field,
        value,
    }: {
        id: number
        field: string
        value: boolean
    }) => {
        try {
            const payload = {
                moduleId: id,
                field,
                value,
                userId: Number(userId),
            }
            const response = await http.put(
                `${apiUrl}/user-right-update`,
                payload
            )
            if (response.status === 200) {
                enqueueSnackbar('Updated', { variant: 'success' })
                mutate()
            } else {
                throw new Error(
                    response?.data?.error ?? 'failed to update right'
                )
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Error updating right'

            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setLoader(false)
        }
    }

    return (
        <Card>
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
                            rowCount={tableData.length}
                            numSelected={selected.length}
                            onSort={onSort}
                            onSelectAllRows={(checked: any) =>
                                onSelectAllRows(
                                    checked,
                                    tableData.map((row: any) => row.id)
                                )
                            }
                        />

                        <TableBody>
                            {dataFiltered
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row: any) => (
                                    <UserRightsTableRow
                                        key={row.name}
                                        row={row}
                                        rights={rights}
                                        selected={selected.includes(row.id)}
                                        handleUpdate={handleUpdate}
                                    />
                                ))}

                            <TableEmptyRows
                                height={denseHeight}
                                emptyRows={emptyRows(
                                    page,
                                    rowsPerPage,
                                    tableData.length
                                )}
                            />

                            <TableNoData isNotFound={isNotFound} />
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>
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
    const stabilizedThis = inputData.map((el: any, index: number) => [
        el,
        index,
    ])

    stabilizedThis.sort((a: any, b: any) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })

    inputData = stabilizedThis.map((el: any) => el[0])

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

export default UserRightsTable
