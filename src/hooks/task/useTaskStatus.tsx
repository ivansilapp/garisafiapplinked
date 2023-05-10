import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useTaskByStatus({ query }: { query: string }) {
    if (!query) {
        throw new Error('Status is required')
    }
    const url = `${apiUrl}/task/filter?${query}`
    // console.log(url, 'url')
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        tasks: data ? data.tasks : [],
        mutate,
    }
}
