import React from 'react';
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText, Badge } from 'reactstrap';

import { Invoice } from './invoiceTypes';

type InvoiceListItemProps = {
    active: boolean,
    invoice: Invoice,
    clickCallback: () => void
};

function InvoiceListItem({ invoice, clickCallback, active }: InvoiceListItemProps) {
    return (
        <ListGroupItem
            active={active}
            tag="button"
            onClick={clickCallback}
        >
            <ListGroupItemHeading>
                {invoice.title}
                &nbsp;
                <Badge pill>
                    {invoice.lineItems.length}
                </Badge>
            </ListGroupItemHeading>
            <ListGroupItemText>{invoice.notes}</ListGroupItemText>
        </ListGroupItem>
    );
}

export default InvoiceListItem;
