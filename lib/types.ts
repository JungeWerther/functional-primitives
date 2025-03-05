export type Implies<T, U> = (value: T) => U;
export type Product<T, U> = [T, U];
export type Predicate<T> = Implies<T, boolean>;

export type SerializableError = {
  name: string;
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

export type BaseResponse<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: SerializableError;
    };

export type Double<T> = [T, T];
