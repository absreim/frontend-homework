import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import { useHistory } from 'react-router-dom';
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

import { useAddInvoiceMutation } from '../api/apiSlice';
import { InvoiceAddDto } from './invoiceTypes';

type InvoiceLineItemFormState = {
    id: string,
    description: string,
    amount: string
}

type SingleInvoiceFormState = {
    title: string,
    notes: string,
    lineItems: InvoiceLineItemFormState[]
}

const blankInvoice: SingleInvoiceFormState = {
    title: 'New Invoice',
    notes: '',
    lineItems: []
}

function AddInvoice() {
    const history = useHistory();
    const [addInvoice, { isLoading }] = useAddInvoiceMutation();

    const [formState, setFormState] = useImmer<SingleInvoiceFormState>(blankInvoice);
    const [selectedLineItemId, setSelectedLineItemId] = useState<string | null>(null);

    function handleOk() {
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
        setFormState(() => blankInvoice);
    }

    function handleAddLineItem() {
        const newId = nanoid();
        const newLineItem: InvoiceLineItemFormState = {
            id: newId,
            description: `(New Item)`,
            amount: '0'
        };
        setFormState((draft) => {
            draft.lineItems.push(newLineItem)
        });
    }

    const selectedLineItem = selectedLineItemId && formState.lineItems.find((lineItem) =>
        lineItem.id === selectedLineItemId);

    return (
        <div>
            <h2>Adding New Invoice</h2>
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
                                            draft.title = target.value
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
                                            draft.notes = target.value
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
                                                    const lineItem = draft.lineItems.find(({ id }) =>
                                                        id === selectedLineItem.id);
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
                                                    const lineItem = draft.lineItems.find(({ id }) =>
                                                        id === selectedLineItem.id);
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
                                            Back
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

export default AddInvoice;
