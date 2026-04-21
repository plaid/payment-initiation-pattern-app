import React, { useState } from 'react';
import { OrderType } from './types';
import { AccordionItem } from './ui/Accordion';
import {
  AlertErrorIcon,
  AlertWarningIcon,
  CheckmarkIcon,
  InformationIcon,
  TransferIcon,
  UserIcon,
  LockIcon,
} from './ui/icons';
import { Table, TableHead, TableBody, TableRow, TableCell } from './ui/Table';

interface Props {
  initiallyOpen: boolean;
  order: OrderType;
}

const Order: React.FC<Props> = (props: Props) => {
  const { initiallyOpen, order } = props;
  const [open, setOpen] = useState<boolean>(initiallyOpen);

  return (
    <>
      <div className="border-t border-gray-300 py-[1.6rem]">
        <AccordionItem
          label={`Order ID: ${order.id}`}
          isExpanded={open}
          onChange={() => setOpen(!open)}
        >
          <Table label="Payment Status Updates">
            <TableHead children={[]} />
            <TableBody>
              <TableRow>
                <TableCell>Account ID</TableCell>
                <TableCell>{order.account_id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>{order.payment_id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payment Reference</TableCell>
                <TableCell>{order.payment_reference}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payment Executed</TableCell>
                <TableCell>
                  {order.payment_executed ? 'True' : 'False'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>{order.amount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created at</TableCell>
                <TableCell>{order.created_at}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Updated at</TableCell>
                <TableCell>{order.updated_at}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="start">Payment Status Updates</TableCell>
                <TableCell>
                  <Table label="Payment Status Updates">
                    <TableHead children={[]} />
                    <TableBody>
                      {order.payment_status_updates.map(update => (
                        <TableRow key={update.id}>
                          <TableCell>
                            {renderStatusIcon(update.payment_status)}
                          </TableCell>
                          <TableCell>{update.created_at}</TableCell>
                          <TableCell>{update.payment_status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AccordionItem>
      </div>
    </>
  );
};

function renderStatusIcon(status: string) {
  status = status.replace('PAYMENT_STATUS_', '');
  switch (status) {
    case 'EXECUTED':
    case 'SETTLED':
    case 'ESTABLISHED':
      return <CheckmarkIcon className="w-5 h-5 text-green-600" />;
    case 'INPUT_NEEDED':
      return <UserIcon className="w-5 h-5 text-yellow-500" />;
    case 'AUTHORISING':
      return <TransferIcon className="w-5 h-5" />;
    case 'CANCELLED':
      return <AlertWarningIcon className="w-5 h-5 text-red-800" />;
    case 'FAILED':
    case 'REJECTED':
    case 'INSUFFICIENT_FUNDS':
      return <AlertErrorIcon className="w-5 h-5 text-red-800" />;
    case 'BLOCKED':
      return <LockIcon className="w-5 h-5 text-red-800" />;
    case 'INITIATED':
      return <InformationIcon className="w-5 h-5" />;
    default:
      return null;
  }
}

Order.displayName = 'Order';
export default Order;
