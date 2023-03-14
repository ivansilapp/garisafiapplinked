import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useTask({ id }: { id: string | number }) {
    const url = `${apiUrl}/task/${id}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        task: data ? data.task : [],
        mutate,
    }
}
