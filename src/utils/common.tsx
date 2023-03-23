// eslint-disable-next-line import/prefer-default-export
export const computeTaskTotals = (tasks: any[]) => {
    if (!tasks) return 0
    const total = tasks?.reduce((acc: any, curr: any) => {
        return acc + curr.cost
    }, 0)

    return total
}
