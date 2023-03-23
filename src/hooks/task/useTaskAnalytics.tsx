import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useTaskAnalytics() {
    const url = `${apiUrl}/task/day/analytics`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    const info: any = {
        waitlist: [],
        completed: [],
        ongoing: [],
        cancelled: [],
        pending: [],
    }

    if (data) {
        info.waitlist = data.waitlist
        info.complete = data.complete
        info.ongoing = data.ongoing
        info.cancelled = data.cancelled
        info.pending = data.pending
    }

    return {
        loading: !error && !data,
        error,
        mutate,
        info,
    }
}
