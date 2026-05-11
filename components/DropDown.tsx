import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Checkbox from "expo-checkbox";

const DropDown = ({
  clearPress,
  setIntersect,
  setNum,
  setSide,
  intersect,
  num,
  side,
}: {
  clearPress: () => void;
  setIntersect: (val: boolean) => void;
  setNum: React.Dispatch<React.SetStateAction<string>>;
  setSide: React.Dispatch<React.SetStateAction<string>>;
  intersect: boolean;
  num: string;
  side: string;
}) => {
  const [openLine, setOpenLine] = useState(false);
  const [openDirection, setOpenDirection] = useState(false);
  // const [line, setNum] = useState("No");
  // const [valueDirection, setSide] = useState("Any");
  // const [intersect, setIntersect] = useState(false);
  const [numOfLine, setNumOfLine] = useState([
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
  ]);
  const [playDirection, setPlayDirection] = useState([
    { label: "Any", value: "Any" },
    { label: "As-It", value: "As-It" },
    { label: "Right-Left", value: "Right-Left" },
    { label: "Top-Bottom", value: "Top-Bottom" },
  ]);

  const handleOpenLine = () => {
    if (openLine) {
      setOpenLine(false);
    } else {
      setOpenDirection(false);
      setOpenLine(true);
    }
  };

  const handleOpenDirection = () => {
    if (openDirection) {
      setOpenDirection(false);
    } else {
      setOpenLine(false);
      setOpenDirection(true);
    }
  };

  return (
    <View
      className="flex flex-row p-2 mt-4 justify-between gap-1"
      style={{ zIndex: 3000 }}
    >
      <View>
        <DropDownPicker
          open={openDirection}
          value={side}
          items={playDirection}
          setOpen={handleOpenDirection}
          setValue={setSide}
          setItems={setPlayDirection}
          dropDownContainerStyle={{
            width: 100,
          }}
          style={{
            paddingHorizontal: 4,
            paddingVertical: 2,
            height: "auto",
            minHeight: undefined,
            width: 40,
          }}
          listItemContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            paddingVertical: 4,
          }}
          labelStyle={{ fontSize: 12 }}
          listItemLabelStyle={{
            padding: 0,
            margin: 0,
            fontSize: 12,
          }}
          showTickIcon={false}
          showArrowIcon={false}
        />
      </View>
      <View>
        <DropDownPicker
          open={openLine}
          value={num}
          items={numOfLine}
          setOpen={handleOpenLine}
          setValue={setNum}
          setItems={setNumOfLine}
          labelStyle={{ fontSize: 12 }}
          dropDownContainerStyle={{
            width: 60,
          }}
          style={{
            paddingHorizontal: 4,
            paddingVertical: 2,
            height: "auto",
            minHeight: undefined,
            width: 40,
          }}
          listItemContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            paddingVertical: 4,
          }}
          listItemLabelStyle={{
            padding: 0,
            margin: 0,
            fontSize: 12,
          }}
          showTickIcon={false}
          showArrowIcon={false}
        />
      </View>
      <View className="flex-row items-center">
        <Text className="mr-2">Cr</Text>
        <Checkbox value={intersect} onValueChange={setIntersect} />
      </View>
      <View>
        <TouchableOpacity
          className="bg-white rounded-lg border-2"
          onPress={clearPress}
        >
          <Text className="text-[14px] mx-1 bg-slate-200">Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DropDown;
