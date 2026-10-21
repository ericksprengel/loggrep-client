import type {Filter, LoggrepHandler} from 'loggrep'

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
