export interface Config {
  proxyUrl?: string
  errorCallback?: (error: Error) => void
  clientId: string
  secret: string
}

export interface GetAccessTokenResponse {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  scope: 'accounts'
}

export interface Account {
  accountId: string
  accountNumber: string
  accountName: string
  referenceName: string
  productName: string
}

export interface GetAccountsResponse {
  data: {
    accounts: Account[]
  }
  links: {
    self: string
  }
  meta: {
    totalPages: number
  }
}

export interface GetAccountBalanceRequest {
  accountId: string
}

export interface AccountBalance {
  accountId: string
  currentBalance: number
  availableBalance: number
  currency: string
}

export interface GetAccountBalanceResponse {
  data: AccountBalance
  links: {
    self: string
  }
  meta: {
    totalPages: number
  }
}

export interface GetAccountTransactionsRequest {
  accountId: string
  fromDate?: string
  toDate?: string
}

export interface Transaction {
  actionDate: string
  accountId: string
  amount: number
  cardNumber: string
  description: string
  postingData: string
  status: string
  transactionDate: string
  type: string
  valueDate: string
}

export interface GetAccountTransactionsResponse {
  data: {
    transactions: Transaction[]
  }
  links: {
    self: string
  }
  meta: {
    totalPages: number
  }
}
