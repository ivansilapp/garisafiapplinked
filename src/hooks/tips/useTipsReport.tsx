import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useTipsReport({ query }: { query: string }) {
    // if (!query) {
    //     throw new Error('query is required')
    // }
    const url = `${apiUrl}/task/tips-report?${query}`
    // console.log(url, 'url')
    const { error, data, mutate } = useSWR(url, { suspense: true })

    // console.log(data)

    return {
        loading: !error && !data,
        error,
        tips: data ? data.tips : [],
        mutate,
    }
}
