import {FilterRegExp, LoggrepHandler} from 'loggrep/dist/types/log'

export const handler: LoggrepHandler = async () => {
  const filters: FilterRegExp[] = [
    { tag: /^Choreographer$/ },
  ]

  return {
    filters,
  }
}
