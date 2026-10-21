import type {FilterRegExp, LoggrepHandler} from 'loggrep'

export const handler: LoggrepHandler = async () => {
  const filters: FilterRegExp[] = [
    { tag: /^Choreographer$/ },
  ]

  return {
    filters,
  }
}
