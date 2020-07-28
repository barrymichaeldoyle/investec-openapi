import {
  Config,
  GetAccountBalanceRequest,
  GetAccountBalanceResponse,
  GetAccountTransactionsRequest,
  GetAccountTransactionsResponse,
  GetAccountsResponse,
} from './interfaces.ts'
import { buildQueryString } from './utils.ts'

class InvestecOpenAPI {
  private proxyUrl?: string
  private clientId?: string
  private secret?: string
  private accessToken?: string
  private fetchingAccessToken?: boolean

  configure({ proxyUrl, clientId, secret }: Config) {
    this.fetchingAccessToken = true
    this.proxyUrl = proxyUrl ?? ''
    this.clientId = clientId
    this.secret = secret

    this.getAccessToken()
  }

  async getAccounts(): Promise<GetAccountsResponse | undefined> {
    await this.waitForAccessToken()
    try {
      const res = await fetch(
        `${this.proxyUrl}https://openapi.investec.com/za/pb/v1/accounts`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
      const results = await res.json()
      return results
    } catch (ex) {
      console.error('Something went wrong!', { ex })
      console.warn(
        'Make sure your `proxyUrl` is setup properly.',
        this.proxyUrl
      )
    }
  }

  async getAccountBalance({
    accountId,
  }: GetAccountBalanceRequest): Promise<GetAccountBalanceResponse | undefined> {
    await this.waitForAccessToken()
    try {
      const res = await fetch(
        `${this.proxyUrl}https://openapi.investec.com/za/pb/v1/accounts/${accountId}/balance `,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
      const results = await res.json()
      return results
    } catch (ex) {
      console.error('Something went wrong!', { ex })
      console.warn(
        'Make sure your `proxyUrl` is setup properly.',
        this.proxyUrl
      )
    }
  }

  async getAccountTransactions({
    accountId,
    fromDate,
    toDate,
  }: GetAccountTransactionsRequest): Promise<
    GetAccountTransactionsResponse | undefined
  > {
    await this.waitForAccessToken()
    try {
      const res = await fetch(
        `${
          this.proxyUrl
        }https://openapi.investec.com/za/pb/v1/accounts/${accountId}/transactions?${buildQueryString(
          { fromDate, toDate }
        )}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
      const results = await res.json()
      return results
    } catch (ex) {
      console.error('Something went wrong!', { ex })
      console.warn(
        'Make sure your `proxyUrl` is setup properly.',
        this.proxyUrl
      )
    }
  }

  private async getAccessToken(): Promise<void> {
    this.checkConfigured()
    try {
      const res = await fetch(
        `${this.proxyUrl}https://openapi.investec.com/identity/v2/oauth2/token`,
        {
          body: 'grant_type=client_credentials&scope=accounts',
          headers: {
            Authorization: `Basic ${btoa(this.clientId + ':' + this.secret)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
        }
      )
      const { access_token, expires_in } = await res.json()
      this.accessToken = access_token
      this.fetchingAccessToken = false
      setTimeout(() => this.getAccessToken(), expires_in * 1000 - 60 * 1000)
    } catch (ex) {
      console.error('Something went wrong!', { ex })
      console.warn(
        'Make sure your `proxyUrl` is setup properly.',
        this.proxyUrl
      )
    }
  }

  private async waitForAccessToken(): Promise<void> {
    while (this.fetchingAccessToken) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  private checkConfigured() {
    if (!this.clientId || !this.secret) {
      throw new Error(
        'Investic Open API not configured yet, please call `investecOpenAPI.configure({ ... })` first.\n `clientId` and `secret` fields are required!'
      )
    }
  }
}

const investecOpenAPI = new InvestecOpenAPI()

export default investecOpenAPI
