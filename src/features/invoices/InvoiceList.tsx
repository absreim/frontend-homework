import React, { useState } from 'react';
import { Spinner, Alert, ListGroup, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import { useGetInvoicesQuery, useDeleteInvoiceMutation } from '../api/apiSlice';
import InvoiceListItem from './InvoiceListItem';

function InvoiceList() {
    const history = useHistory();

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const {
        data: invoices = [],
        isLoading,
        isError
    } = useGetInvoicesQuery();

    const [deleteInvoice, { isLoading: deletePending }] = useDeleteInvoiceMutation();

    const selectedInList = selectedId && invoices.findIndex(({ id }) => id === selectedId) >= 0;

    return (
        <div>
            <h2>List of Invoices</h2>
            {
                isLoading ? (
                    <Spinner/>
                ) : isError ? (
                    <Alert color="danger">
                        Error loading invoices.
                    </Alert>
                ) : (
                    <div className="standard-list-group-container">
                        <ListGroup>
                            {
                                invoices.map((invoice) => (
                                    <InvoiceListItem
                                        active={selectedId === invoice.id}
                                        key={invoice.id}
                                        invoice={invoice}
                                        clickCallback={() => {
                                            if (selectedId === invoice.id) {
                                                setSelectedId(null);
                                            }
                                            else {
                                                setSelectedId(invoice.id);
                                            }
                                        }}
                                    />
                                ))
                            }
                        </ListGroup>
                        <div className="mt-2">
                            <p>Click on a item in the list to select it. Click on it again to deselect.</p>
                            <p>
                                The number to the right of the title indicates the number of line items for associated
                                invoice.
                            </p>
                        </div>
                        <div className="d-flex flex-row mt-2">
                            {
                                deletePending ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <Button
                                            color="primary"
                                            onClick={() => history.push('/add')}
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            className="ml-2"
                                            onClick={() => history.push(`/edit/${selectedId}`)}
                                            disabled={!selectedInList}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className="ml-2"
                                            disabled={!selectedInList}
                                            onClick={() => deleteInvoice(selectedId!)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default InvoiceList;
