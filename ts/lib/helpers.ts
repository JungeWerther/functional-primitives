import {
  BaseResponse,
  Double,
  Implies,
  Predicate,
  Product,
  SerializableError,
} from "./types";
import { Result, Error, serializeError } from "./constructors";

export const ID = <T>(x: T): T => x;

export const hLog =
  (name: string) =>
  (...messages: any[]) => {
    console.log("[", name, "]", ...messages);
  };

export const invert = (bool: boolean) => !bool;
export const asList = <T>(xs?: T[] | null) => xs || [];

export const onResult =
  <T, E>(onData: (data: T) => any, onError: (error: E) => any) =>
  ({ data, error }: { data?: T; error?: E }) => {
    data && onData(data);
    error && onError(error);
  };

export const compose =
  <A, B, C>(f: (b: B) => C, g: (a: A) => B) =>
  (a: A) =>
    f(g(a));

/**
 * Creates a new array with the results of calling a provided function on every element in the array.
 * Returns a curried function.
 *
 * @param f - Function to execute on each element of the array
 * @returns A curried function that takes an array and returns a new array with the results of executing f on each element
 */
export const map: <T, U>(f: (data: T) => U) => (data: T[]) => U[] =
  (f) => (data) =>
    data.map(f);

export const reduce: <T, U>(
  f: (acc: U, data: T) => U,
  initial: U,
) => (data: T[]) => U = (f, initial) => (data) => data.reduce(f, initial);

/**
 * Flattens an array of BaseResponse<T> into a single BaseResponse<T[]>.
 * Combines data from successful responses into an array and propagates any errors.
 *
 * @template T - The type of data contained in the BaseResponse
 * @param data - Array of BaseResponse objects to flatten
 * @returns A single BaseResponse containing an array of data or an error
 */
export const flatten: <T>(data: BaseResponse<T>[]) => BaseResponse<T[]> = ([
  { data, error },
  ...xs
]) => {
  const child = flatten(xs);
  return data
    ? Result([data, ...asList(child.data)])
    : Error(error || child.error);
};

/**
 * Higher order function that manipulates the data returned by a `BaseResponse` by applying a callback function to it, while keeping `error` as is.
 *
 * Example:
 *
 * `table.get("id").then(withResult(data => data.id))`
 * @param callback
 * @returns
 */
export const withResult: <T, U>(
  callback: (data: T) => U,
) => (response: BaseResponse<T>) => BaseResponse<U> =
  (callback) =>
  ({ data, error }) =>
    data ? Result(callback(data)) : Error(error);

/**
 * Higher order function that manipulates the error returned by a `BaseResponse` by applying a callback function to it, while keeping `data` as is.
 *
 * Example:
 *
 * `table.get("id").then(withError(error => error.message))`
 * @param callback
 * @returns
 */
export const withError: <T>(
  callback: (error: SerializableError) => any,
) => (response: BaseResponse<T>) => BaseResponse<T> =
  (callback) =>
  ({ data, error }) =>
    error ? Error(callback(error)) : Result(data);

/**
 * Is to `withResult` in the way that flatMap is to map.
 * @param callback
 * @returns
 */
export const withAsyncResult: <T, U>(
  callback: (data: T) => Promise<BaseResponse<U>>,
) => (response: BaseResponse<T>) => Promise<BaseResponse<U>> =
  (callback) =>
  ({ data, error }) =>
    data ? callback(data) : Promise.resolve(Error(error));

/**
 * Creates an effect that takes a callback function and data input, executes the callback
 * with the data, and returns the original data for chaining operations. This allows
 * for side effects (like logging) without modifying the data flow.
 *
 * @param callback A function that takes data as input and performs a side effect
 * @returns A function that accepts data, executes the callback, and returns the data unchanged
 */
export const effect: <T>(callback: (data: T) => void) => (data: T) => T =
  (callback) => (data) => (callback(data), data);

// -----------------------------
// filters
// -
//

