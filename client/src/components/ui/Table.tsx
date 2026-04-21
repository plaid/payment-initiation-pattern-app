import React from 'react';

interface TableProps {
  label: string;
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ label, children }) => (
  <table className="w-full text-[1.4rem]" aria-label={label}>
    {children}
  </table>
);

interface TableHeadProps {
  children: React.ReactNode[];
}

export const TableHead: React.FC<TableHeadProps> = ({ children }) => {
  if (!children || (Array.isArray(children) && children.length === 0))
    return null;
  return <thead>{children}</thead>;
};

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => (
  <tbody className="divide-y divide-gray-100">{children}</tbody>
);

interface TableRowProps {
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ children }) => (
  <tr>{children}</tr>
);

interface TableCellProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export const TableCell: React.FC<TableCellProps> = ({ children, align }) => (
  <td
    className={`py-2 px-3 align-top ${align === 'center' ? 'text-center' : align === 'end' ? 'text-right' : ''}`}
  >
    {children}
  </td>
);
