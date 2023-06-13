import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function usePrices() {
    const url = `${apiUrl}/pricelist`
    const { error, data, mutate } = useSWR(url, { suspense: true })
    try {
        return {
            loading: !error && !data,
            error,
            prices: data ? data.pricelist : [],
            mutate,
        }
    } catch (err: any) {
        return {
            loading: false,
            error: err?.error ?? err?.message,
            prices: [],
            mutate: false,
        }
    }
}
