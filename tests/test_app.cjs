// Exercise pure app helpers without a browser or downloaded dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../docs/app.js'), 'utf8');
const context = vm.createContext({});
for (const name of ['placeReadings', 'placeHash']) {
  const line = source.split('\n').find(line => line.startsWith(`function ${name}(`));
  assert.ok(line, `Missing ${name}`);
  vm.runInContext(line, context);
}
const sourceLink = {title: 'Source', url: 'https://example.org/source'};
const book = {title: 'Book', url: 'https://example.org/book'};
assert.equal(context.placeReadings({sources: [sourceLink], reading_list: []})[0], sourceLink);
assert.equal(context.placeReadings({sources: [sourceLink], reading_list: [book]}).length, 2);
assert.equal(context.placeReadings({sources: [sourceLink], reading_list: [sourceLink]}).length, 1);
assert.equal(context.placeHash('#H07'), 'H07');
assert.equal(context.placeHash('#%48%30%37'), 'H07');
assert.equal(context.placeHash('#%broken'), '');
console.log('PASS: source links survive empty reading lists; malformed fragments are ignored.');
