import kartelaBackground from "@/assets/images/kartela_background.jpg";
import { AllColNumbers } from "@/constants/AllBoardNumber";
import { getById, updateData } from "@/utils/SqliteDb";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import cloneDeep from "lodash.clonedeep";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "./AppContext";
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

const BoardEdit = ({
  boardData, // a stored boardData where the board is created up on this data
  setBoardData, // a setter boardData to set id and data, where the board is created up on this data
  setBoard, // a setter boolean value to determain to close the edit board(only in type edit board)
  containerStyle, // a containerStyle to style the whole boards view
  idStyling, // a idstyling for each id of a board to help resize according where board is created i.e. store, (play, edit)
  cellStyling = "w-9 h-9 bg-gray-200", //a cellstyling for each cell with default value to help resize cell according where board is created i.e. store or (play, edit)
  textStyling = "text-3xl", //a textstyling for each cell with default value to help resize text according where board is created i.e. store or (play, edit)
  boardType,
}: {
  boardData: BingoBoard;
  setBoardData?: React.Dispatch<React.SetStateAction<BingoBoard>>;
  setBoard?: (val: boolean) => void;
  containerStyle?: string;
  idStyling?: string;
  cellStyling?: string;
  textStyling?: string;
  boardType?: string;
}) => {
  const [manKey, setManKey] = useState(false); //boolean: for edit mode only and activated only when cell is clicked and shows coresponding data from that col
  const [currentText, setCurrentText] = useState(""); //string: for edit mode only, to change the text gotten from picking from mankey(help key)
  const [colTitle, setColTitle] = useState(""); //string: to get and set col title of a clicked cell
  const [editId, setEditId] = useState(false); //boolean: to get and set when an id is on editable text or on static text in edit mode
  const [id, setId] = useState(boardData.id); //string: to get and set the id of the current board useful on the while editing boardid in edit mode
  const { storedData, setStoredData, setNotContent, setShowNot } =
    useAppContext(); //string: global setter and getter of id of all board that are inside index.tsx
  const [staticStyling, setStaticStyling] = useState(""); //string: getter and setter style for static cells
  const { setUpdateMineData } = useAppContext();

  const [currentBoardData, setCurrentBoardData] = useState<BingoBoard>(
    cloneDeep(boardData)
  );
  //runs every time id is changes and sets the id of the board with new updated id
  useEffect(() => {
    if (setCurrentBoardData) {
      setCurrentBoardData({ ...currentBoardData, id });
    }
  }, [id]);

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
    const idx = currentBoardData?.data[colTitle]?.findIndex(
      (item) => item === currentText
    );
    if (idx !== -1) {
      let tempData: BingoBoard = { ...currentBoardData };

      if (tempData.data && tempData.data[colTitle]) {
        tempData.data[colTitle] = tempData.data[colTitle]?.map((val, i) => {
          const txt = i === idx ? newText : val;
          return txt;
        });
        setCurrentBoardData?.(tempData);
      }
    }
  };

  //called when cell is clicked on edit mode only to update the cell with this helpkeys
  const helpKey = () => {
    const number = AllColNumbers[colTitle].filter(
      (num) => !currentBoardData.data[colTitle].includes(num)
    );
    return (
      <>
        {number.map((n) => (
          <StaticCell callFunc={changeText} key={n} text={n} />
        ))}
      </>
    );
  };

  const updateBoard = async () => {
    let oldBoardId = boardData.id;
    const idExists = await getById(currentBoardData.id);
    if (oldBoardId !== currentBoardData.id && idExists.length > 0) {
      setNotContent(`Another Board Exists By This Id: ${currentBoardData.id}`);
      setShowNot(true);
      console.log("Another Board Exists by this Id " + currentBoardData.id);
    } else {
      const updated = await updateData(currentBoardData, oldBoardId);
      if (updated) {
        setBoardData?.(currentBoardData);
        if (
          oldBoardId !== currentBoardData.id &&
          storedData.some(
            (item) => item.id === oldBoardId && item.type === "Mine"
          )
        ) {
          setStoredData((prev) => {
            const newArr = [...prev];
            const index = newArr.findIndex(
              (el) => el.id === oldBoardId && el.type === "Mine"
            );
            if (index !== -1) {
              newArr[index].id = currentBoardData.id;
            }
            return newArr;
          });
        }
        setUpdateMineData((prevd) => prevd + 1);
        setBoard?.(false);
      }
    }
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
          <TouchableOpacity
            className="absolute -right-2 -top-4 z-10"
            onPress={() => {
              setBoard?.(false);
            }}
          >
            <FontAwesome name="remove" size={35} color="#FF6961" />
          </TouchableOpacity>

          <TouchableOpacity
            className="absolute -left-2 -top-3 z-10"
            onPress={() => {
              updateBoard();
            }}
          >
            <AntDesign name="save" size={30} color="#FF6961" />
          </TouchableOpacity>

          <View
            className={`flex-row items-center justify-center m-2 ${idStyling}`}
          >
            <Text className="text-2xl font-bold text-white mr-1">ID:</Text>
            {editId ? (
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
        <View key={currentBoardData.id} className="flex flex-row gap-1 ">
          {Object.keys(currentBoardData.data).map((krt, idx) => (
            <View key={idx} className="flex flex-col gap-1">
              <View
                className={`items-center justify-center rounded-md overflow-hidden ${staticStyling}`}
              >
                <Text className={`text-center font-bold ${textStyling}`}>
                  {krt}
                </Text>
              </View>
              {currentBoardData.data[krt]?.map((cell) => (
                <TouchableOpacity
                  key={cell}
                  className={`items-center justify-center rounded-md ${cellStyling}`}
                  style={{
                    backgroundColor: "#e5e7eb",
                  }}
                  onPress={() => {
                    setCurrentText(cell);
                    setColTitle(krt);
                    setManKey(true);
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
        {manKey && (
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

export default BoardEdit;
