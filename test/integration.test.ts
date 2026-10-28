import {expect, test} from 'bun:test'
import type {LogEntry} from 'loggrep'
import {handler as pidcat} from 'loggrep/filters/pidcat'

const input = new URL('./fixtures/scenario.txt', import.meta.url).pathname
const binary = new URL('../node_modules/.bin/loggrep', import.meta.url).pathname

async function run(args: string[]) {
  const child = Bun.spawn([process.execPath, binary, ...args], {
    cwd: new URL('..', import.meta.url).pathname,
    env: {...process.env, NO_COLOR: '1'}, stdout: 'pipe', stderr: 'pipe',
  })
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
  ])
  return {stdout, stderr, code}
}

test('installed CLI executes stateful TypeScript modules directly and starts fresh on rerun', async () => {
  for (let iteration = 0; iteration < 2; iteration++) {
    const result = await run(['-m', 'src/filters/performance_issues.ts', '-i', input])
    expect(result.code).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('Skipped 42 frames!')
    expect(result.stdout).toContain('checkout timed out')
    expect(result.stdout).not.toContain('outside-')
    expect(result.stdout).not.toContain('normal event')
  }
})

test('the package script runs the installed CLI without resolving itself recursively', async () => {
  const child = Bun.spawn([process.execPath, 'run', 'loggrep', '--', '--version'], {
    cwd: new URL('..', import.meta.url).pathname, stdout: 'pipe', stderr: 'pipe',
  })
  try {
    const [stdout, , code] = await Promise.all([
      new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
    ])
    expect(code).toBe(0)
    expect(stdout.trim()).toBe('3.0.0')
  } finally {
    child.kill()
  }
})

test('multiple example modules combine through the installed package', async () => {
  const result = await run(['-m', 'src/filters/customSimple.ts', '-m', 'src/filters/performance.ts', '-i', input])
  expect(result.code).toBe(0)
  expect(result.stdout).toContain('outside-before')
  expect(result.stdout).toContain('Skipped 42 frames!')
  expect(result.stdout).toContain('checkout timed out')
  expect(result.stdout).not.toContain('normal event')
  expect(typeof pidcat).toBe('function')
})

test('Firebase reports preserve fractional durations and isolate state per handler', async () => {
  const entry: LogEntry = {
    line: '', level: 'D', tag: 'FirebasePerformance', pid: '100',
    message: 'Logging trace metric: checkout (duration: 221,407ms)',
  }
  const source = `
    import {handler} from './src/filters/firebase/perfTrace'
    const entry = ${JSON.stringify(entry)}
    const first = await handler({})
    first.hooks.onNewLine(entry)
    first.hooks.onNewLine(entry)
    const second = await handler({})
    second.hooks.onNewLine(entry)
  `
  const child = Bun.spawn([process.execPath, '--eval', source], {
    cwd: new URL('..', import.meta.url).pathname,
    env: {...process.env, NO_COLOR: '1'}, stdout: 'pipe', stderr: 'pipe',
  })
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
  ])
  expect(code).toBe(0)
  expect(stderr).toBe('')
  const lines = stdout.trim().split('\n')
  expect(lines).toHaveLength(3)
  expect(lines[0]).toContain('checkout (counter: 1): 0.221407')
  expect(lines[1]).toContain('checkout (counter: 2)')
  expect(lines[2]).toContain('checkout (counter: 1)')
})
