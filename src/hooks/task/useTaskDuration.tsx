import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useTaskDuration({ date }: { date: string }) {
    if (!date) {
        throw new Error('Please provide a date')
    }
    const url = `${apiUrl}/report/duration-tasks?${date}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        tasks: data ? data.tasks : [],
        mutate,
    }
}
