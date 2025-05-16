export interface LineItem {
  id: number;
  product: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  documentType: "invoice" | "delivery-challan" | "quotation";
  invoiceNumber: string;
  recipient: string;
  subject: string;
  address: string;
  date: string;
  lineItems: LineItem[];
  subtotal: number;
  deliveryCost: number;
  discount: number;
  total: number;
  showTotals: boolean;
}
