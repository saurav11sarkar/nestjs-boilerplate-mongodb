import { IFilterParams } from './pick';

const buildWhereConditions = (
  params: IFilterParams,
  searchAbleFields: string[] = [],
  extraConditions: Record<string, unknown> = {},
) => {
  const { searchTerm, ...filterData } = params;
  const andConditions: any[] = [];

  if (searchTerm && searchAbleFields.length > 0) {
    andConditions.push({
      $or: searchAbleFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  if (Object.keys(extraConditions).length > 0) {
    andConditions.push(extraConditions);
  }

  return andConditions.length > 0 ? { $and: andConditions } : {};
};

export default buildWhereConditions;
