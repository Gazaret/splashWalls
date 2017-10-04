// @flow
import type { TouchInfo } from '../../App'

const DOUBLE_TAP_DELAY = 300;
const DOUBLE_TAP_RADIUS = 20;

export class UtilsService {
  static isDoubleTap(currentTimestamp: number, prevTouchInfo: TouchInfo, x1: number, y1: number): boolean {
    const {x, y, timestamp} = prevTouchInfo;
    const timeDiff = currentTimestamp - timestamp;

    return (timeDiff < DOUBLE_TAP_DELAY && UtilsService.distance(x, y, x1, y1) < DOUBLE_TAP_RADIUS);
  }

  static distance(x0: number, y0: number, x1: number, y1: number): number {
    return Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2));
  }
}