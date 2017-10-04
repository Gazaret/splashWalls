// @flow

export class RandService {
  static uniqueRandomNumbers(count: number, lowerLimit: number, upperLimit: number): number[] {
    let uniqueNumbers: number[] = [];

    while (uniqueNumbers.length !== count) {
      const currentNumber = RandService.randomNumberInRange(lowerLimit, upperLimit);
      const isIncludedNumber = uniqueNumbers.some(num => num === currentNumber);

      if (!isIncludedNumber) {
        uniqueNumbers.push(currentNumber);
      }
    }

    return uniqueNumbers;
  }

  static randomNumberInRange(lowerLimit: number, upperLimit: number): number {
    return Math.floor(Math.random() * (1 + upperLimit - lowerLimit)) + lowerLimit;
  }
}