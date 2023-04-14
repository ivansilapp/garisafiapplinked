import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useUnpaidTasks() {
    const url = `${apiUrl}/task/unpaid-tasks`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        tasks: data ? data.tasks : [],
        mutate,
    }
}
