'use strict';

const useDebouncer = (callback: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    // Handle invalid delay values
    const validDelay = typeof delay === 'number' && delay > 0 ? delay : 0;

    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, validDelay);
    };
};

export { useDebouncer };
