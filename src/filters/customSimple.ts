import {Filter, LoggrepHandler} from 'loggrep/dist/types/log'

export const handler: LoggrepHandler = async () => {
  const filters: Filter[] = [
    ({ level }) => level === 'E'
  ]

  return {
    filters,
  }
}
