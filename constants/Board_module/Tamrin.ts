import TamrinBoards from "@/constants/Board_module/TamrinBoards.json";

const transform = Object.entries(TamrinBoards).map(([id, grid]) => {
  const single = {
    id: id,
    data: {
      B: grid[0],
      I: grid[1],
      N: grid[2],
      G: grid[3],
      O: grid[4],
    },
  };
  return single;
});
export const TamrinKartelaData = transform;
