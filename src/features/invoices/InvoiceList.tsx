import React from 'react';
import { Spinner, Alert, ListGroup } from 'reactstrap';

import { useGetInvoicesQuery } from '../api/apiSlice';
import InvoiceListItem from './InvoiceListItem';

function InvoiceList() {
    const {
        data: invoices = [],
        isLoading,
        isError
    } = useGetInvoicesQuery();

    return (
        <div>
            {
                isLoading ? (
                    <Spinner/>
                ) : isError ? (
                    <Alert color="danger">
                        Error loading invoices.
                    </Alert>
                ) : (
                    <ListGroup>
                        {
                            invoices.map((invoice) => (
                                <InvoiceListItem
                                    key={invoice.id}
                                    invoice={invoice}
                                />
                            ))
                        }
                    </ListGroup>
                )
            }
        </div>
    );
}

export default InvoiceList;
