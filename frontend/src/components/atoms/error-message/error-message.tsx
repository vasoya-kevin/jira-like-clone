import { cn } from '@/lib/utils';
import React from 'react';

interface ErrorMessageProps {
    name: string,
    errors: Record<string, any>,
    className?: string
}

const ErrorMessage = ({
    errors,
    name,
    className
}: ErrorMessageProps) => {
    const error = errors[name as keyof typeof errors];

    return (
        <p className={cn('text-red-500 font-sans text-xs', className)}>{error?.message}</p>
    )
}

export default ErrorMessage