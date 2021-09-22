import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Invoice, InvoiceAddDto } from '../invoices/invoiceTypes';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Invoices'],
    endpoints: (builder) => ({
        getInvoices: builder.query<Invoice[], void>({
            query: () => 'invoices',
            providesTags: (result = [], error, arg) => result ? [
                ...result.map(({ id }) => ({ type: 'Invoices' as const, id })),
                { type: 'Invoices' as const, id: 'LIST' }
            ] : [{ type: 'Invoices' as const, id: 'LIST' }]
        }),
        getInvoice: builder.query<Invoice, string>({
            query: (id) => `invoices/${id}`,
            providesTags: (result, error, arg) => [{ type: 'Invoices' as const, id: arg }]
        }),
        addInvoice: builder.mutation<Invoice, InvoiceAddDto>({
            query: (addDto) => ({
                url: 'invoices',
                method: 'POST',
                body: addDto,
            }),
            invalidatesTags: ['Invoices' as const]
        }),
        editInvoice: builder.mutation<Invoice, Invoice>({
            query: (editDto) => ({
                url: `invoices/${editDto.id}`,
                method: 'PUT',
                body: editDto,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Invoices' as const, id: arg.id }]
        }),
        deleteInvoice: builder.mutation<void, string>({
            query: (id) => ({
                url: `invoices/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Invoices' as const, id: arg }]
        })
    })
});

export const {
    useGetInvoicesQuery,
    useGetInvoiceQuery,
    useAddInvoiceMutation,
    useEditInvoiceMutation,
    useDeleteInvoiceMutation
} = apiSlice;
