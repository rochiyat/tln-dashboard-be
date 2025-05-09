export function returnSuccess(message: string, data: any) {
  return {
    status: 'OK',
    message,
    data,
  };
}
