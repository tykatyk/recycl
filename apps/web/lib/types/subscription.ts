import { unsubscribeApiResponseCodes } from '../helpers/responses'

const { SUCCESS, NOT_FOUND, TOKEN_EXPIRED, TOKEN_USED } =
  unsubscribeApiResponseCodes

export type UnsubscribeApiResponse = {
  status:
    | typeof SUCCESS
    | typeof NOT_FOUND
    | typeof TOKEN_EXPIRED
    | typeof TOKEN_USED
}