/**
 * Checks a condition on a value if it exists, otherwise returns true.
 *
 * @param value The value to check the condition on
 * @param callback Function that evaluates the condition
 * @returns True if value is falsy or if callback returns true, false otherwise
 */
export const filterCondition: <T>(
  value: T,
  predicate: Predicate<T>,
) => boolean = (value, predicate) => (value ? predicate(value) : true);

/**
 * Creates a curried function that checks if two values are strictly equal.
 * @param a The first value to compare
 * @returns A function that takes a second value and returns true if it equals the first value
 */
export const equals: <T>(a: T) => (b: T) => boolean = (a) => (b) => a === b;

/**
 * Creates a curried function that checks if a value is contained within an array.
 * @param a The array to check within
 * @returns A function that takes a value and returns true if it exists in the array
 */
export const containedBy: <T>(a: T[]) => (b: T) => boolean = (a) => (b) =>
  a.includes(b);

export const choose: <T, U, V>(
  predicate: Predicate<T>,
  f: Implies<T, U>,
  g: Implies<T, V>,
) => Implies<T, U | V> = (predicate, f, g) => (x) =>
  predicate(x) ? f(x) : g(x);

export const curry: <T, U, V>(f: (a: T, b: U) => V) => (a: T) => (b: U) => V =
  (f) => (a) => (b) =>
    f(a, b);

export const uncurry: <T, U, V>(
  f: (a: T) => (b: U) => V,
) => (a: T, b: U) => V = (f) => (a, b) => f(a)(b);

//-------------
// tuple/list operations
// ------------

export const append =
  <T>(value: T) =>
  (arr: T[]) => [...arr, value];

export const appendTo =
  <T>(arr: T[]) =>
  (value: T) => [...arr, value];

export const projection: <T, U, V>(
  f: Implies<Product<T, U>, V>,
) => (y: T, z: U) => V = (f) => (y, z) => f([y, z]);

export const Fst: <T, U>(x: Product<T, U>) => T = ([fst, _]) => fst;
export const Snd: <T, U>(x: Product<T, U>) => U = ([_, snd]) => snd;

export const withFst: <T, M>(
  callback: Implies<T, M>,
) => <U>(x: [T, U]) => [M, U] =
  (callback) =>
  ([fst, snd]) => [callback(fst), snd];

export const withSnd: <U, M>(
  callback: Implies<U, M>,
) => <T>(x: [T, U]) => [T, M] =
  (callback) =>
  ([fst, snd]) => [fst, callback(snd)];

/**
 * Creates a reducer function that applies a transformation to either the first or second element
 * of a tuple based on a predicate.
 *
 * @param predicate Function that determines which element to transform
 * @param f Function parametrized by the `cur`(-rent) value, to be applied to either side of the `acc`(-c)
 * @returns A reducer function that takes a tuple and current value and returns transformed tuple
 */
export const binaryReduct: <T, U, V>(
  predicate: Predicate<T>,
  f: (cur: T) => Implies<U, V>,
) => (acc: Product<U, U>, cur: T) => Product<U, V> | Product<V, U> =
  (predicate, f) => (acc, cur) =>
    predicate(cur) ? withFst(f(cur))(acc) : withSnd(f(cur))(acc);

export const appendReduct: <T>(
  predicate: Predicate<T>,
) => (x: Product<T[], T[]>, cur: T) => Product<T[], T[]> = (predicate) =>
  binaryReduct(predicate, append);

/**
 * Partitions an array into two arrays based on a predicate function.
 *
 * @param items Array to partition
 * @param predicate Function that returns true for elements that should go in first array, false for second array
 * @returns A tuple of two arrays - first containing elements where predicate is true, second where false
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const [evens, odds] = partition(numbers, n => n % 2 === 0);
 * // evens: [2, 4]
 * // odds: [1, 3, 5]
 */
export const partition: <T>(
  items: T[],
  predicate: Predicate<T>,
) => [T[], T[]] = (items, predicate) =>
  items.reduce(appendReduct(predicate), [[], []]);
