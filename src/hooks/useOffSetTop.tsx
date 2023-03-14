import { useScroll } from 'framer-motion'
import { useState, useEffect } from 'react'

// ----------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/default-param-last
export default function useOffSetTop(top = 100, options: any) {
    const { scrollY } = useScroll(options)

    const [value, setValue] = useState(false)

    useEffect(
        () =>
            scrollY.on('change', (scrollHeight) => {
                if (scrollHeight > top) {
                    setValue(true)
                } else {
                    setValue(false)
                }
            }),
        [scrollY, top]
    )

    return value
}

// Usage
// const offset = useOffSetTop(100);

// Or
// const offset = useOffSetTop(100, {
//   container: ref,
// });
