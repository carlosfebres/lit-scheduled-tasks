// awaity.d.ts

/* eslint-disable import/prefer-default-export */
type Resolvable<R> = R | PromiseLike<R>;
type IterateFunction<T, R> = (item: T, index: number, arrayLength: number) => Resolvable<R>;
type ResolvableProps<T> = object & { [K in keyof T]: Resolvable<T[K]> };

// Awaity ships no types.  So we will shim them. :sad_panda:
declare module 'awaity' {
  export function all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
  export function any<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
  // Map
  export function props<K, V>(map: Resolvable<Map<K, Resolvable<V>>>): Promise<Map<K, V>>;
  // trusted promise for object
  export function props<T>(object: PromiseLike<ResolvableProps<T>>): Promise<T>;
  // object
  export function props<T>(object: ResolvableProps<T>): Promise<T>;
  export function race<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
  export function each<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
  export function filter<R, U>(
    values: Resolvable<Iterable<Resolvable<R>>>,
    mapper: IterateFunction<R, U>
  ): Promise<Awaited<U>[]>;
  export function filterLimit<R, U>(
    values: Resolvable<Iterable<Resolvable<R>>>,
    mapper: IterateFunction<R, U>,
    concurrent?: number
  ): Promise<Awaited<U>[]>;
  export function map<R, U>(
    values: Resolvable<Iterable<Resolvable<R>>>,
    mapper: IterateFunction<R, U>
  ): Promise<Awaited<U>[]>;
  export function mapLimit<R, U>(
    values: Resolvable<Iterable<Resolvable<R>>>,
    mapper: IterateFunction<R, U>,
    concurrent?: number
  ): Promise<Awaited<U>[]>;
  export function mapSeries<R, U>(
    values: Resolvable<Iterable<Resolvable<R>>>,
    mapper: IterateFunction<R, U>
  ): Promise<Awaited<U>[]>;
  export function reduce<R, U>(
    values: Resolvable<Iterable<Resolvable<R>>>,
    reducer: (total: U, current: R, index: number, arrayLength: number) => Resolvable<U>,
    initialValue?: Resolvable<U>
  ): Promise<U>;
  export function some<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
  // This type is gnarly. :)
  // export function flow<T>(): Promise<[T]>;
}
