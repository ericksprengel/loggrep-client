import {handler as pidcatHandler} from 'loggrep/filters/pidcat'
import type {LoggrepHandler} from 'loggrep'

export const handler: LoggrepHandler = async () => {
  return pidcatHandler({
    packages: [
      'com.android.vending', // Play Store
      'com.google.android.youtube', // YouTube
    ]
  })
}
