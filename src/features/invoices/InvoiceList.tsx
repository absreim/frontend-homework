import React, { useState } from 'react';
import { Spinner, Alert, ListGroup, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import { useGetInvoicesQuery, useDeleteInvoiceMutation } from '../api/apiSlice';
import InvoiceListItem from './InvoiceListItem';

function InvoiceList() {
    const history = useHistory();

    const [selectedId, setSelectedId] = useState<string>('');

    const {
        data: invoices = [],
        isLoading,
        isError
    } = useGetInvoicesQuery();

    const [deleteInvoice, { isLoading: deletePending }] = useDeleteInvoiceMutation();

    const selectedInList = invoices.findIndex(({ id }) => id === selectedId) >= 0;

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
                    <>
                        <ListGroup>
                            {
                                invoices.map((invoice) => (
                                    <InvoiceListItem
                                        active={selectedId === invoice.id}
                                        key={invoice.id}
                                        invoice={invoice}
                                        clickCallback={() => setSelectedId(invoice.id)}
                                    />
                                ))
                            }
                        </ListGroup>
                        <div className="d-flex flex-row mt-2">
                            {
                                deletePending ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <Button
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
                                            onClick={() => deleteInvoice(selectedId)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    );
}

export default InvoiceList;
