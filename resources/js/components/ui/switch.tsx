import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<React.ComponentProps<'button'>, 'onChange'> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

function Switch({
    className,
    checked,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    id,
    ...props
}: SwitchProps) {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : uncontrolledChecked;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick?.(e);
        if (disabled) return;
        const next = !isChecked;
        if (!isControlled) setUncontrolledChecked(next);
        onCheckedChange?.(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        props.onKeyDown?.(e);
        if (disabled) return;
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            const next = !isChecked;
            if (!isControlled) setUncontrolledChecked(next);
            onCheckedChange?.(next);
        }
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            aria-disabled={disabled}
            data-state={isChecked ? 'checked' : 'unchecked'}
            data-slot="switch"
            disabled={disabled}
            id={id}
            className={cn(
                'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
                isChecked ? 'bg-primary' : 'bg-input',
                className
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            {...props}
        >
            <span
                data-slot="switch-thumb"
                className={cn(
                    'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
                    isChecked ? 'translate-x-5' : 'translate-x-0.5'
                )}
            />
        </button>
    );
}

export { Switch };
