import kartelaBackground from "@/assets/images/kartela_background.jpg";
import { remove } from "@/utils/SqliteDb";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "./AppContext";

type BingoBoard = {
  id: string;
  data: {
    [key: string]: string[];
  };
};

type StoreBoardProp = {
  boardData: BingoBoard;
  background: string;
  mode: string;
  setEditBoard?: (val: boolean) => void;
  setBoardData?: React.Dispatch<React.SetStateAction<BingoBoard>>;
};

const StoreBoard = ({
  boardData,
  background,
  mode,
  setEditBoard,
  setBoardData,
}: StoreBoardProp) => {
  const { storedData, setStoredData, setUpdateMineData } = useAppContext(); //string: global setter and getter of id of all board that are inside index.tsx
  const [added, setAdded] = useState(false);
  //called when a add icon is clicked from store or edit mode too add it to index.tsx by appending the id to setStoredData
  const addBoard = () => {
    setStoredData((prevIds) => {
      const newArr = [...prevIds];
      const newData = { id: boardData.id, type: background };
      const index = (storedData?.length ?? 0) - 1;
      if (
        !newArr.some(
          (item) => item.id === boardData.id && item.type === background
        )
      ) {
        newArr.splice(index, 0, newData);
      }

      return newArr;
    });
    console.log(storedData);
  };

  const updateBoard = () => {
    if (setEditBoard && setBoardData) {
      setEditBoard(true);
      setBoardData(boardData);
    }
  };

  useEffect(() => {
    if (
      storedData?.some(
        (item) => item.id === boardData.id && item.type === background
      )
    ) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [storedData]);

  const removeBoard = () => {
    const result = remove(boardData.id);
    if (result) {
      setUpdateMineData((prev) => prev + 1);
      setStoredData((prevIds) =>
        prevIds.filter(
          (item) => !(item.id === boardData.id && item.type === background)
        )
      );
      console.log(boardData.id + ": removed successfuly");
    } else {
      console.log("unable to remove: " + boardData.id);
    }
  };

  return (
    <View className="my-4 mx-2">
      <ImageBackground
        source={kartelaBackground}
        resizeMode="cover"
        className="w-fit h-fit py-3 px-2 justify-center"
        imageStyle={{ borderRadius: 14 }}
      >
        <View
          className={`absolute inset-0 rounded-[14px] ${
            background === "Tamrin"
              ? "bg-red-500/60"
              : background === "Golden"
              ? "bg-orange-400/60"
              : ""
          }`}
        />
        <View>
          <TouchableOpacity
            className="absolute -right-2 -top-3 z-10"
            onPress={() => {
              removeBoard();
            }}
          >
            <MaterialCommunityIcons
              name="delete-circle-outline"
              size={35}
              color="#FF6961"
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={
              mode === "add" &&
              storedData?.some(
                (item) => item.id === boardData.id && item.type === background
              )
            }
            className="absolute -left-2 -top-3 z-10"
            onPress={() => {
              if (mode === "add") {
                addBoard();
              } else if (mode === "update") {
                updateBoard();
              }
            }}
          >
            {mode === "update" ? (
              <MaterialCommunityIcons
                name="circle-edit-outline"
                size={35}
                color="#FF6961"
              />
            ) : added ? (
              <Ionicons name="checkmark" size={35} color="#FF6961" />
            ) : (
              <Ionicons name="add-circle" size={35} color="#FF6961" />
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center m-2 mb-1 mt-5">
            <Text className="text-2xl text-white font-bold ">
              {boardData.id}
            </Text>
          </View>
        </View>
        <View key={boardData.id} className="flex flex-row gap-1 ">
          {Object.keys(boardData.data).map((krt, idx) => (
            <View key={idx} className="flex flex-col gap-1">
              <View className="bg-gray-200 items-center justify-center rounded-md overflow-hidden w-5 h-5">
                <Text className="text-center font-bold text-1xl">{krt}</Text>
              </View>
              {boardData.data[krt]?.map((cell) => (
                <View
                  key={cell}
                  className="bg-gray-200 items-center justify-center rounded-md w-5 h-5"
                >
                  <Text className="text-center font-bold text-1xl">{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ImageBackground>
    </View>
  );
};

export default StoreBoard;
