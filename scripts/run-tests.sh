#!/usr/bin/env bash
# Runs a test suite for the calling workspace, or skips cleanly when no matching
# test files exist yet. This lets the repo-wide `npm test` work today (before any
# tests are written) and keep working once each runner is installed and specs are added.
#
# Run from a workspace dir so paths resolve against it:
#   bash ../../scripts/run-tests.sh --label backend:unit --bin jest \
#     --glob "src/**/*.spec.ts" [--exclude .e2e-spec.ts] -- [runner args...]
#
# A --glob is "<dir>/**/<name-pattern>"; it is matched with `find` for portability
# (macOS ships Bash 3.2 without globstar).
set -eo pipefail

label="tests"
bin=""
globs=()
excludes=()
passthrough=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --label)   label="$2"; shift 2 ;;
    --bin)     bin="$2"; shift 2 ;;
    --glob)    globs+=("$2"); shift 2 ;;
    --exclude) excludes+=("$2"); shift 2 ;;
    --)        shift; passthrough=("$@"); break ;;
    *)         echo "[$label] unknown argument: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "$bin" || ${#globs[@]} -eq 0 ]]; then
  echo "[$label] misconfigured: --bin and at least one --glob are required" >&2
  exit 2
fi

files=()
for pattern in "${globs[@]}"; do
  name="${pattern##*/}"                 # filename glob, e.g. *.spec.ts
  case "$pattern" in
    */\*\*/*) dir="${pattern%%/\*\**}" ;;  # strip from the first "/**"
    */*)      dir="${pattern%/*}" ;;
    *)        dir="." ;;
  esac
  [[ -d "$dir" ]] || continue
  while IFS= read -r file; do
    skip=false
    if [[ ${#excludes[@]} -gt 0 ]]; then
      for suffix in "${excludes[@]}"; do
        [[ "$file" == *"$suffix" ]] && skip=true && break
      done
    fi
    $skip || files+=("$file")
  done < <(find "$dir" -type f -name "$name" 2>/dev/null)
done

if [[ ${#files[@]} -eq 0 ]]; then
  echo "[$label] no test files yet — skipping"
  exit 0
fi

bin_path="node_modules/.bin/$bin"
if [[ ! -x "$bin_path" ]]; then
  echo "[$label] found ${#files[@]} test file(s) but \"$bin\" is not installed." >&2
  echo "        Install the runner in this workspace, e.g.  npm install -D $bin" >&2
  exit 1
fi

echo "[$label] running $bin on ${#files[@]} file(s)…"
if [[ ${#passthrough[@]} -gt 0 ]]; then
  exec "$bin_path" "${passthrough[@]}"
else
  exec "$bin_path"
fi
