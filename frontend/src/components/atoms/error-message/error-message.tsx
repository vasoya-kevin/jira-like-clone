import { cn } from '@/lib/utils';
interface ErrorMessageProps {
    name?: string,
    errors?: Record<string, any>,
    className?: string,
    message?: string
}

const ErrorMessage = ({
    errors = {},
    name,
    className,
    message
}: ErrorMessageProps) => {
    const error = errors?.[name as keyof typeof errors];

    return (
        <p className={cn('text-red-500 font-sans text-xs', className)}>{error?.message ?? message}</p>
    )
}

export default ErrorMessage