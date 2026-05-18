export interface IFilterParams {
  searchTerm?: string;
  [key: string]: any;
}

const pick = <T, K extends keyof T>(obj: T, keys: K[]): Partial<T> => {
  const filterObj: Partial<T> = {};

  for (const key of keys) {
    if (key && Object.prototype.hasOwnProperty.call(obj, key)) {
      filterObj[key] = obj[key];
    }
  }
  return filterObj;
};

export default pick;
