import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useOpenTasks() {
    const url = `${apiUrl}/task/open`
    // console.log(url, 'url')
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        tasks: data ? data.tasks : [],
        mutate,
    }
}
