export interface Config {
  proxyUrl?: string
  errorCallback?: (error: Error) => void
  clientId: string
  secret: string
}

export interface GetAccessTokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  scope: "accounts";
}

export interface GetAccountsResponse {
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

export interface GetAccountBalanceRequest {
  accountId: string
}

export interface GetAccountBalanceResponse {
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

export interface GetAccountTransactionsRequest {
  accountId: string
  fromDate?: string
  toDate?: string
}

export interface GetAccountTransactionsResponse {
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
