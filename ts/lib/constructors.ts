import { BaseResponse, SerializableError } from "./types";

export const baseError: SerializableError = {
  name: "Unknown error",
  message: "Unknown error",
};

export const Result = <T>(data: T): BaseResponse<T> => ({
  data,
  error: null,
});

export const Error = <T>(error?: Error | null): BaseResponse<T> => ({
  data: null,
  error: error ? serializeError(error) : baseError,
});

/**
 * Serializes an error such that it may be passed from server to client (note to self: never use React again)
 * @param error
 * @returns
 */
export const serializeError: (
  error: Error | SerializableError,
) => SerializableError = (error) => ({
  ...error,
  name: error.name,
  message: error.message,
});
