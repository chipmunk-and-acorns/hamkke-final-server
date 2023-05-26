export const typeGuard = <T>(data: any, key: string): data is T => {
  return key in data;
};
