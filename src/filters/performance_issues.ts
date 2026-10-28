import type {LoggrepHandler} from 'loggrep'

// Inspect errors and skipped frames only between the checkout markers.
export const handler: LoggrepHandler = async () => {
  let checkoutActive = false
  return {
    hooks: {
      onNewLine: ({tag, message}) => {
        if (tag !== 'Scenario') return
        if (message === 'BEGIN checkout') checkoutActive = true
        if (message === 'END checkout') checkoutActive = false
      },
    },
    filters: [entry => checkoutActive && (
      entry.level === 'E' || (
        entry.tag === 'Choreographer' && entry.message?.includes('Skipped') === true
      )
    )],
  }
}
