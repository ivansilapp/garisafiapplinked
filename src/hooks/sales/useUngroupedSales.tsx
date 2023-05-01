import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useUngroupedSales({ date }: { date: string }) {
    if (!date) {
        throw new Error('Date is required')
    }
    // /report/grouped-sales?${query}
    const url = `${apiUrl}/report/ungrouped-sales?startDate=${date}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        sales: data ? data.sales : [],
        mutate,
    }
}
