import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { useParams, useHistory } from 'react-router-dom';
import {
    Form,
    FormGroup,
    Input,
    Label,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Button,
    Spinner
} from 'reactstrap';
import { nanoid } from 'nanoid';

import { useEditInvoiceMutation, useGetInvoiceQuery } from '../api/apiSlice';
import { Invoice } from './invoiceTypes';

type InvoiceLineItemFormState = {
    id: string,
    description: string,
    amount: string
}

type SingleInvoiceFormState = {
    id: string,
    title: string,
    notes: string,
    lineItems: InvoiceLineItemFormState[]
}

type SingleInvoiceRouteParams = {
    invoiceId: string
}

function EditInvoice() {
    const history = useHistory();
    const { invoiceId }: SingleInvoiceRouteParams = useParams();
    const { data: invoice } = useGetInvoiceQuery(invoiceId);
    const [updateInvoice, { isLoading }] = useEditInvoiceMutation();

    const [formState, setFormState] = useImmer<SingleInvoiceFormState | null>(null);
    const [selectedLineItemId, setSelectedLineItemId] = useState<string | null>(null);

    useEffect(
        function() {
            if (!invoice) {
                setFormState(() => null);
                return;
            }
            const newFormState: SingleInvoiceFormState = {
                id: invoice.id,
                title: invoice.title,
                notes: invoice.notes,
                lineItems: invoice.lineItems.map((lineItem) => ({
                    id: lineItem.id,
                    description: lineItem.description,
                    amount: String(lineItem.amount)
                }))
            };
            setFormState(() => newFormState);
        },
        [invoice, setFormState]
    );

    function handleOk() {
        const dto: Invoice = {
            id: formState!.id,
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

    function handleAddLineItem() {
        const newId = nanoid();
        const newLineItem: InvoiceLineItemFormState = {
            id: newId,
            description: `(New Item)`,
            amount: '0'
        };
        setFormState((draft) => {
            draft!.lineItems.push(newLineItem)
        });
    }

    const selectedLineItem = formState?.lineItems.find((lineItem) => lineItem.id === selectedLineItemId);

    return (
        <div>
            <h2>Editing Invoice</h2>
            {
                formState && (
                    <>
                        <Form>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input
                                    required
                                    id="title"
                                    name="title"
                                    value={formState.title}
                                    onChange={({ target }) =>
                                        setFormState((draft) => {
                                            draft!.title = target.value
                                        })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Notes">Notes</Label>
                                <Input
                                    type="textarea"
                                    id="notes"
                                    name="notes"
                                    value={formState.notes}
                                    onChange={({ target }) =>
                                        setFormState((draft) => {
                                            draft!.notes = target.value
                                        })}
                                />
                            </FormGroup>
                        </Form>
                        <ListGroup>
                            {
                                formState.lineItems.map((lineItem) => (
                                    <ListGroupItem
                                        active={selectedLineItemId === lineItem.id}
                                        tag={Button}
                                        onClick={() => setSelectedLineItemId(lineItem.id)}
                                        key={lineItem.id}
                                    >
                                        <ListGroupItemHeading>{lineItem.description}</ListGroupItemHeading>
                                        <ListGroupItemText>{lineItem.amount}</ListGroupItemText>
                                    </ListGroupItem>
                                ))
                            }
                        </ListGroup>
                        <Button
                            className="mt-2"
                            onClick={handleAddLineItem}
                        >
                            Add Line Item
                        </Button>
                        {
                            selectedLineItem && (
                                <Form className="mt-2">
                                    <FormGroup>
                                        <Label for="description">Description</Label>
                                        <Input
                                            required
                                            id="description"
                                            name="description"
                                            value={selectedLineItem.description}
                                            onChange={({ target }) =>
                                                setFormState((draft) => {
                                                    const lineItem = draft!.lineItems.find(({ id }) =>
                                                        id === selectedLineItemId);
                                                    lineItem!.description = target.value;
                                            })}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="amount">Amount</Label>
                                        <Input
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            id="amount"
                                            name="amount"
                                            value={selectedLineItem.amount}
                                            onChange={({ target }) =>
                                                setFormState((draft) => {
                                                    const lineItem = draft!.lineItems.find(({ id }) =>
                                                        id === selectedLineItemId);
                                                    lineItem!.amount = target.value;
                                                })}
                                        />
                                    </FormGroup>
                                    <Button
                                        className="mt-2"
                                        onClick={() => setSelectedLineItemId(null)}
                                    >
                                        Close
                                    </Button>
                                </Form>
                            )
                        }
                        <div className="d-flex flex-row mt-2">
                            {
                                isLoading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => history.push('/')}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="ml-2"
                                            color="primary"
                                            onClick={handleOk}
                                        >
                                            OK
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

export default EditInvoice;
