import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import InvoiceList from './features/invoices/InvoiceList';

function App() {
    return (
        <BrowserRouter>
            <Container>
                <header>
                    <h1>Invoices</h1>
                </header>
                <main>
                    <Switch>
                        <Route exact path="/">
                            <InvoiceList />
                        </Route>
                        <Route exact path="/:invoiceId">
                            Single Invoice Item
                        </Route>
                        <Redirect to="/" />
                    </Switch>
                </main>
            </Container>
        </BrowserRouter>
    );
}

export default App;
