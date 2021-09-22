import React, { useEffect, useState, useCallback } from 'react';
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

import { Invoice } from './invoiceTypes';

export type InvoiceLineItemFormState = {
    id: string,
    description: string,
    amount: string
}

export type SingleInvoiceFormState = {
    title: string,
    notes: string,
    lineItems: InvoiceLineItemFormState[]
}

type SingleInvoiceProps = {
    handleOk: (formState: SingleInvoiceFormState) => void,
    invoice: Invoice | null,
    isLoading: boolean,
    headingText: string
}

function SingleInvoice({ handleOk, invoice, isLoading, headingText }: SingleInvoiceProps) {
    const history = useHistory();

    const [formState, setFormState] = useImmer<SingleInvoiceFormState | null>(null);
    const [selectedLineItemId, setSelectedLineItemId] = useState<string | null>(null);

    const resetForm = useCallback(
        function() {
            if (!invoice) {
                setFormState(() => null);
                return;
            }
            const newFormState: SingleInvoiceFormState = {
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

    useEffect(
        function() {
            resetForm();
        },
        [resetForm]
    );

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

    function handleDeleteLineItem() {
        setFormState((draft) => {
            const indexToDelete = draft!.lineItems.findIndex(({ id }) => id === selectedLineItemId);
            if (indexToDelete !== -1) {
                draft!.lineItems.splice(indexToDelete, 1);
            }
        });
    }

    const selectedLineItem = selectedLineItemId && formState?.lineItems.find((lineItem) =>
        lineItem.id === selectedLineItemId);

    return (
        <div>
            <h2>{headingText}</h2>
            {
                formState && (
                    <>
                        <Form>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input
                                    className="standard-text-input"
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
                                    className="standard-text-input"
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
                        <div className="border p-2 standard-list-group-container">
                            <h3>Line Items</h3>
                            <ListGroup>
                                {
                                    formState.lineItems.map((lineItem) => (
                                        <ListGroupItem
                                            active={selectedLineItemId === lineItem.id}
                                            tag="button"
                                            onClick={() => {
                                                if (selectedLineItemId === lineItem.id) {
                                                    setSelectedLineItemId(null);
                                                }
                                                else {
                                                    setSelectedLineItemId(lineItem.id);
                                                }
                                            }}
                                            key={lineItem.id}
                                        >
                                            <ListGroupItemHeading>{lineItem.description}</ListGroupItemHeading>
                                            <ListGroupItemText>{lineItem.amount}</ListGroupItemText>
                                        </ListGroupItem>
                                    ))
                                }
                            </ListGroup>
                            <div className="mt-2">
                                <p>Click on a item in the list to select it. Click on it again to deselect.</p>
                                <p>
                                    After an item is selected, a form will appear below for editing the details of the
                                    selected line item.
                                </p>
                            </div>
                            <div className="d-flex flex-row mt-2">
                                <Button
                                    onClick={handleAddLineItem}
                                >
                                    Add
                                </Button>
                                <Button
                                    className="ml-2"
                                    disabled={!selectedLineItem}
                                    onClick={handleDeleteLineItem}
                                >
                                    Delete
                                </Button>
                            </div>
                            {
                                selectedLineItem && (
                                    <Form>
                                        <h4 className="mt-2">Selected Line Item Details</h4>
                                        <FormGroup>
                                            <Label for="description">Description</Label>
                                            <Input
                                                className="standard-text-input"
                                                required
                                                id="description"
                                                name="description"
                                                value={selectedLineItem.description}
                                                onChange={({ target }) =>
                                                    setFormState((draft) => {
                                                        const lineItem = draft!.lineItems.find(({ id }) =>
                                                            id === selectedLineItem.id);
                                                        lineItem!.description = target.value;
                                                    })}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="amount">Amount</Label>
                                            <Input
                                                className="standard-number-input"
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
                                                            id === selectedLineItem.id);
                                                        lineItem!.amount = target.value;
                                                    })}
                                            />
                                        </FormGroup>
                                    </Form>
                                )
                            }
                        </div>
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
                                            onClick={() => {
                                                handleOk(formState);
                                                resetForm();
                                            }}
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

export default SingleInvoice;
