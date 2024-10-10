import {Filter, LoggrepHandler} from 'loggrep/dist/types/log'
import logEntry from 'loggrep/dist/core/logEntry'

const LOG_TAG = 'LoggrepFbPerfTrace'

// Logging trace metric: my_event_name (duration: 221,407ms). In a minute, visit the Firebase console to view your data: https://console.firebase.google.com/XXXX
const CUSTOM_TRACE_REGEX = /Logging trace metric: (?<event_name>.*) \(duration: (?<duration>[\d,]+)ms\)/;

interface CustomTraceLogEntry {
  event_name: string
  duration: number
}

const report: Record<string, CustomTraceLogEntry[]> = {}

export const handler: LoggrepHandler = async () => {
  const filters: Filter[] = [
    { tag: /FirebasePerformance/, message: CUSTOM_TRACE_REGEX },
  ]

  const generateReport = () => {
    for (const key of Object.keys(report)) {
      const traceLogEntries = report[key]
      const durations = traceLogEntries.map((traceLogEntry) => `${traceLogEntry.duration/1000}s`).join(', ')
      const message = `${key} (counter: ${traceLogEntries.length}): ${durations}`

      // it's using `logEntry()` just to keep nice output
      logEntry({
        tag: LOG_TAG,
        level: 'D',
        line: message,
        message,
        pid: 'NA',
      })
    }
  }

  return {
    filters,
    hooks: {
      onNewLine: ({ tag, message }) => {
        if (tag !== 'FirebasePerformance' || !message) {
          return
        }
        const match = message.match(CUSTOM_TRACE_REGEX);
        if (!match?.groups) {
          return
        }
        const { event_name, duration } = match.groups
        const traceLogEntry = {
          event_name,
          duration: parseInt(duration.replace(',', '.'))
        }

        if (!report[traceLogEntry.event_name]) {
          report[traceLogEntry.event_name] = []
        }
        report[traceLogEntry.event_name].push(traceLogEntry)

        generateReport()
      }
    }
  }
}
