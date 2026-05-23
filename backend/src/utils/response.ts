export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export function success<T>(data?: T, message: string = 'success'): ApiResponse<T> {
  return {
    code: 200,
    message,
    data,
  };
}

export function error(message: string, code: number = 500): ApiResponse {
  return {
    code,
    message,
  };
}
