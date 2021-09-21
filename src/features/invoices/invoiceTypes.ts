export type InvoiceLineItem = {
    id: string,
    description: string,
    amount: number
}

export type InvoiceAddDto = {
    title: string,
    notes: string,
    lineItems: InvoiceLineItem[]
}

export type Invoice = InvoiceAddDto & {
    id: string
}
