import { nextState as next } from '../src';

test('next', () => {
  expect(next({}, {})).toEqual({});
  expect(next({a:1}, {})).toEqual({a:1});
  expect(next({}, {b:2})).toEqual({b:2});
  expect(next({a:1,b:2,c:0}, {c:3})).toEqual({a:1,b:2,c:3});
  expect(next({a:1,b:2,c:3}, {d:4})).toEqual({a:1,b:2,c:3,d:4});
  expect(next({a:1,b:2,c:0}, {c:3,d:4})).toEqual({a:1,b:2,c:3,d:4});
  const a1 = [1];
  const b2 = [2];
  const c3 = [3];
  const orig = {a:a1,b:b2,c:c3};
  const copy = next(orig, {d:4});
  expect(orig['a']).toBe(a1);
  expect(orig['b']).toBe(b2);
  expect(orig['c']).toBe(c3);
  expect(copy).toEqual({a:a1,b:b2,c:c3,d:4});
});
