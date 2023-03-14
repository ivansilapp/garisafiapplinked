import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function usePrice({ id }: { id: string }) {
    const url = `${apiUrl}/pricelist/${id}`

    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        price: data ? data.price : [],
        mutate,
    }
}
