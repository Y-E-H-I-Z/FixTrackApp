export interface Customer {
  id?: number;
  fullName: string;
  phoneNumber?: string;
  dni?: string;
}

export interface Ticket {
  id: number;
  trackingCode: string;
  deviceInfo: string;
  reportedIssue: string;
  status: string;
  estimatedPrice: number;
  createdAt: string;
  customer: Customer;
}