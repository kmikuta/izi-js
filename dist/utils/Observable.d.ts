export declare class Observable {
    private _listeners;
    addListener(type: string, fn: Function, scope?: any): void;
    removeListener(type: string, fn: Function, scope?: any): void;
    dispatchEvent(type: string, ...args: any[]): void;
    private _findListeners(type);
}
