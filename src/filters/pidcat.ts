import {handler as pidcatHandler} from 'loggrep/dist/filters/pidcat'
import { LoggrepHandler } from 'loggrep/dist/types/log'

export const handler: LoggrepHandler = async () => {
  return pidcatHandler({
    packages: [
      'com.android.vending', // Play Store
      'com.google.android.youtube', // YouTube
    ]
  })
}
