import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useExpense({ queryString }: { queryString: string }) {
    const url = `${apiUrl}/report/expenses-report?${queryString}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        expenses: data ? data.expenses : null,
        mutate,
    }
}
