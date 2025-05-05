import { ColumnFilter } from "./ColumnFilter";
export const COLUMNS = [
  {
    Header: "Id",
    Footer: "Id",
    accessor: "id",
    Filter: ColumnFilter,
    //disableFilters: true,
  },
  {
    Header: "FirstName",
    Footer: "FirstName",
    accessor: "firstName",
    Filter: ColumnFilter,
  },
  {
    Header: "LastName",
    Footer: "LastName",
    accessor: "lastName",
    Filter: ColumnFilter,
  },
  {
    Header: "Email ",
    Footer: "Email ",
    accessor: "email",
    Filter: ColumnFilter,
  },
  {
    Header: "Phone",
    Footer: "Phone",
    accessor: "phone",
    Filter: ColumnFilter,
  },
  {
    Header: "Salary",
    Footer: "Salary",
    accessor: "salary",
    Filter: ColumnFilter,
  },
];

export const GROUPED_COLUMNS = [
  {
    Header: "Id",
    Footer: "Id",
    accessor: "id",
  },
  {
    Header: "Name",
    Footer: "Name",
    columns: [
      {
        Header: "FirstName",
        Footer: "FirstName",
        accessor: "firstName",
      },
      {
        Header: "LastName",
        Footer: "LastName",
        accessor: "lastName",
      },
    ],
  },
  {
    Header: "Info",
    Footer: "Info",
    columns: [
      {
        Header: "Salary",
        Footer: "Salary",
        accessor: "salary",
      },
      {
        Header: "Phone",
        Footer: "Phone",
        accessor: "phone",
      },
      {
        Header: "Email ",
        Footer: "Email ",
        accessor: "email",
      },
    ],
  },
];
