import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useTopAttendants() {
    const url = `${apiUrl}/report/top-attendants`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        attendants: data ? data.attendants : [],
        revenue: data ? data.revenue : null,
        expenses: data ? data.expenses : null,
        annualReport: data ? data.annualReport : null,
        mutate,
    }
}
