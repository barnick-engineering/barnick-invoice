export interface LineItem {
  id: number
  product: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface InvoiceData {
  recipient: string
  subject: string
  date: string
  lineItems: LineItem[]
  total: number
}
