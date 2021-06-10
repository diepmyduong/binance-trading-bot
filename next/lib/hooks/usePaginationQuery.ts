import { useEffect, useRef, useState } from "react";
import { CrudRepository, Pagination, QueryInput } from "../repo/crud.repo";

export type PaginationQueryProps<T> = {
  items?: T[];
  pagination?: Pagination;
  loadAll?: (query?: QueryInput) => Promise<T[]>;
  create?: (data: T) => Promise<T>;
  update?: (id: string, data: T) => Promise<T>;
  deleteOne?: (id: string) => Promise<any>;
};
export function usePaginationQuery<T>(
  service: CrudRepository<T>,
  listState?: [T[], any],
  query: QueryInput = {},
  fragment?: string
) {
  const [items, setItems] = listState || useState<T[]>();
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    offset: 1,
    page: 1,
    limit: 10,
  });
  const queryRef = useRef<QueryInput>({
    page: 1,
    limit: 10,
    ...query,
  });
  const loadAll = (query: QueryInput = {}) => {
    queryRef.current = { ...queryRef.current, ...query };
    return service.getAll({ query: queryRef.current, fragment }).then((res) => {
      setItems(res.data);
      setPagination(res.pagination);
      return res.data;
    });
  };
  const create = (data: T) =>
    service.create({ data }).then((res) => {
      loadAll();
      return res;
    });
  const deleteOne = (id: string) => {
    return service.delete({ id }).then((res) => {
      loadAll();
      return res;
    });
  };
  const update = (id: string, data: T) => {
    return service.update({ id, data }).then((res) => {
      loadAll();
      return res;
    });
  };
  useEffect(() => {
    loadAll();
  }, []);
  return {
    items,
    pagination,
    queryRef,
    setPagination,
    loadAll,
    deleteOne,
    create,
    update,
  };
}
