import { useState } from 'react';
import axios, { AxiosError } from 'axios';

import { isObject } from '../types/main';

type CustomError = {
  message: string;
};

type ServiceError = {
  errors: CustomError[];
};

type CompleteAxiosError<T = any> = Required<
  Pick<AxiosError<T>, 'response' | 'isAxiosError'>
>;

type ServiceResponse<T> = {
  data: T;
};

function isCustomError(a: unknown): a is CustomError {
  return isObject(a) && typeof (a as CustomError).message === 'string';
}

function isCompleteAxiosError(err: unknown): err is CompleteAxiosError {
  return (
    isObject(err) &&
    (err as CompleteAxiosError).isAxiosError === true &&
    isObject((err as CompleteAxiosError).response)
  );
}

function isServiceError(
  err: CompleteAxiosError,
): err is CompleteAxiosError<ServiceError> {
  const errors = err.response.data?.errors;

  return (
    Array.isArray(errors) && (errors as CustomError[]).every(isCustomError)
  );
}

function isAxiosServiceError(
  err: unknown,
): err is CompleteAxiosError<ServiceError> {
  return isCompleteAxiosError(err) && isServiceError(err);
}

// function isAxiosServiceResponse(response: unknown): response is  {

// }

type Method = 'get' | 'post';

type useRequestArgs = {
  url: string;
  method: Method;
  body: object;
  onSuccess?(data: unknown): void;
};

function getErrorElement(errors: CustomError[]) {
  if (errors.length > 0)
    return (
      <div className="alert alert-danger">
        <h4>Oops...</h4>
        <ul className="my-0">
          {errors.map((err) => (
            <li key={err.message}>{err.message}</li>
          ))}
        </ul>
      </div>
    );
  return null;
}

export default function useRequest<T>({
  url,
  method,
  body,
  onSuccess,
}: useRequestArgs) {
  const [error, setError] = useState<JSX.Element | null>(null);

  const doRequest = async (props = {}) => {
    try {
      const response = await (method === 'get'
        ? axios.get(url, { ...body, ...props })
        : axios.post(url, { ...body, ...props }));

      setError(null);
      if (onSuccess) onSuccess(response.data);

      return response.data;
    } catch (err: unknown) {
      // Note, we're swallowing all other errors, which could be improved
      if (isAxiosServiceError(err)) {
        const { errors } = err.response.data;
        const errorElement = getErrorElement(errors);
        setError(errorElement);
      }
    }
  };

  return { doRequest, error };
}
