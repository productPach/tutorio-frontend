export const getYearWord = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return "год";
    } else if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
    ) {
      return "года";
    } else {
      return "лет";
    }
  };