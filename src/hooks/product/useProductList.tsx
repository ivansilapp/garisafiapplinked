import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useProductList() {
    const url = `${apiUrl}/product`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        products: data ? data.products : [],
        mutate,
    }
}
