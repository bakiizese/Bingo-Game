import bingoBack from "@/assets/images/b-bingo2.jpg";
import kartelaBackground from "@/assets/images/kartela_background.jpg";
import { useAppContext } from "@/components/AppContext";
import AppGradient from "@/components/AppGradient";
import Board from "@/components/Board";
import Camera from "@/components/Camera";
import GameSet from "@/components/GameSet";
import Menu from "@/components/Menu";
import StaticCell from "@/components/StaticCell";
import { GoldenKartelaData } from "@/constants/Board_module/Golden";
import { TamrinKartelaData } from "@/constants/Board_module/Tamrin";
import { getMineData } from "@/utils/SqliteDb";
import { AntDesign } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//type annotation for vars that hold board data
type BingoBoard = {
  id: string;
  data: {
    [key: string]: string[];
  };
};

type Rule = {
  type: string;
  side: string;
  numOf: string;
};
type Rules = Rule[];

//main screen, Dashboard
const App = () => {
  const [permission, requestPermission] = useCameraPermissions(); //to get permission for camera
  const [menu, setMenu] = useState(false); //boolean: to show or hide menu when + is clicked
  const [camera, setCamera] = useState(false); //boolean: to show or hide camera component
  const [board, setBoard] = useState(false); //boolean: to show or hide the
  const [clicked, setClicked] = useState<string[]>([]); //array: to get and set Clicked cells
  const { storedData, setStoredData } = useAppContext(); //array: global to store id for boards that should appear in index dashboard
  const [boardData, setBoardData] = useState<BingoBoard>({
    //BingoBoar: default setter and getter dataBoard for edit board
    id: "new",
    data: {
      B: ["1", "2", "3", "4", "5"],
      I: ["16", "17", "18", "19", "20"],
      N: ["31", "32", "F", "34", "35"],
      G: ["46", "47", "48", "49", "50"],
      O: ["71", "72", "73", "74", "75"],
    },
  });
  const [availableNums, setAvailableNums] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [gameType, setGameType] = useState(false);
  const [gameRules, setGameRules] = useState<Rules | undefined>([]);
  const { updateMineData } = useAppContext();
  const [mineData, setMineData] = useState<BingoBoard[]>(getMineData());

  // const [mineBoard, setMineBoard] = useState<BingoBoard[]>(mineBoardData);
  // const [auto, setAuto] = useState(false);

  const plusData = {
    id: "+",
    data: {
      B: [],
      I: [],
      N: [],
      G: [],
      O: [],
    },
  };

  //runs once when component renders to show the + button on dashboard to add boards by adding a "+" id to global setStoredData
  useEffect(() => {
    setStoredData((prevId) => {
      const oldData = [...prevId];
      if (!oldData.some((item) => item.id === "+")) {
        oldData.push({ id: "+", type: "add" });
      }
      return oldData;
    });
  }, []);

  useEffect(() => {
    setMineData(getMineData());
  }, [updateMineData]);

  const checkData = async () => {};
  // const gameStart = () => {
  //   EvaluateGame(gameRules, clicked, storedData);
  // };
  // useEffect(() => {
  //   if (auto) {
  //     EvaluateGame(gameRules, clicked, storedData);
  //   }
  // }, [clicked]);

  const boardCellNumbers = () => {
    clearClicked();
    setAvailableNums([]);

    if (storedData && storedData?.length < 2) {
      setShowHelp(false);
      return;
    }

    type BingoKey = "B" | "I" | "N" | "G" | "O";

    storedData?.map((krt) => {
      const board = krt;
      const boardKartelaData =
        board.type === "Golden"
          ? GoldenKartelaData
          : board.type === "Tamrin"
          ? TamrinKartelaData
          : mineData;

      const addedData = boardKartelaData?.find((brds) => brds.id === board.id);
      Object.keys(addedData?.data || {}).forEach((key) => {
        const colData = addedData?.data[key as BingoKey];
        colData?.map((num) => {
          if (num !== "F") {
            setAvailableNums((prevNum) => {
              if (!prevNum.includes(num)) {
                return [...(prevNum || []), num].sort(
                  (a, b) => Number(a) - Number(b)
                );
              }
              return prevNum;
            });
          }
          return;
        });
      });
    });
  };

  const clearClicked = () => {
    setClicked([]);
  };

  const addClicked = (cell: string) => {
    if (!clicked?.includes(cell)) {
      setClicked?.((prev) => [...(prev || []), cell]);
    } else {
      setClicked?.((prev) => prev.filter((item) => item !== cell));
    }
  };

  //runs when component renders and also when permission updates, to request permission if not granted
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Simulate fetching new data
  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View className="flex-1">
      <AppGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.7)"]}
        backgroundI={bingoBack}
      >
        <SafeAreaView className="flex-1 px-1">
          <View className="flex-1 justify-center">
            <FlatList
              data={storedData}
              keyExtractor={(item) => item.id}
              numColumns={2}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => {
                const getBoardType =
                  item.type === "Golden"
                    ? GoldenKartelaData
                    : item.type === "Tamrin"
                    ? TamrinKartelaData
                    : mineData; ///which later is gonna be sqlite and mine
                const findBoard =
                  item.id === "+"
                    ? plusData
                    : getBoardType.find((brd) => brd.id === item.id);
                if (!findBoard) return null;
                if (findBoard.id === "+") {
                  return (
                    <View className="bg-slate-300 my-3 mx-2 rounded-2xl w-52 h-80 items-center justify-center">
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setMenu(true)}
                      >
                        <AntDesign name="pluscircle" size={100} color="green" />
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  return (
                    <Board
                      boardData={findBoard}
                      clicked={clicked}
                      setClicked={setClicked}
                      type={"play"}
                      boardType={item.type}
                      isLive={isLive}
                    />
                  );
                }
              }}
            />

            {menu && (
              <Menu
                setmenu={setMenu}
                setcamera={setCamera}
                setboard={setBoard}
              />
            )}

            {board && (
              <Board
                containerStyle="z-20 absolute self-center"
                boardData={boardData}
                setBoardData={setBoardData}
                setBoard={setBoard}
                type={"edit"}
              />
            )}
            {camera && <Camera setCamera={setCamera} />}
            {gameType && (
              <GameSet
                onRemove={() => setGameType(false)}
                setGameRules={setGameRules}
              />
            )}
          </View>

          {showHelp ? (
            <View className="justify-center">
              <View>
                <ImageBackground
                  resizeMode="cover"
                  className="flex flex-row py-1 px-1 justify-between"
                  source={kartelaBackground}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="bg-gray-200 rounded-lg"
                    onPress={() => setClicked([])}
                  >
                    <Text className="font-bold text-xl mx-1">Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="bg-gray-200 rounded-lg"
                    onPress={() => {
                      setShowHelp(false), setAvailableNums([]);
                      setIsLive(false);
                    }}
                  >
                    <Text className="font-bold text-xl mx-1">Close</Text>
                  </TouchableOpacity>
                </ImageBackground>
                <ImageBackground
                  resizeMode="cover"
                  className="flex flex-row flex-wrap gap-1 justify-center py-2"
                  source={kartelaBackground}
                >
                  {availableNums.map((n) => (
                    <StaticCell
                      key={n}
                      text={n}
                      textStyling="text-2xl"
                      cellStyling="w-7 h-7"
                      callFunc={addClicked}
                      clicked={clicked}
                    />
                  ))}
                </ImageBackground>
              </View>
            </View>
          ) : (
            storedData &&
            storedData?.length > 1 && (
              <View className="absolute px-36 right-0 bottom-5 bg-transparent left-0 justify-center items-center">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="bg-green-700 w-full py-2 mb-1 justify-center items-center rounded-3xl"
                  onPress={() => {
                    setShowHelp(true), boardCellNumbers();
                    setIsLive(true);
                    // if (auto) {
                    //   gameStart();
                    // }
                  }}
                >
                  <Text className="text-2xl font-bold">Play</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setClicked([]);

                    checkData();
                  }}
                  className="bg-green-700 w-full py-2 mb-1 justify-center items-center rounded-3xl"
                >
                  <Text className="text-2xl font-bold">Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log(storedData);
                    setStoredData([{ id: "+", type: "add" }]);
                  }}
                  className="bg-green-700 w-full py-2 mb-1 justify-center items-center rounded-3xl"
                >
                  <Text className="text-2xl font-bold">Remove All</Text>
                </TouchableOpacity>
              </View>
            )
          )}
          <StatusBar style="inverted" />
        </SafeAreaView>
      </AppGradient>
    </View>
  );
};

export default App;
