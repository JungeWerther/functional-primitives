# functional-primitives
Helper functions for functional style in typescript

## Overview
This library provides a collection of functional programming primitives and utilities for TypeScript, enabling more expressive and composable code. It includes tools for error handling, data transformation, and functional programming patterns.

<!-- ## Installation

```bash
npm install functional-primitives
# or
yarn add functional-primitives
``` -->

## Core Concepts

### Result Types
The library uses a `BaseResponse<T>` type that handles both successful results and errors in a functional way:

```ts
type BaseResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: SerializableError;
}
```

### Key Features

#### Error Handling
- `Result<T>` - Constructor for successful results
- `Error<T>` - Constructor for error results
- `serializeError` - Serializes errors for client-server communication
- `withResult` / `withError` - Transform success/error cases
- `withAsyncResult` - Async version of withResult for Promise-based operations

#### Function Composition
- `compose` - Compose two functions
- `curry` / `uncurry` - Convert between curried and uncurried functions
- `ID` - Identity function
- `effect` - Create side effects while preserving data flow

#### Array Operations
- `map` - Curried version of Array.map
- `reduce` - Curried version of Array.reduce
- `flatten` - Flatten array of BaseResponse into single BaseResponse
- `partition` - Split array into two based on predicate
- `append` / `appendTo` - Add elements to arrays

#### Tuple Operations
- `Fst` / `Snd` - Get first/second elements of tuples
- `withFst` / `withSnd` - Transform first/second elements
- `binaryReduct` - Create reducers operating on tuple elements
- `projection` - Work with function operating on tuples

#### Predicates & Filtering
- `equals` - Curried equality check
- `containedBy` - Check if element exists in array
- `filterCondition` - Conditional filtering
- `choose` - Branch based on predicate
- `invert` - Negate boolean values

## Usage Examples

Error handling:
```ts
const result = await someOperation()
  .then(withResult(data => transform(data)))
  .then(withError(err => ({ ...err, hint: 'Try again' })));
```

Data transformation:
```ts
const numbers = [1,2,3,4];
const [evens, odds] = partition(numbers, n => n % 2 === 0);
```

Function composition:
```ts
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const addOneAndDouble = compose(double, addOne);
```


## Types

The library provides several useful type definitions:

- `Implies<T,U>` - Function type from T to U
- `Product<T,U>` - Tuple type [T,U]
- `Predicate<T>` - Boolean function on T
- `SerializableError` - Error type safe for serialization
- `BaseResponse<T>` - Result type handling success/failure
- `Double<T>` - Tuple type [T,T]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
