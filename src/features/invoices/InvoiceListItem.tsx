import React from 'react';
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';

import { Invoice } from './invoiceTypes';

type InvoiceListItemProps = {
    invoice: Invoice
};

function InvoiceListItem({ invoice }: InvoiceListItemProps) {
    return (
        <ListGroupItem
            tag={Link}
            to={`/${invoice.id}`}
        >
            <ListGroupItemHeading>
                {invoice.title}
                <Badge pill>
                    {invoice.lineItems.length}
                </Badge>
            </ListGroupItemHeading>
            <ListGroupItemText>{invoice.notes}</ListGroupItemText>
        </ListGroupItem>
    );
}

export default InvoiceListItem;
