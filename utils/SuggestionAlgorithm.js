const BoardSelector = (IdList) => {
  const boardData = GetBoardData(IdList); /// [{id: 1, data: []}, {id: 2, data: []}, {id: 3, data: []}]
  let counterData = [];
  let uniqueData = [];

  for (const i of boardData) {
    let counter = 0;
    let unique = [];
    for (const [key, value] of Object.entries(i)) {
      for (const data of boardData) {
        if (data.data.includes(value)) {
          counter += 1;
        } else {
          unique.push(value);
        }
      }
    }
    counterData.push({ id: i.id, data: counter });
    counter = 0;
    uniqueData.push({ id: i.id, data: unique });
    unique = [];
  }
  //   console.log(counterData);
  console.log(uniqueData);
};

const GetBoardData = (IdList) => {
  return [
    {
      id: 1,
      data: [
        1, 3, 12, 15, 9, 20, 24, 18, 26, 22, 43, 33, 30, 45, 47, 49, 52, 58, 51,
        62, 74, 67, 60, 64,
      ],
    },
    {
      id: 2,
      data: [
        5, 10, 8, 14, 2, 29, 19, 22, 21, 26, 34, 37, 42, 39, 53, 48, 56, 59, 50,
        70, 65, 74, 69, 71,
      ],
    },
    {
      id: 3,
      data: [
        3, 6, 11, 13, 15, 17, 24, 18, 23, 20, 38, 32, 35, 36, 58, 49, 55, 54,
        60, 63, 68, 66, 73, 75,
      ],
    },
    {
      id: 4,
      data: [
        9, 7, 2, 12, 14, 28, 27, 23, 16, 19, 31, 30, 44, 41, 47, 59, 52, 53, 50,
        65, 61, 72, 67, 70,
      ],
    },
  ];
};

BoardSelector("s");
