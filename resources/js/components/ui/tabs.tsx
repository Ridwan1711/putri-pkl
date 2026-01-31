import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
    const ctx = React.useContext(TabsContext);
    if (!ctx) {
        throw new Error('Tabs components must be used within Tabs.');
    }
    return ctx;
}

interface TabsProps extends React.ComponentProps<'div'> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}

function Tabs({
    value: valueProp,
    defaultValue = '',
    onValueChange,
    className,
    children,
    ...props
}: TabsProps) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolledValue;

    const handleValueChange = React.useCallback(
        (v: string) => {
            if (!isControlled) {
                setUncontrolledValue(v);
            }
            onValueChange?.(v);
        },
        [isControlled, onValueChange]
    );

    const context = React.useMemo(
        () => ({ value, onValueChange: handleValueChange }),
        [value, handleValueChange]
    );

    return (
        <TabsContext.Provider value={context}>
            <div data-slot="tabs" className={cn('w-full', className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="tabs-list"
            role="tablist"
            className={cn(
                'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
                className
            )}
            {...props}
        />
    );
}

interface TabsTriggerProps extends React.ComponentProps<'button'> {
    value: string;
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
    const { value: selectedValue, onValueChange } = useTabs();
    const isSelected = selectedValue === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isSelected}
            data-state={isSelected ? 'active' : 'inactive'}
            data-slot="tabs-trigger"
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                isSelected
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:bg-background/50 hover:text-foreground',
                className
            )}
            onClick={() => onValueChange(value)}
            {...props}
        >
            {children}
        </button>
    );
}

interface TabsContentProps extends React.ComponentProps<'div'> {
    value: string;
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
    const { value: selectedValue } = useTabs();
    if (selectedValue !== value) {
        return null;
    }
    return (
        <div
            data-slot="tabs-content"
            role="tabpanel"
            data-state="active"
            className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
