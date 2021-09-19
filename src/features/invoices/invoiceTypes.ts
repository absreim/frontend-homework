export type InvoiceLineItem = {
    id: string,
    description: string,
    amount: number
}

export type InvoiceAddDto = {
    notes: string
    lineItems: InvoiceLineItem[]
}

export type Invoice = InvoiceAddDto & {
    id: string
}
