/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Supported OData operators for filtering.
 */
export type ODataOperator =
    | "eq"
    | "ne"
    | "gt"
    | "lt"
    | "ge"
    | "le"
    | "contains"
    | "startswith"
    | "endswith"
    | "in";

/**
 * Represents a filter condition in an OData query.
 */
export interface ODataFilter {
    /** Field name to filter on */
    field: string;
    /** Operator to apply */
    operator: ODataOperator;
    /** Value to compare */
    value: any;
    /** Optional logical operator to combine with other filters ("and" or "or") */
    logical?: "and" | "or";
}

/**
 * Represents a sorting condition in an OData query.
 */
export interface ODataSort {
    /** Field name to sort by */
    field: string;
    /** Sort direction, defaults to "asc" */
    direction?: "asc" | "desc";
}

/**
 * A builder for constructing OData query strings.
 * Supports $select, $filter, $orderby, $expand, $count, $skip, and $top.
 */
export class ODataQueryBuilder {
    selects: string[] = [];
    filters: ODataFilter[] = [];
    sorts: ODataSort[] = [];
    expands: string[] = [];
    skipCount: number | null = null;
    topCount: number | null = null;
    includeCount = false;

    // -----------------------------
    // SELECT
    // -----------------------------

    /**
     * Specifies the fields to select in the query.
     * @param fields Array of field names
     */
    select(fields: string[]) {
        this.selects = fields;
        return this;
    }

    /**
     * Clears the select fields, which means all fields will be selected.
     */
    selectAll() {
        this.selects = [];
        return this;
    }

    // -----------------------------
    // EXPAND (Navigation Properties)
    // -----------------------------

    /**
     * Specifies related entities to expand in the query.
     * @param fields Array of navigation property names
     */
    expand(fields: string[]) {
        this.expands = fields;
        return this;
    }

    // -----------------------------
    // COUNT
    // -----------------------------

    /**
     * Enables or disables the $count parameter to include total record count.
     * @param enabled Defaults to true
     */
    count(enabled: boolean = true) {
        this.includeCount = enabled;
        return this;
    }

    // -----------------------------
    // FILTER
    // -----------------------------

    /**
     * Adds a filter condition to the query.
     * @param filter The filter condition
     */
    filter(filter: ODataFilter) {
        if (filter.value !== undefined && filter.value !== null && filter.value !== "") {
            this.filters.push(filter);
        }
        return this;
    }

    // -----------------------------
    // MULTI-COLUMN ORDER BY
    // -----------------------------

    /**
     * Adds a sorting condition to the query.
     * @param sort The sorting information
     */
    orderBy(sort: ODataSort) {
        this.sorts.push(sort);
        return this;
    }

    // -----------------------------
    // PAGINATION
    // -----------------------------

    /**
     * Applies pagination to the query.
     * @param pageIndex 1-based page index
     * @param pageSize Number of records per page
     */
    paginate(pageIndex: number, pageSize: number) {
        this.skipCount = (pageIndex - 1) * pageSize;
        this.topCount = pageSize;
        return this;
    }

    // -----------------------------
    // FORMAT VALUE
    // -----------------------------

    /**
     * Formats a value for OData queries, automatically handling dates and quoting strings.
     * @param value The value to format
     */
    formatValue(value: any): string | number | boolean {
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const d = new Date(value);
            return d.toISOString();
        }

        if (value instanceof Date) {
            return value.toISOString();
        }

        if (typeof value === "string") {
            return `'${value}'`;
        }

        return value;
    }

    // -----------------------------
    // BUILD FILTER STRING
    // -----------------------------

    /**
     * Builds the $filter query string from the added filters.
     */
    buildFilter(): string {
        if (this.filters.length === 0) return "";

        const parts = this.filters.map((f: ODataFilter) => {
            const val = this.formatValue(f.value);

            switch (f.operator) {
                case "contains":
                case "startswith":
                case "endswith":
                    return `${f.operator}(${f.field},${val})`;
                case "in":
                    return `${f.field} in (${(f.value as any[]).map((v) => this.formatValue(v)).join(",")})`;
                default:
                    return `${f.field} ${f.operator} ${val}`;
            }
        });

        return parts.join(" and ");
    }

    // -----------------------------
    // MAIN BUILD METHOD
    // -----------------------------

    /**
     * Builds the full OData query string including $select, $filter, $orderby, $expand, $count, $skip, and $top.
     */
    build(): string {
        const params: string[] = [];

        if (this.selects.length > 0) {
            params.push(`$select=${this.selects.join(",")}`);
        }

        const filterString = this.buildFilter();
        if (filterString) {
            params.push(`$filter=${filterString}`);
        }

        if (this.sorts.length > 0) {
            const sortStr = this.sorts.map((s) => `${s.field} ${s.direction || "asc"}`).join(",");
            params.push(`$orderby=${sortStr}`);
        }

        if (this.expands.length > 0) {
            params.push(`$expand=${this.expands.join(",")}`);
        }

        if (this.includeCount) {
            params.push(`$count=true`);
        }

        if (this.skipCount !== null && this.topCount !== null) {
            params.push(`$skip=${this.skipCount}`);
            params.push(`$top=${this.topCount}`);
        }

        return params.join("&");
    }
}
