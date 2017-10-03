const DOUBLE_TAP_DELAY = 300;
const DOUBLE_TAP_RADIUS = 20;

export class UtilsService {
  static isDoubleTap(currentTimestamp, prevTouchInfo, x1, y1) {
    const {x, y, timestamp} = prevTouchInfo;
    const timeDiff = currentTimestamp - timestamp;

    return (timeDiff < DOUBLE_TAP_DELAY && UtilsService.distance(x, y, x1, y1) < DOUBLE_TAP_RADIUS);
  }

  static distance(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
  }
}