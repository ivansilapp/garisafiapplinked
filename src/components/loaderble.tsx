import { LazyExoticComponent, Suspense } from 'react'
import LoadingScreen from './loading-screen'

// eslint-disable-next-line react/display-name, react/function-component-definition
const Loadable = (Component: LazyExoticComponent<() => JSX.Element>) =>
    // eslint-disable-next-line react/display-name
    function (props: any) {
        return (
            <Suspense fallback={<LoadingScreen />}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...props} />
            </Suspense>
        )
    }
export default Loadable
