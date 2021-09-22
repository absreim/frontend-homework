This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

# Invoice Manager

## Background

This project is a simple CRUD application for managing invoices. Each invoice data 
entity contains text fields and an array of line items, each of which has a
description and cost. Data is stored locally in the browser.

Of note are some technologies used to build this otherwise simple application:

- Mock Service Worker to simulate a back end service. The makes requests using fetch/XHR browser APIs that are intercepted by a service worker.
- Redux Toolkit Query to manage caching and other aspects of API calls to the (simulated) back end.
- Localforage and IndexedDB to act as the backing store of the simulated back end.

## Quick Start

To the start the application, you can run from the project directory:

    npm install
    npm start
