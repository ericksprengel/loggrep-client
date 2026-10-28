import type {Filter, LoggrepHandler} from 'loggrep'

export const handler: LoggrepHandler = async () => {
  const filters: Filter[] = [
    ({ level }) => level === 'E'
  ]

  return {
    filters,
  }
}
