import React, { useState } from 'react';
import { OrderType } from './types';
import Accordion from 'plaid-threads/Accordion';
import {
  AlertError,
  AlertWarning,
  Checkmark,
  Information,
  Transfer,
  User,
  Lock,
  Box,
} from 'plaid-threads';
import { Table } from 'plaid-threads/Table';

interface Props {
  initiallyOpen: boolean;
  order: OrderType;
}

const Order: React.FC<Props> = (props: Props) => {
  const { initiallyOpen, order } = props;
  const [open, setOpen] = useState<boolean>(initiallyOpen);

  return (
    <>
      <Box borderTop={1} py={2}>
        <Accordion.Item
          label={`Order ID: ${order.id}`}
          isExpanded={open}
          onChange={() => setOpen(!open)}
        >
          <Table label="Payment Status Updates">
            <Table.Head children={[]} />
            <Table.Body>
              <Table.Row>
                <Table.Cell>Account ID</Table.Cell>
                <Table.Cell>{order.account_id}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Payment ID</Table.Cell>
                <Table.Cell>{order.payment_id}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Payment Reference</Table.Cell>
                <Table.Cell>{order.payment_reference}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Payment Executed</Table.Cell>
                <Table.Cell>
                  {order.payment_executed ? 'True' : 'False'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Amount</Table.Cell>
                <Table.Cell>{order.amount}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Created at</Table.Cell>
                <Table.Cell>{order.created_at}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Updated at</Table.Cell>
                <Table.Cell>{order.updated_at}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell align="start">Payment Status Updates</Table.Cell>
                <Table.Cell>
                  <Table label="Payment Status Updates">
                    <Table.Head children={[]} />
                    <Table.Body
                      children={order.payment_status_updates.map(update => (
                        <Table.Row key={update.id}>
                          <Table.Cell>
                            {renderStatusIcon(update.payment_status)}
                          </Table.Cell>
                          <Table.Cell>{update.created_at}</Table.Cell>
                          <Table.Cell>{update.payment_status}</Table.Cell>
                        </Table.Row>
                      ))}
                    />
                  </Table>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Accordion.Item>
      </Box>
    </>
  );
};

function renderStatusIcon(status: string) {
  status = status.replace('PAYMENT_STATUS_', '');
  /**
   * Read more about these payment statuses here:
   * https://plaid.com/docs/api/products/payment-initiation/#payment_initiation-payment-get-response-status
   */
  switch (status) {
    case 'EXECUTED':
    case 'SETTLED':
    case 'ESTABLISHED':
      return <Checkmark className="text--is-success" />;
    case 'INPUT_NEEDED':
      return <User className="text--is-warning" />;
    case 'AUTHORISING':
      return <Transfer />;
    case 'CANCELLED':
      return <AlertWarning className="text--is-dangerous" />;
    case 'FAILED':
    case 'REJECTED':
    case 'INSUFFICIENT_FUNDS':
      return <AlertError className="text--is-dangerous" />;
    case 'BLOCKED':
      return <Lock className="text--is-dangerous" />;
    case 'INITIATED':
      return <Information />;
    default:
      return null;
  }
}

Order.displayName = 'Order';
export default Order;
