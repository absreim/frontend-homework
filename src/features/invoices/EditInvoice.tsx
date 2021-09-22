import React from 'react';
import { useParams } from 'react-router-dom';

import { useEditInvoiceMutation, useGetInvoiceQuery } from '../api/apiSlice';
import { Invoice } from './invoiceTypes';
import SingleInvoice, { SingleInvoiceFormState } from './SingleInvoice';

type EditInvoiceRouteParams = {
    invoiceId: string
}

function EditInvoice() {
    const { invoiceId }: EditInvoiceRouteParams = useParams();
    const { data: invoice } = useGetInvoiceQuery(invoiceId);
    const [updateInvoice, { isLoading }] = useEditInvoiceMutation();

    function handleOk(formState: SingleInvoiceFormState) {
        const dto: Invoice = {
            id: invoice!.id,
            title: formState!.title,
            notes: formState!.notes,
            lineItems: formState!.lineItems.map((lineItem) => ({
                id: lineItem.id,
                description: lineItem.description,
                amount: Number(lineItem.amount)
            }))
        };
        updateInvoice(dto);
    }

    return (
        <SingleInvoice
            handleOk={handleOk}
            invoice={invoice || null}
            isLoading={isLoading}
            headingText={'Editing Invoice'}
        />
    );
}

export default EditInvoice;
