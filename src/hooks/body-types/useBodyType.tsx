import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useBodyType({ id }: { id: string }) {
    const url = `${apiUrl}/body-type/${id}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        users: data ? data.bodyTypes : [],
        mutate,
    }
}
