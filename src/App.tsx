import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';

import InvoiceList from './features/invoices/InvoiceList';
import EditInvoice from './features/invoices/EditInvoice';
import AddInvoice from './features/invoices/AddInvoice';

function App() {
    return (
        <BrowserRouter>
            <Container>
                <header>
                    <h1>Invoice Manager</h1>
                </header>
                <main>
                    <Switch>
                        <Route exact path="/">
                            <InvoiceList />
                        </Route>
                        <Route exact path="/add">
                            <AddInvoice />
                        </Route>
                        <Route exact path="/edit/:invoiceId">
                            <EditInvoice />
                        </Route>
                        <Redirect to="/" />
                    </Switch>
                </main>
            </Container>
        </BrowserRouter>
    );
}

export default App;
