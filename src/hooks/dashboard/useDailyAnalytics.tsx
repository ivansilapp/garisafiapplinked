import useSWR from 'swr'
import { apiUrl } from '../../config-global'

interface IUseDailyAnalytics {
    query: string
}

export default function useDailyAnalytics({ query }: IUseDailyAnalytics) {
    const url = `${apiUrl}/reports/daily-analytics?${query}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    // console.log(data.tasks, 'd t')
    return {
        loading: !error && !data,
        error,
        accounts: data ? data.accounts : [],
        complete: data ? data.complete : [],
        ongoing: data ? data.ongoing : 0,
        cancelled: data ? data.cancelled : 0,
        waitlist: data ? data.waitlist : 0,
        tasks: data ? data?.tasks?.results : [],
        todayTasks: data ? data?.tasks?.today : null,
        freeWashes: data ? data.freeWashes : [],
        expenses: data ? data.expenses : [],
        sales: data ? data.sales : [],
        pigeonholes: data ? data.pigeonholes : [],
        payments: data ? data.payments : [],
        mutate,
    }
}
