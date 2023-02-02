import {Filter, LoggrepHandler} from 'loggrep/dist/types/log'

export const handler: LoggrepHandler = async () => {
  const filters: Filter[] = [
    ({ tag }) => tag === 'ReactNativeJS',
  ]

  return {
    filters,
  }
}
