import { SortOrder } from 'mongoose';

export interface IOptions {
  page?: number;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: string;
}

interface IPaginationResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
}

const paginationHelper = (options: IOptions): IPaginationResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder: SortOrder = options.sortOrder === 'asc' ? 'asc' : 'desc';
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationHelper;
