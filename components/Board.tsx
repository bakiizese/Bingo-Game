import kartelaBackground from "@/assets/images/kartela_background.jpg";
import { AllColNumbers } from "@/constants/AllBoardNumber";
import { getById, insertData } from "@/utils/SqliteDb";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "./AppContext";
import BoardEdit from "./BoardEdit";
import StaticCell from "./StaticCell";

type BoardColumns = "B" | "I" | "N" | "G" | "O";

type BoardData = {
  [key in BoardColumns]: string[];
};
type BingoBoard = {
  id: string;
  data: {
    [key: string]: string[];
  };
};

const Board = ({
  boardData, // a stored boardData where the board is created up on this data
  setBoardData, // a setter boardData to set id and data, where the board is created up on this data
  setBoard, // a setter boolean value to determain to close the edit board(only in type edit board)
  containerStyle, // a containerStyle to style the whole boards view
  idStyling, // a idstyling for each id of a board to help resize according where board is created i.e. store, (play, edit)
  cellStyling = "w-9 h-9 bg-gray-200", //a cellstyling for each cell with default value to help resize cell according where board is created i.e. store or (play, edit)
  textStyling = "text-3xl", //a textstyling for each cell with default value to help resize text according where board is created i.e. store or (play, edit)
  type, // this string arg holds 'play', 'store' or 'edit' to determain on which screen the board is beign created
  clicked, // array data from index.tsx that stores only clicked cells
  setClicked, // array setter from index.tsx that add or removes clicked cells
  boardType,
  isLive,
  prevId,
  setIdNew,
}: {
  boardData: BingoBoard;
  setBoardData?: React.Dispatch<React.SetStateAction<BingoBoard>>;
  setBoard?: (val: boolean) => void;
  containerStyle?: string;
  idStyling?: string;
  cellStyling?: string;
  textStyling?: string;
  type?: string;
  clicked?: string[];
  setClicked?: React.Dispatch<React.SetStateAction<string[]>>;
  boardType?: string;
  isLive?: boolean;
  prevId?: string;
  setIdNew?: (val: string) => void;
}) => {
  const [manKey, setManKey] = useState(false); //boolean: for edit mode only and activated only when cell is clicked and shows coresponding data from that col
  const [currentText, setCurrentText] = useState(""); //string: for edit mode only, to change the text gotten from picking from mankey(help key)
  const [colTitle, setColTitle] = useState(""); //string: to get and set col title of a clicked cell
  const [editId, setEditId] = useState(false); //boolean: to get and set when an id is on editable text or on static text in edit mode
  const [id, setId] = useState(boardData.id); //string: to get and set the id of the current board useful on the while editing boardid in edit mode
  const { storedData, setStoredData } = useAppContext(); //string: global setter and getter of id of all board that are inside index.tsx
  const [staticStyling, setStaticStyling] = useState(""); //string: getter and setter style for static cells
  const { setUpdateMineData, setShowNot, setNotContent } = useAppContext();
  const [editBoard, setEditBoard] = useState(false);

  //runs every time id is changes and sets the id of the board with new updated id
  useEffect(() => {
    if (setBoardData) {
      setBoardData({ ...boardData, id });
    }
  }, [id]);

  useEffect(() => {
    if (isLive) {
      setEditBoard(false);
    }
  }, [isLive]);

  //runs once when component renders to set the statiStyle
  useEffect(() => {
    if (cellStyling === "w-9 h-9 bg-gray-200") {
      if (boardType === "Tamrin") {
        setStaticStyling("w-9 h-11 bg-red-100");
      } else if (boardType === "Golden") {
        setStaticStyling("w-9 h-11 bg-yellow-100");
      } else {
        setStaticStyling("w-9 h-11 bg-green-100");
      }
    } else {
      setStaticStyling("w-5 h-5 bg-gray-200");
    }
  });
  //called when in edit mode of the id and is blured
  const handleBlur = () => {
    setEditId(false);
  };

  //called when a cell is clicked only on edit mode to update the cells value by updating setBoardData
  const changeText = (newText: string) => {
    if (currentText === "F") {
      return <></>;
    }
    const idx = boardData?.data[colTitle]?.findIndex(
      (item) => item === currentText
    );
    if (idx !== -1) {
      let tempData: BingoBoard = { ...boardData };

      if (tempData.data && tempData.data[colTitle]) {
        tempData.data[colTitle] = tempData.data[colTitle]?.map((val, i) => {
          const txt = i === idx ? newText : val;
          return txt;
        });
        setBoardData?.(tempData);
      }
    }
  };

  //called when cell is clicked on edit mode only to update the cell with this helpkeys
  const helpKey = () => {
    const number = AllColNumbers[colTitle].filter(
      (num) => !boardData.data[colTitle].includes(num)
    );
    return (
      <>
        {number.map((n) => (
          <StaticCell callFunc={changeText} key={n} text={n} />
        ))}
      </>
    );
  };

  //called when a cell is clicked to get marked or unmarked(added to clicked array) play mode
  const addClicked = (cell: string) => {
    if (clicked?.includes(cell)) {
      setClicked?.((prev) => prev.filter((item) => item !== cell));
    } else {
      setClicked?.((prev) => [...(prev || []), cell]);
    }
  };

  //called when a add icon is clicked from store or edit mode too add it to index.tsx by appending the id to setStoredData
  const addBoard = async () => {
    console.log("here");
    const getSingle = await getById(boardData.id);
    if (getSingle.length < 1) {
      const added = await insertData(boardData);
      if (added) {
        setUpdateMineData((prev) => prev + 1);
        console.log("succesfuly added new Board");
      } else {
        console.log("error while inserting new Board");
      }

      if (!storedData?.some((item) => item.id === boardData.id)) {
        setStoredData((prevIds) => {
          const newArr = [...prevIds];
          const index = (storedData?.length ?? 0) - 1;
          const newData = { id: boardData.id, type: "Mine" };
          newArr.splice(index, 0, newData);
          return newArr;
        });
      }
      setBoard?.(false);
    } else {
      setNotContent(`Id: ${boardData.id} Already Exist In DataBase`);
      setShowNot(true);
      console.log("id already exists");
    }
  };

  //called when the remove icon is clicked from index only to remove it from index by removing the id from storedData
  const removeBoard = () => {
    setStoredData((prevIds) =>
      prevIds.filter(
        (item) => !(item.id === boardData.id && item.type === boardType)
      )
    );
  };

  return (
    <View className={`my-4 mx-2 ${containerStyle}`}>
      <ImageBackground
        source={kartelaBackground}
        resizeMode="cover"
        className="w-fit h-fit py-3 px-2 justify-center"
        imageStyle={{ borderRadius: 14 }}
      >
        <View
          className={`absolute inset-0 rounded-[14px] ${
            boardType === "Tamrin"
              ? "bg-red-500/60"
              : boardType === "Golden"
              ? "bg-orange-400/60"
              : ""
          }`}
        />
        <View>
          {(type === "edit" || type === "play") && !isLive && (
            <TouchableOpacity
              className="absolute -right-2 -top-3 z-10"
              onPress={() => {
                setBoard?.(false);
                removeBoard();
              }}
            >
              <MaterialCommunityIcons
                name="delete-circle-outline"
                size={35}
                color="#FF6961"
              />
            </TouchableOpacity>
          )}
          {boardType === "Mine" && !isLive && (
            <TouchableOpacity
              className="absolute -left-2 -top-3 z-10"
              onPress={() => setEditBoard(true)}
            >
              <MaterialCommunityIcons
                name="circle-edit-outline"
                size={35}
                color="#FF6961"
              />
            </TouchableOpacity>
          )}

          {type === "edit" && (
            <TouchableOpacity
              className="absolute -left-2 -top-3 z-10"
              onPress={() => {
                addBoard();
              }}
            >
              <Ionicons name="add-circle" size={35} color="#FF6961" />
            </TouchableOpacity>
          )}
          {boardType && (
            <Text
              className={`absolute -top-4 text-3xl self-center tracking-[10px] ${
                boardType === "Tamrin"
                  ? "text-red-500/60"
                  : boardType === "Golden"
                  ? "text-orange-400/60"
                  : ""
              }`}
            >
              {boardType}
            </Text>
          )}
          {editBoard && (
            <BoardEdit
              containerStyle="z-20 absolute self-center -top-7"
              boardData={boardData}
              setBoardData={setBoardData}
              setBoard={setEditBoard}
            />
          )}

          <View
            className={`flex-row items-center justify-center m-2 ${idStyling}`}
          >
            <Text className="text-2xl font-bold text-white mr-1">ID:</Text>
            {editId && type === "edit" ? (
              <TextInput
                value={id}
                keyboardType="numeric"
                onChangeText={setId}
                onBlur={handleBlur}
                autoFocus
                className="border px-2 py-0 text-2xl text-center h-9 font-bold"
              />
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setEditId(true)}
              >
                <Text className="text-2xl text-white font-bold ">{id}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View key={boardData.id} className="flex flex-row gap-1 ">
          {Object.keys(boardData.data).map((krt, idx) => (
            <View key={idx} className="flex flex-col gap-1">
              <View
                className={`items-center justify-center rounded-md overflow-hidden ${staticStyling}`}
              >
                <Text className={`text-center font-bold ${textStyling}`}>
                  {krt}
                </Text>
              </View>
              {boardData.data[krt]?.map((cell) => (
                <TouchableOpacity
                  key={cell}
                  className={`items-center justify-center rounded-md ${cellStyling}`}
                  style={{
                    backgroundColor: clicked?.includes(cell)
                      ? "#f87171"
                      : "#e5e7eb",
                  }}
                  onPress={() => {
                    if (type === "play") {
                      addClicked(cell);
                    } else if (type?.includes("edit")) {
                      setCurrentText(cell);
                      setColTitle(krt);
                      setManKey(true);
                    }
                  }}
                >
                  <Text className={`text-center font-bold ${textStyling}`}>
                    {cell}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        {manKey && type?.includes("edit") && (
          <ImageBackground
            source={kartelaBackground}
            resizeMode="cover"
            imageStyle={{ borderRadius: 12 }}
            className="absolute justify-center py-2 top-80 mt-0 rounded-b-xl right-0 h-fit w-52 z-10 flex-row flex-wrap gap-1"
          >
            {helpKey()}
          </ImageBackground>
        )}
      </ImageBackground>
    </View>
  );
};

export default Board;
