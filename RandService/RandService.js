export class RandService {
  static uniqueRandomNumbers(count, lowerLimit, upperLimit) {
    let uniqueNumbers = [];

    while (uniqueNumbers.length !== count) {
      const currentNumber = RandService.randomNumberInRange(lowerLimit, upperLimit);
      const isIncludedNumber = uniqueNumbers.some(num => num === currentNumber);

      if (!isIncludedNumber) {
        uniqueNumbers.push(currentNumber);
      }
    }

    return uniqueNumbers;
  }

  static randomNumberInRange(lowerLimit, upperLimit) {
    return Math.floor(Math.random() * (1 + upperLimit - lowerLimit)) + lowerLimit;
  }
}