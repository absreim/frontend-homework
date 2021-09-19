import { rest } from 'msw';
import localforage from "localforage";
import uuid from 'uuid';

import { Invoice, InvoiceAddDto } from './features/invoices/invoiceTypes';

const DB_NAME = 'invoices';
const TABLE_NAME = 'invoices';

const invoiceTable = localforage.createInstance({
    name: DB_NAME,
    storeName: TABLE_NAME
});

export const handlers = [
    rest.get('/invoices', async (req, res, ctx) => {
        const invoices: Invoice[] = [];
        await invoiceTable.iterate((value) => {
            invoices.push(value as Invoice);
        });
        return res(ctx.status(200), ctx.json(invoices));
    }),
    rest.get('/invoices/:id', async (req, res, ctx) => {
        const invoice: Invoice | null = await invoiceTable.getItem(req.params.id) as Invoice | null;
        if (invoice === null) {
            return res(ctx.status(404));
        }
        return res(ctx.status(200), ctx.json(invoice));
    }),
    rest.post('/invoices', async (req, res, ctx) => {
        const id = uuid.v4();
        const dto: InvoiceAddDto = req.body as InvoiceAddDto;
        const newInvoice: Invoice = { id, ...dto };
        const createdInvoice: Invoice = await invoiceTable.setItem(id, newInvoice);
        return res(ctx.status(201), ctx.json(createdInvoice));
    })
];
