import type {Filter, LoggrepHandler} from 'loggrep'

export const handler: LoggrepHandler = async () => {
  const filters: Filter[] = [
    ({ tag }) => tag === 'ReactNativeJS',
  ]

  return {
    filters,
  }
}
