import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  detail?: string | string[];
  errors?: Array<{ message?: string }>;
};

export type NormalizedApiError = Error & { status?: number };

const DEFAULT_ERROR_MESSAGE =
  'Unable to complete your request. Please try again.';
const NETWORK_ERROR_MESSAGE =
  'Network error. Check your connection and try again.';
const TIMEOUT_ERROR_MESSAGE = 'Request timed out. Please try again.';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const ensureJsonHeaders = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const headers = (config.headers ?? {}) as AxiosRequestHeaders;
  headers.Accept ??= 'application/json';
  headers['Content-Type'] ??= 'application/json';
  config.headers = headers;
  return config;
};

const extractFirstString = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      if (typeof entry === 'string' && entry.trim()) {
        return entry.trim();
      }
    }
  }

  return undefined;
};

const extractPayloadMessage = (payload: unknown): string | undefined => {
  if (!payload) {
    return undefined;
  }

  if (typeof payload === 'string' && payload.trim()) {
    return payload.trim();
  }

  if (typeof payload !== 'object') {
    return undefined;
  }

  const data = payload as Record<string, unknown>;
  const directKeys: Array<keyof ApiErrorPayload> = [
    'message',
    'error',
    'detail',
  ];

  for (const key of directKeys) {
    const candidate = extractFirstString(data[key]);
    if (candidate) {
      return candidate;
    }
  }

  const errors = data.errors;
  if (Array.isArray(errors)) {
    for (const entry of errors) {
      if (entry && typeof entry === 'object') {
        const message = extractFirstString(
          (entry as Record<string, unknown>).message
        );
        if (message) {
          return message;
        }
      }
    }
  }

  return undefined;
};

export const normalizeError = (error: unknown): NormalizedApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const payloadMessage = extractPayloadMessage(error.response?.data);

    let message = payloadMessage ?? DEFAULT_ERROR_MESSAGE;

    if (error.code === 'ECONNABORTED') {
      message = TIMEOUT_ERROR_MESSAGE;
    } else if (!error.response) {
      message = NETWORK_ERROR_MESSAGE;
    } else if (!payloadMessage && status) {
      message = `Request failed with status ${status}.`;
    }

    const normalized: NormalizedApiError = new Error(message);
    normalized.name = 'ApiError';
    if (status) {
      normalized.status = status;
    }

    return normalized;
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(DEFAULT_ERROR_MESSAGE);
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => ensureJsonHeaders(config),
  (error: AxiosError | Error) => Promise.reject(normalizeError(error))
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError | Error) => Promise.reject(normalizeError(error))
);

export default api;
export { api };
