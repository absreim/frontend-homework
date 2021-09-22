import React from 'react';

import { useAddInvoiceMutation } from '../api/apiSlice';
import { Invoice, InvoiceAddDto } from './invoiceTypes';
import SingleInvoice, { SingleInvoiceFormState } from './SingleInvoice';

const blankInvoice: Invoice = {
    id: '',
    title: 'New Invoice',
    notes: '',
    lineItems: []
}

function AddInvoice() {
    const [addInvoice, { isLoading }] = useAddInvoiceMutation();

    function handleOk(formState: SingleInvoiceFormState) {
        const dto: InvoiceAddDto = {
            title: formState.title,
            notes: formState.notes,
            lineItems: formState.lineItems.map((lineItem) => ({
                id: lineItem.id,
                description: lineItem.description,
                amount: Number(lineItem.amount)
            }))
        };
        addInvoice(dto);
    }

    return (
        <SingleInvoice
            handleOk={handleOk}
            invoice={blankInvoice}
            isLoading={isLoading}
            headingText={'Adding New Invoice'}
        />
    );
}

export default AddInvoice;
