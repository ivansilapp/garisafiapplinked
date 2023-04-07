import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useTaskByStatus({ status }: { status: string }) {
    if (!status) {
        throw new Error('Status is required')
    }
    const url = `${apiUrl}/task/filter/${status}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        tasks: data ? data.tasks : [],
        mutate,
    }
}
