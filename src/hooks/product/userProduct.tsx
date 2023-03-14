import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useProduct({ id }: { id: string | number }) {
    const url = `${apiUrl}/product/${id}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        product: data ? data.product : [],
        mutate,
    }
}
