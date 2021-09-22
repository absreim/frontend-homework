import { rest } from 'msw';
import localforage from "localforage";
import { nanoid } from 'nanoid';

import { Invoice, InvoiceAddDto } from '../features/invoices/invoiceTypes';

const DB_NAME = 'invoices';
const TABLE_NAME = 'invoices';

const invoiceTable = localforage.createInstance({
    name: DB_NAME,
    storeName: TABLE_NAME
});

const handlers = [
    rest.get('/api/invoices', async (req, res, ctx) => {
        const invoices: Invoice[] = [];
        await invoiceTable.iterate((value) => {
            invoices.push(value as Invoice);
        });
        return res(ctx.status(200), ctx.json(invoices));
    }),
    rest.get('/api/invoices/:id', async (req, res, ctx) => {
        const invoice: Invoice | null = await invoiceTable.getItem(req.params.id) as Invoice | null;
        if (invoice === null) {
            return res(ctx.status(404));
        }
        return res(ctx.status(200), ctx.json(invoice));
    }),
    rest.post('/api/invoices', async (req, res, ctx) => {
        const id = nanoid();
        const dto: InvoiceAddDto = req.body as InvoiceAddDto;
        const newInvoice: Invoice = { id, ...dto };
        const createdInvoice: Invoice = await invoiceTable.setItem(id, newInvoice);
        return res(ctx.status(201), ctx.json(createdInvoice));
    }),
    rest.put('/api/invoices/:id', async (req, res, ctx) => {
        const invoice = await invoiceTable.setItem(req.params.id, req.body);
        return res(ctx.status(200), ctx.json(invoice));
    }),
    rest.delete('/api/invoices/:id', async (req, res, ctx) => {
        await invoiceTable.removeItem(req.params.id);
        return res(ctx.status(204));
    })
];

export default handlers;
