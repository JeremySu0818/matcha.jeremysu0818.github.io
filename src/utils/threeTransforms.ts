import { mix } from './easing';

export type Tuple3 = readonly [number, number, number];

export function mixTuple3(from: Tuple3, to: Tuple3, progress: number): [number, number, number] {
  return [
    mix(from[0], to[0], progress),
    mix(from[1], to[1], progress),
    mix(from[2], to[2], progress),
  ];
}
