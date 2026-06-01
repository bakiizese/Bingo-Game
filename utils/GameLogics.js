const GameLogics = (clicked, side, num) => {
  let result = { type: "", side: "", numOf: "" };
  if (clicked.length === 5) {
    if (clicked.every((val) => val[0] === clicked[0][0])) {
      // console.log("its a horizontal line");

      result = {
        type: "Line",
        side: side === "As-It" ? "V" : side,
        numOf: num,
      };
    } else if (clicked.every((val) => val[1] === clicked[0][1])) {
      // console.log("its a vertical line");
      result = {
        type: "Line",
        side: side === "As-It" ? "H" : side,
        numOf: num,
      };
    } else if (
      clicked.every((val) => val[0] - val[1] === 0) ||
      clicked.every((val) => val[0] + val[1] === 4)
    ) {
      // console.log("its a diagonal line");
      result = {
        type: "Diagonal",
        side: side, ///its always Any
        numOf: num,
      };
    } else {
      console.log("other");
    }
  } else if (clicked.length === 4) {
    const qr = clicked.sort((a, b) => {
      if (a[0] !== b[0]) return a[0] - b[0];
      return a[1] - b[1];
    });

    const added = [qr[0][0] + 1, qr[0][1] + 1];
    const exists = qr.some(([a, b]) => a === added[0] && b === added[1]);
    const minus = [qr[1][0] + 1, qr[1][1] - 1];
    const existsM = qr.some(([a, b]) => a === minus[0] && b === minus[1]);
    if (exists && existsM) {
      // console.log("its a sqaure");
      result = {
        type: "Square",
        side: side, ///its always Any
        numOf: num,
      };
    } else {
      console.log("not square");
    }
  } else if (clicked.length === 9) {
    let Tside = "T";
    let topT = clicked.filter((val) => val[0] === 0);
    if (topT.length !== 5) {
      topT = clicked.filter((val) => val[0] === 4);
      Tside = "B";
      if (topT.length !== 5) {
        topT = clicked.filter((val) => val[1] === 0);
        Tside = "L";
        if (topT.length !== 5) {
          topT = clicked.filter((val) => val[1] === 4);
          Tside = "R";
        }
      }
    }
    const filtered = clicked.filter(
      ([a, b]) => !topT.some(([x, y]) => x === a && y === b)
    );

    if (
      filtered.every((val) => val[0] === 2) ||
      filtered.every((val) => val[1] === 2)
    ) {
      // console.log("its a T");
      result = {
        type: "T",
        side: side === "As-It" ? Tside : side,
        numOf: num,
      };
    }
  }

  return result;
};

export default GameLogics;
