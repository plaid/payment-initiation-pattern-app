export interface PaymentStatusUpdate {
  id: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderType {
  id: number;
  account_id: number;
  amount: number;
  payment_id: string;
  payment_reference: string;
  payment_executed: boolean;
  created_at: string;
  updated_at: string;
  payment_status_updates: PaymentStatusUpdate[];
}

export interface AccountType {
  id: number;
  name: string;
  balance: number;
  created_at: string;
  updated_at: string;
  orders: OrderType[];
}
export interface UserType {
  id: number;
  username: string | null;
  created_at: string;
  updated_at: string;
  accounts: AccountType[];
}

export interface TerminalEntryType {
  data?: string;
  type: 'REQUEST' | 'RESPONSE' | 'USER' | 'LINK' | 'WEBHOOK';
  source: 'BACKEND' | 'CLIENT';
  url?: string;
  time: Date;
}
