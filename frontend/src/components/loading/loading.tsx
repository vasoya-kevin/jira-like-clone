import { Spinner } from '../ui/spinner'
import clsx from 'clsx'

interface LoadingProps {
    // loading: boolean,
    className?: string
    message: string
}

const LoadingComponent = ({ message, className }: LoadingProps) => {
    {
        return (
            <section className={clsx('min-h-[calc(100vh-64px)] w-full h-full bg-muted/30 px-6 py-10 flex justify-center items-center gap-2', className)}>
                <Spinner />
                <p>{message}</p>
            </section>
        )
    }

}

export default LoadingComponent