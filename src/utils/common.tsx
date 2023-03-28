// eslint-disable-next-line import/prefer-default-export
export const computeTaskTotals = (tasks: any[]) => {
    if (!tasks) return 0
    const total = tasks?.reduce((acc: any, curr: any) => {
        return acc + curr.cost
    }, 0)

    return total
}

export const computeCommisionTotals = (commisions: any[]) => {
    if (!commisions) return 0
    const total = commisions?.reduce((acc: any, curr: any) => {
        return acc + curr.amount
    }, 0)

    return total
}

export const computeTaskTotalsByStatus = (tasks: any[], status: string) => {
    if (!tasks) return 0

    const total = tasks?.reduce((acc: any, curr: any) => {
        if (curr.status === status || status === 'all') {
            return acc + curr.cost
        }
        return acc
    }, 0)

    return total
}

export const computeUpaidTasks = (tasks: any[]) => {
    if (!tasks) return 0

    const total = tasks?.reduce((acc: any, curr: any) => {
        if (curr.paid === false) {
            return acc + curr.cost
        }
        return acc
    }, 0)

    return total
}
