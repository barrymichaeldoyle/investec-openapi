import {
  Config,
  GetAccountBalanceRequest,
  GetAccountBalanceResponse,
  GetAccountTransactionsRequest,
  GetAccountTransactionsResponse,
  GetAccountsResponse,
  GetAccessTokenResponse,
} from './interfaces.ts'
import { buildQueryString } from './utils.ts'

class InvestecOpenAPI {
  private proxyUrl?: string
  private clientId?: string
  private secret?: string
  private accessToken?: string
  private accessTokenExpiry: number = -1
  private errorCallback: (err: Error) => void = console.error

  configure({ proxyUrl, clientId, secret, errorCallback }: Config) {
    this.proxyUrl = proxyUrl ?? ''
    this.clientId = clientId
    this.secret = secret
    if (errorCallback) this.errorCallback = errorCallback
  }

  async getAccounts(): Promise<GetAccountsResponse | undefined> {
    const accessToken = await this.getAccessToken()
    if (!accessToken) return

    try {
      const res = await fetch(
        `${this.proxyUrl}https://openapi.investec.com/za/pb/v1/accounts`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!res.ok)
        throw new Error(`Server returned ${res.status} ${res.statusText} `)

      return await res.json()
    } catch (ex) {
      this.handleException(ex)
    }
  }

  async getAccountBalance({
    accountId,
  }: GetAccountBalanceRequest): Promise<GetAccountBalanceResponse | undefined> {
    const accessToken = await this.getAccessToken()
    if (!accessToken) return

    try {
      const res = await fetch(
        `${this.proxyUrl}https://openapi.investec.com/za/pb/v1/accounts/${accountId}/balance `,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!res.ok)
        throw new Error(`Server returned ${res.status} ${res.statusText} `)

      return await res.json()
    } catch (ex) {
      this.handleException(ex)
    }
  }

  async getAccountTransactions({
    accountId,
    fromDate,
    toDate,
  }: GetAccountTransactionsRequest): Promise<
    GetAccountTransactionsResponse | undefined
  > {
    const accessToken = await this.getAccessToken()
    if (!accessToken) return

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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!res.ok)
        throw new Error(`Server returned ${res.status} ${res.statusText} `)

      return await res.json()
    } catch (ex) {
      this.handleException(ex)
    }
  }

  private handleException(ex: any): void {
    console.warn('Make sure your `proxyUrl` is setup properly.', this.proxyUrl)
  }

  private async getAccessToken(): Promise<string | undefined> {
    if (!this.clientId || !this.secret)
      throw new Error(
        'Investec Open API not configured yet, please call `investecOpenAPI.configure({ ... })` first.\n `clientId` and `secret` fields are required!'
      )

    if (this.accessToken && this.accessTokenExpiry > Date.now())
      return this.accessToken

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
      if (!res.ok) {
        this.errorCallback(
          new Error(
            `Error getting access token. Server returned ${res.status} ${res.statusText}`
          )
        )
        return
      }

      const {
        access_token,
        expires_in,
      } = (await res.json()) as GetAccessTokenResponse
      this.accessToken = access_token
      this.accessTokenExpiry = Date.now() + (expires_in - 30) * 1000
      return access_token
    } catch (ex) {
      this.errorCallback(ex)
    }
  }
}

const investecOpenAPI = new InvestecOpenAPI()

export default investecOpenAPI
