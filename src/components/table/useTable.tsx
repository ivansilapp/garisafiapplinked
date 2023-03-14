import { useState, useCallback } from 'react'

// ----------------------------------------------------------------------

export default function useTable(props: any) {
    const [dense, setDense] = useState(!!props?.defaultDense)

    const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name')

    const [order, setOrder] = useState(props?.defaultOrder || 'asc')

    const [page, setPage] = useState(props?.defaultCurrentPage || 0)

    const [rowsPerPage, setRowsPerPage] = useState(
        props?.defaultRowsPerPage || 5
    )

    const [selected, setSelected] = useState(props?.defaultSelected || [])

    const onSort = useCallback(
        (id: any) => {
            const isAsc = orderBy === id && order === 'asc'
            if (id !== '') {
                setOrder(isAsc ? 'desc' : 'asc')
                setOrderBy(id)
            }
        },
        [order, orderBy]
    )

    const onSelectRow = useCallback(
        (id: any) => {
            const selectedIndex = selected.indexOf(id)

            let newSelected: any[] = []

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, id)
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1))
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1))
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1)
                )
            }
            setSelected(newSelected)
        },
        [selected]
    )

    const onSelectAllRows = useCallback((checked: any, newSelecteds: any) => {
        if (checked) {
            setSelected(newSelecteds)
            return
        }
        setSelected([])
    }, [])

    const onChangePage = useCallback((event: any, newPage: any) => {
        setPage(newPage)
    }, [])

    const onChangeRowsPerPage = useCallback((event: any) => {
        setPage(0)
        setRowsPerPage(parseInt(event.target.value, 10))
    }, [])

    const onChangeDense = useCallback((event: any) => {
        setDense(event.target.checked)
    }, [])

    return {
        dense,
        order,
        page,
        orderBy,
        rowsPerPage,
        //
        selected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangePage,
        onChangeDense,
        onChangeRowsPerPage,
        //
        setPage,
        setDense,
        setOrder,
        setOrderBy,
        setSelected,
        setRowsPerPage,
    }
}
