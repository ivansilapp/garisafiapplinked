import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useDailyAnalytics() {
    const url = `${apiUrl}/reports/daily-analytics`
    const { error, data, mutate } = useSWR(url, { suspense: true })
    return {
        loading: !error && !data,
        error,
        accounts: data ? data.accounts : [],
        complete: data ? data.complete : [],
        ongoing: data ? data.ongoing : 0,
        canceled: data ? data.canceled : 0,
        waitlist: data ? data.waitlist : 0,
        tasks: data ? data.tasks : [],
        expenses: data ? data.expenses : [],
        sales: data ? data.sales : [],
        pigeonholes: data ? data.pigeonholes : [],
        mutate,
    }
}
