import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useTaskList() {
    const url = `${apiUrl}/task`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        task: data ? data.task : [],
        mutate,
    }
}
