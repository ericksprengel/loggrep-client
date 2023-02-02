import {Filter, LoggrepHandler} from 'loggrep/dist/types/log'

export const handler: LoggrepHandler = async () => {
  const filters: Filter[] = [
    ({ message, tag }) => 
      tag === 'ActivityManager'
      && (message?.startsWith('Start proc') ?? false),
  ]

  return {
    filters,
  }
}
