#!/usr/bin/env node
/**
 * Offline stdin-only manual aggregate observation comparison.
 *
 * Reads ONE bounded JSON object from stdin; returns the source-only report on
 * stdout. Rejects unknown keys and all invalid/PII-shaped inputs without ever
 * echoing the supplied JSON to stdout or stderr. No files, network, storage,
 * clocks, provider connections or customer delivery are used.
 */
import { compareAggregateObservations } from '../src/aggregate-monitor.mjs';

const MAX_BYTES = 16 * 1024;
const INPUT_FIELDS = new Set(['previous', 'current', 'asOf', 'maxAgeHours']);

function plainObject(obj) {
  return obj !== null && typeof obj === 'object' &&
    !Array.isArray(obj) && Object.getPrototypeOf(obj) === Object.prototype;
}

async function boundedStdin() {
  let total = 0;
  const chunks = [];
  for await (const chunk of process.stdin) {
    const bytes = Buffer.from(chunk);
    total += bytes.byteLength;
    if (total > MAX_BYTES) throw new TypeError('input too large');
    chunks.push(bytes);
  }
  if (total === 0) throw new TypeError('empty input');
  return Buffer.concat(chunks, total).toString('utf8');
}

try {
  const request = JSON.parse(await boundedStdin());
  if (!plainObject(request)) throw new TypeError('request object required');
  if (Object.keys(request).some(key => !INPUT_FIELDS.has(key))) {
    throw new TypeError('unknown request field');
  }
  if (!Object.hasOwn(request, 'previous') ||
      !Object.hasOwn(request, 'current') ||
      !Object.hasOwn(request, 'asOf')) {
    throw new TypeError('missing request field');
  }
  const config = {asOf: request.asOf};
  if (Object.hasOwn(request, 'maxAgeHours')) config.maxAgeHours = request.maxAgeHours;
  const report = compareAggregateObservations(request.previous, request.current, config);
  process.stdout.write(JSON.stringify(report) + '\n');
} catch {
  // Do not echo input, tokens, names, emails or rejected field values.
  process.stderr.write('AGGREGATE_INPUT_HOLD\n');
  process.exitCode = 2;
}
