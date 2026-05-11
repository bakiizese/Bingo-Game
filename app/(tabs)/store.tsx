import bingoBack from "@/assets/images/b-bingo2.jpg";
import { GoldenKartelaData } from "@/constants/Board_module/Golden";
import { TamrinKartelaData } from "@/constants/Board_module/Tamrin";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppContext } from "@/components/AppContext";
import AppGradient from "@/components/AppGradient";
import BoardEdit from "@/components/BoardEdit";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import StoreBoard from "@/components/StoreBoard";
import { deleteAll, getMineData } from "@/utils/SqliteDb";
import { useRoute } from "@react-navigation/native";

type BingoBoard = {
  id: string;
  data: {
    [key: string]: string[];
  };
};

type BingoList = BingoBoard[];

//renders each board from data stored in kartelData, to choose which board to play with
const Store = () => {
  const [searchText, setSearchText] = useState("");
  const [kartelaDatas, setKartelaDatas] = useState<BingoBoard>();
  // const [search, setSearch] = useState<string>("");/
  const flatListRef = useRef<FlatList | null>(null);
  const [showAll, setShowAll] = useState(true);
  const route = useRoute();
  const [useFrom, setUseFrom] = useState<BingoList>();
  const [footer, setFooter] = useState("Search Using Id For More Kartelas");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { updateMineData, setUpdateMineData, setStoredData } = useAppContext();
  const [getMode, setGetMode] = useState<string>("add");
  const [saveEdit, setSaveEdit] = useState<string>("Edit All");
  const [editBoard, setEditBoard] = useState(false);
  const [boardData, setBoardData] = useState<BingoBoard>({ id: "", data: {} });
  const [disabled, setDisabled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (route.name === "Golden") {
      setUseFrom(GoldenKartelaData);
    } else if (route.name === "Tamrin") {
      setUseFrom(TamrinKartelaData);
    } else if (route.name === "Mine") {
      setUseFrom(getMineData());
    }
    if (getMineData().length < 1) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [updateMineData]);

  const search = (getText = "") => {
    const value = getText?.trim();
    if (value) {
      const searchKartela = useFrom?.find((items) => items.id === value);
      setKartelaDatas(searchKartela);
      setShowAll(false);

      if (searchKartela) {
        setFooter("Search Using Id For More Kartelas");
      } else {
        setFooter(`Kartela Id ${value} Not Found`);
      }
    } else {
      setShowAll(true);
    }

    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const onRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const updateMode = () => {
    if (getMode === "add") {
      setGetMode("update");
      setSaveEdit("Save All");
    } else {
      setGetMode("add");
      setSaveEdit("Edit All");
    }
  };

  const removeAll = () => {
    setShowConfirm(false);

    const deleted = deleteAll();
    if (deleted) {
      setUpdateMineData((prev) => prev + 1);

      setStoredData((prevIds) =>
        prevIds.filter((boardId) => boardId.type !== route.name)
      );
      console.log("Removed all");
    } else {
      console.log("Unable To remove all");
    }
  };

  return (
    <View className="flex-1">
      <AppGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.7)"]}
        backgroundI={bingoBack}
      >
        <View className="absolute z-10 pl-3 pr-14 py-1 right-0 top-4 left-0 h-12 rounded-3xl border mx-10 bg-white justify-center">
          <TextInput
            className="text-black text-2xl font-bold w-full p-0"
            value={searchText}
            onChangeText={setSearchText}
            keyboardType="numeric"
            onSubmitEditing={(event) => {
              search(event.nativeEvent.text);
            }}
          />
          <TouchableOpacity
            className="absolute right-4"
            activeOpacity={0.7}
            onPress={() => {
              setSearchText("");
              search();
            }}
          >
            <FontAwesome name="remove" size={32} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
          className="pt-16 z-0"
          ref={flatListRef}
          data={useFrom?.slice(0, 50)}
          keyExtractor={(item) => item.id}
          numColumns={3}
          refreshControl={
            <RefreshControl
              progressViewOffset={70}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          columnWrapperStyle={{ justifyContent: "center" }}
          renderItem={({ item }) => {
            if (item.id === "+") return null;

            return (
              <StoreBoard
                boardData={item}
                key={item.id}
                background={route.name}
                mode={getMode}
                setEditBoard={setEditBoard}
                setBoardData={setBoardData}
              />
            );
          }}
          ListFooterComponent={() => (
            <View className="justify-center items-center h-32 mb-10">
              <Text className="text-3xl text-white font-bold">
                Search Using Id For More Kartelas
              </Text>
            </View>
          )}
          style={{ display: showAll ? "flex" : "none" }}
        />
        {!showAll && (
          <View className="absolute top-14 left-0 right-0 items-center">
            <View className="flex-row flex-wrap justify-center mt-5">
              {kartelaDatas && (
                <StoreBoard
                  boardData={kartelaDatas}
                  key={kartelaDatas?.id}
                  background={route.name}
                  mode={getMode}
                />
              )}
            </View>
            <View className="justify-center items-center px-8 h-32">
              <Text className="text-2xl font-bold text-white">{footer}</Text>
            </View>
          </View>
        )}
        {showConfirm && (
          <ConfirmationDialog
            onPress={removeAll}
            setShowConfirm={setShowConfirm}
            dialog={"Remove All"}
          />
        )}
        {route.name === "Mine" && (
          <View className="flex flex-col justify-between gap-5">
            <TouchableOpacity
              activeOpacity={0.7}
              className={`absolute items-center mx-12 z-10 p-3 py-1 bottom-4 left-0 h-12 rounded-3xl w-36 border justify-center ${
                disabled ? "bg-gray-400" : "bg-white"
              }`}
              onPress={() => {
                // removeAll();
                setShowConfirm(true);
              }}
              disabled={getMineData().length < 1}
            >
              <Text className="text-xl font-bold">Remove All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={getMineData().length < 1}
              activeOpacity={0.7}
              className={`absolute items-center mx-12 z-10 p-3 py-1 bottom-4 right-0 h-12 rounded-3xl w-36 border justify-center ${
                disabled ? "bg-gray-400" : "bg-white"
              }`}
              onPress={() => {
                updateMode();
              }}
            >
              <Text className="text-xl font-bold">{saveEdit}</Text>
            </TouchableOpacity>
          </View>
        )}
        {editBoard && (
          <BoardEdit
            containerStyle="z-20 absolute self-center top-44"
            boardData={boardData}
            setBoardData={setBoardData}
            setBoard={setEditBoard}
          />
        )}
      </AppGradient>
    </View>
  );
};

export default Store;
