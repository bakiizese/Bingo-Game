import { boards, Kboard } from "@/db/schema";
import migrations from "@/drizzle/migrations";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync } from "expo-sqlite";
import AsyncStorage from "expo-sqlite/kv-store";

type BingoBoard = {
  id: string;
  data: {
    [key: string]: string[];
  };
};

export const DataBase_name = "boards";

const expoDb = openDatabaseSync(DataBase_name);
export const db = drizzle(expoDb);

export const useM = () => {
  return useMigrations(db, migrations);
};

export const addDummy = async () => {
  const value = AsyncStorage.getItemSync("dbIntialized");
  if (value) return;

  console.log("inserting lists");
  AsyncStorage.setItemSync("dbInitialized", "true");
};

export const initializeDB = async () => {
  const initialized = await AsyncStorage.getItem("dbInitialized");
  if (initialized) return;

  await AsyncStorage.setItem("dbInitialized", "true");
  console.log("Database initialized");
};

export const insertData = async (newDB: BingoBoard) => {
  const data_db = newDB.data;

  try {
    await db.insert(boards).values({
      id: newDB.id,
      B: data_db.B.join(","),
      I: data_db.I.join(","),
      N: data_db.N.join(","),
      G: data_db.G.join(","),
      O: data_db.O.join(","),
    });
    getMineData();
    return true;
  } catch {
    return false;
  }
};

export const toObject = (data: Kboard[]) => {
  const listOfData = [];
  for (let i = 0; i < data.length; i++) {
    const sData = data[i];
    const result = {
      id: sData.id,
      data: {
        B: sData.B.split(","),
        I: sData.I.split(","),
        N: sData.N.split(","),
        G: sData.G.split(","),
        O: sData.O.split(","),
      },
    };
    listOfData.push(result);
  }
  return listOfData;
};
export const getById = async (id: string) => {
  const result = await db.select().from(boards).where(eq(boards.id, id));
  return result;
};

export const getAll = () => {
  const result = db.select().from(boards).all();
  return result;
};

export const remove = (id: string) => {
  try {
    db.delete(boards).where(eq(boards.id, id)).run();
    return true;
  } catch {
    return false;
  }
};

export const deleteAll = () => {
  try {
    db.delete(boards).run();
    return true;
  } catch {
    return false;
  }
};

export const updateData = async (boardData: BingoBoard, oldBoardId: string) => {
  const datab = boardData.data;

  try {
    await db
      .update(boards)
      .set({
        id: boardData.id,
        B: datab.B.join(","),
        I: datab.I.join(","),
        N: datab.N.join(","),
        G: datab.G.join(","),
        O: datab.O.join(","),
      })
      .where(eq(boards.id, oldBoardId));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getMineData = () => {
  const allData = getAll();
  const boardData = toObject(allData);
  return boardData;
};
