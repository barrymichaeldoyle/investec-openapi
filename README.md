# Investec Programmable Banking Open API Wrapper

A JavaScript/TypeScript wrapper to get up and running fast with Investec's Open API for programmable banking.

<span class="badge-nodeico"><a href="https://www.npmjs.com/package/investec-openapi" title="Nodei.co badge"><img src="https://nodei.co/npm/investec-openapi.png" alt="Nodei.co badge" /></a></span>
<br class="badge-separator" />
<span class="badge-npmversion"><a href="https://npmjs.org/package/investec-openapi" title="View this project on NPM"><img src="https://img.shields.io/npm/v/investec-openapi.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/investec-openapi" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/investec-openapi.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/BarryMichaelDoyle/investec-openapi" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/BarryMichaelDoyle/investec-openapi.svg" alt="Dependency Status" /></a></span>
![TS](https://img.shields.io/badge/supports-typescript-blue.svg?style=flat-square)
![Deno](https://img.shields.io/badge/supports-deno-green.svg?style=flat-square)
![ECMAScript](https://img.shields.io/badge/supports-ECMAScript-yellow.svg?style=flat-square)
![GitHub](https://img.shields.io/github/license/barrymichaeldoyle/investec-openapi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=round-square)](https://github.com/barrymichaeldoyle/investec-openapi/pulls)

### Installation

**Using npm:**

```
npm install investec-openapi
```

**Using yarn:**

```
yarn add investec-openapi
```

### Usage

**Setup:**

```
import api from 'investec-openapi'

api.configure({
  proxyUrl: 'see_docs_below_(for_web_apps)',
  clientId: 'YourClientId_do_not_share'
  secret: 'YourSecret_do_not_share',
  errorCallback: (err) => {
    // Handle errors with getting an access token
    // The err object is either an Error or an HTTP Response from the OAuth server
    console.error(err)
  }
})
```

The `errorCallback` is optional. Errors will be logged to `std.err` if it is not provided.

**Get Data:**

```
const fetchData = async () => {
  const accounts = await api.getAccounts()
  console.log(accounts) // prints accounts linked to account

  const accountBalance = await api.getAccountBalance({ accountId: '12345' })
  console.log(accountBalance) // prints account balance

  const accountTransactions = await api.getAccountTransactions({
    accountId: '12345',
    fromDate: '2020-01-20',
    toDate: '2020-01-30'
  })
  console.log(accountTransactions) // prints account transactions for given date range
}
```

**OR:**

```
const fetchData = async () => {
  // prints accounts linked to account
  api.getAccounts().then(accounts => console.log(accounts))

  // prints account balance
  api.getAccountBalance({ accountId: '12345' })
    .then(accountBalance => console.log(accountBalance))

  // prints account transactions for given date range
  api.getAccountTransactions({
    accountId: '12345',
    fromDate: '2020-01-20',
    toDate: '2020-01-30'
  }).then(accountTransactions => console.log(accountTransactions))
}
```

### Documentation

`api` is a class that once `configured` will generate an `access_token` behind the scenes and replace it with a new one once it's within a minute of expiring with no work required on your end.

This wrapper supports `getAccounts`, `getAccountBalance` and `getAccountTransactions` as documented in the [Investec Developer Documentation] with TypeScript definitions included.

---

#### **`api.configure(config)`**

Sets up `api` class with credentials to acquire and refresh `access_token`. Can be called again to change credentials and refresh `access_token` for new credentials. Other API calls will wait until `access_token` is set (by calling this function) before running.

##### **`config` parameters:**

`proxyUrl` - _optional_ (default `''`)
<br />
<br />
**Note for Web Apps:** Without a `proxyUrl`, you'll experience _CORS issues_. If anyone has an ideas on how to bypass this more cleanly, let me know! We could probably do with adding a dedicated proxy server, in the meantime you can use this `'https://young-thicket-56542.herokuapp.com/'`. Sometimes the Heroko app needs to spin up initially so the first load may take longer than usual. The heroku app is a clone of https://cors-anywhere.herokuapp.com/ from this SO post: https://stackoverflow.com/a/43268098/2111515.
<br />
<br />

`clientId` - _required_

_Get this from https://login.secure.investec.com/io/programmable-banking/cards/overview_
<br />
<br />

`secret` - _required_

_Get this from https://login.secure.investec.com/io/programmable-banking/cards/overview_
<br />
<br />

`apiKey` - _required_

_Get this from https://login.secure.investec.com/io/programmable-banking/cards/overview_

---

#### **`api.getAccounts()`**

Returns list of accounts with details for configured credentials.
<br />
<br />
**Response:**

```
{
  data: {
    accounts: {
      accountId: string
      accountNumber: string
      accountName: string
      referenceName: string
      productName: string
    }[]
  }
  links: {
    self: string
  }
  meta: {
    totalPages: number
  }
}
```

---

#### **`api.getAccountBalance(accountId)`**

Returns account balance details for selected account.

##### **`request` parameters:**

<br />
<br />

`accountId` - **string** _required_
<br />
<br />
**Response:**

```
{
  data: {
    accountId: string
    currentBalance: number
    availableBalance: number
    currency: string
  }
  links: {
    self: string
  }
  meta: {
    totalPages: number
  }
}
```

---

#### **`api.getAccountTransactions(accountId)`**

Returns list of transaction details for selected account.

##### **`request` parameters:**

<br />
<br />

`accountId` - **string** _required_

`fromDate` - **string** _optional_ - Date value in ISO 8601 (i.e. '2020-01-20')

`toDate` - **string** _optional_ - Date value in ISO 8601 (i.e. '2020-01-20')
<br />
<br />
**Response:**

```
{
  data: {
    transactions: {
      accountId: string
      type: string
      status: string
      description: string
      cardNumber: string
      postingData: string
      valueDate: string
      actionDate: string
      amount: number
    }[]
  }
  links: {
    self: string
  }
  meta: {
    totalPages: number
  }
}
```

---

Hope you find this useful! Please give a star and feel free to contribute or log issues and feature requests!

And if you want to say thanks, then go ahead:
<br /><br />
<a href="https://www.buymeacoffee.com/barrydoyle" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>
<br /><br />
Otherwise you could just say thanks to me on the offerzen-community slack @barrymichaeldoyle :)

[investec developer documentation]: https://developer.investec.com/programmable-banking/#programmable-banking
