import { NumberSymbol } from "@angular/common";

export class PaginationResult<T> {
    result: T; 
    pagination: Pagination;
}

export class Pagination {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    itemsPerPage: number;
}
