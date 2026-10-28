# loggrep-client

Runnable TypeScript filter modules for the sibling `loggrep` repository. These examples currently extend the CLI through the package's exported contracts. The next architecture stage will turn this client into a program that executes loggrep as a library.

## Setup

Keep the repositories next to each other:

```text
workspace/
  loggrep/
  loggrep-client/
```

Use **Bun 1.4.3**, pinned in `.tool-versions`. From `loggrep-client/`:

```sh
bun install --cwd ../loggrep --frozen-lockfile
bun install --frozen-lockfile
bun run loggrep -- --help
```

The dependency is `file:../loggrep`; changes in the sibling checkout are consumed locally. For reproducible installation, use the migrated v3 checkout of loggrep. CI checks out both repositories as siblings, using `loggrep` from its `main` branch. Install dependencies in both checkouts: source imports from the local package resolve its dependencies from the sibling repository. No `lib/` output or compilation is required.

## Run examples

Live input requires `adb` and a connected Android device/emulator:

```sh
bun run loggrep -- -m src/filters/customSimple.ts
bun run loggrep -- -m src/filters/reactNative.ts -m src/filters/performance.ts
bun run loggrep -- -m src/filters/firebase/perfTrace.ts
```

To replay the included sanitized checkout scenario without a device:

```sh
bun run loggrep -- -m src/filters/performance_issues.ts -i test/fixtures/scenario.txt
```

This prints skipped-frame warnings and errors between `Scenario: BEGIN checkout` and `Scenario: END checkout`. Running it again starts with fresh state. Replay preserves log order without simulating elapsed time.

## Available modules

- `customSimple.ts`: error-level entries.
- `appsStart.ts`: ActivityManager process-start messages.
- `performance.ts`: Choreographer entries.
- `reactNative.ts`: ReactNativeJS entries.
- `performance_issues.ts`: stateful checkout scenario.
- `pidcat.ts`: device processes for the example package list; edit the list for your app. Requires adb even when reading a recording.
- `firebase/perfTrace.ts`: Firebase Performance traces and cumulative duration reports. See its adjacent README for logging setup.

Modules export an asynchronous `handler` factory, with synchronous predicates/hooks. Keep state inside the factory. Regex fields combine with AND; filters and modules combine with OR. `onNewLine` runs before matching, and all `onLineMatch` hooks run when any module matches.

Import contracts from `loggrep`, the default formatter from `loggrep/format`, and the pidcat handler from `loggrep/filters/pidcat`. Internal `dist/` imports are no longer supported.

## Checks

```sh
bun check
bun test
```

Integration tests exercise the installed CLI and examples with saved logs. There is no lint/formatter dependency in this migration; follow `.editorconfig` and the existing style.
