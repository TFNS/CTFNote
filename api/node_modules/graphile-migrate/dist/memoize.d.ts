export default function memoize<T extends (...args: Array<any>) => any>(fn: T): (...funcArgs: Parameters<T>) => ReturnType<T>;
