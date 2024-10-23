import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Text,
  Touchable,
} from "react-native";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import {
  useGetSalesBoosterFocusPointMutation,
  useGetSalesBoosterOrderMutation,
} from "../../apiServices/salesBooster/salesBoosterApi";
import * as Keychain from "react-native-keychain";

const TargetAchievementDetails = ({ navigation, route }) => {
  const [selectedDataStart, setSelectedDataStart] = useState(new Date());
  const [searchTitle, setSearchTitle] = useState();
  const type = route.params.type;
  const schemeData = route.params.data;
  const titleName = route.params.name;

  console.log("Title name", titleName)

  const sb_id = route.params.sb_id;
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const userData = useSelector((state) => state.appusersdata.userData);
  console.log("schemeDataaa", schemeData);

  const [
    getSalesBoosterFocusFunc,
    {
      data: getSalesBoosterFocusData,
      error: getSalesBoosterFocusError,
      isLoading: getSalesBoosterOrderIsLoading,
      isError: getSalesBoosterOrderIsError,
    },
  ] = useGetSalesBoosterFocusPointMutation();

  let date = route.params.date ? route.params.date  : "";

  const month = moment(date).month() + 1; // Get month number (0-indexed, so add 1)
  const year = moment(date).year(); // Get the year

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const currDate = new Date();
      // const currMonth = moment(currDate).format("MM");
      const currMonth = month
      // const currYear = moment(currDate).format("YYYY");
      const currYear = year;
      console.log("month time data", currMonth, currYear);
      const params = {
        appUserID: userData.id,
        sb_id: sb_id,
        month: currMonth,
        year: currYear,
        token: token,
      };
      console.log("getSalesBoosterOrderFunc", JSON.stringify(params));
      getSalesBoosterFocusFunc(params);
    };

    getToken();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const currDate = selectedDataStart ? selectedDataStart : new Date();
      // const currMonth = moment(currDate).format("MM");
      const currMonth = month;
      // const currYear = moment(currDate).format("YYYY");
      const currYear = year;

      console.log("month time data", currMonth, currYear);
      const params = {
        appUserID: userData.id,
        sb_id: sb_id,
        month: currMonth,
        year: currYear,
        token: token,
      };
      console.log("getSalesFocusFunc", JSON.stringify(params));
      getSalesBoosterFocusFunc(params);
    };

    getToken();
  }, [selectedDataStart]);

  useEffect(() => {
    if (getSalesBoosterFocusData) {
      console.log(
        "getSalesBoosterFocusData",
        JSON.stringify(getSalesBoosterFocusData)
      );
      // if(getSalesBoosterFocusData.body.type == "purchase limit")
      // {

      // }
    } else if (getSalesBoosterFocusError) {
      console.log("getSalesBoosterFocusError", getSalesBoosterFocusError);
    }
  }, [getSalesBoosterFocusData, getSalesBoosterFocusError]);
  

  console.log("selected date", selectedDataStart);

  const Show2020Details = (props) => {
    const data =  props.data
    const boxesTillNow = props.boxesTillNow

    // console.log("2020Data", data);
    const CategoryTab = (props) => {
      const index = props.index;
      const brand = props.brand;
      const style = props.style;
      const points = props.points;
      const matched = props.matched;
      const item = props.item;
      const boxesTillNow = props.boxesTillNow;
      const boxes = props.boxes;
    
      

      return (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            // marginTop: 10,
            borderWidth: 0.54, // Add border to the outer container
            borderColor: "black",
            borderBottomWidth:1.2
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
              flexDirection: "row",
              backgroundColor: item?.matched ? "#5CA509" : "white",
              height: 36,
            }}
          >
            {/* First column (Boxes) */}
            <PoppinsTextMedium
              style={{
                fontWeight: "600",
                fontSize: 14,
                color:item?.matched ? 'white' : "black",
                width: "40%",
                textAlign: "center", // Center the text
                borderRightWidth: 1, // Add right border
                borderColor: "black",
                paddingVertical: 8, // Adjust for better vertical alignment
              }}
              content={item?.trigger_value}
            />

            {/* Second column (Purchased) */}
            <PoppinsTextMedium
              style={{
                fontWeight: "600",
                fontSize: 14,
                color:item?.matched ? 'white' : "black",
                width: "54%",
                textAlign: "center", // Center the text
                // borderRightWidth: 1, // Add right border
                borderColor: "black",
                paddingVertical: 8, // Adjust for better vertical alignment
              }}
              content={matched ? props.boxes : boxesTillNow}
            />

            {/* Third column (Gift) */}
            {/* <PoppinsTextMedium
              style={{
                fontWeight: "600",
                fontSize: 14,
                color:item?.matched ? 'white' : "black",
                width: "40%",
                textAlign: "center", // Center the text
                paddingVertical: 8, // Adjust for better vertical alignment
              }}
              content={(item.gift_id && item.matched ? item.gift_id : 0) }
            /> */}
          </View>
        </View>
      );
    };
    return (
      <View
        style={{
          width: "90%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
            backgroundColor: ternaryThemeColor,
            height: 50,
          }}
        >
          <PoppinsTextMedium
            style={{
              fontWeight: "800",
              fontSize: 13,
              color: "white",
              width: "28%",
              // padding:5,
            }}
            content="Combo Boxes Qty"
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              fontWeight: "800",
              fontSize: 13,
              color: "white",
              width: "37%",
            }}
            content="Boxes Purchased"
          ></PoppinsTextMedium>
          {/* <View style={{ height: "100%", width: 2 }}></View>
          <PoppinsTextMedium
            style={{
              fontWeight: "800",
              fontSize: 13,
              color: "white",
              width: "20%",
            }}
            content="Combo Achievement"
          ></PoppinsTextMedium> */}
        </View>

        {data.map((item, index) => {
          return (
            <CategoryTab
              key={index}
              index={index + 1}
              matched={item.matched}
              // points={item.points}
              style={item.name}
              // brand={item.brand}
              item={item}
              boxesTillNow = {boxesTillNow}
              boxes = {item.matched==true ?  item.total_boxes :""}
            ></CategoryTab>
          );
        })}
      </View>
    );
  };

  const ShowDoneCategoriesTable = (props) => {
    const data = props.data;
    console.log("ShowDoneCategoriesTable", data);
    const CategoryTab = (props) => {
      const index = props.index;
      const brand = props.brand;
      const style = props.style;
      const points = props.points;
      const matched = props.matched;
      return (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
              flexDirection: "row",
              backgroundColor: matched ? "#5CA509" : "#5CA509",
              height: 36,
            }}
          >
            <PoppinsTextMedium
              style={{
                fontWeight: "600",
                fontSize: 14,
                color: "white",
                width: "13%",
              }}
              content={index}
            ></PoppinsTextMedium>
            <PoppinsTextMedium
              style={{
                fontWeight: "600",
                fontSize: 14,
                color: "white",
                width: "63%",
              }}
              content={style}
            ></PoppinsTextMedium>

            <View
              style={{ height: "100%", width: 2, backgroundColor: "white" }}
            ></View>

            <PoppinsTextMedium
              style={{
                fontWeight: "600",
                fontSize: 14,
                color: "white",
                width: "20%",
              }}
              content={points}
            ></PoppinsTextMedium>
          </View>
        </View>
      );
    };
    return (
      <View
        style={{
          width: "90%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
            backgroundColor: ternaryThemeColor,
            height: 40,
          }}
        >
          <PoppinsTextMedium
            style={{
              fontWeight: "800",
              fontSize: 15,
              color: "white",
              width: "13%",
            }}
            content="Index"
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              fontWeight: "800",
              fontSize: 15,
              color: "white",
              width: "63%",
            }}
            content="STYLE"
          ></PoppinsTextMedium>
          <View
            style={{ height: "100%", width: 2, backgroundColor: "white" }}
          ></View>
          <PoppinsTextMedium
            style={{
              fontWeight: "800",
              fontSize: 15,
              color: "white",
              width: "20%",
            }}
            content="POINTS"
          ></PoppinsTextMedium>
        </View>

        {data.map((item, index) => {
          return (
            <CategoryTab
              key={index}
              index={index + 1}
              matched={item.matched}
              points={item.points}
              style={item.name}
              brand={item.brand}
            ></CategoryTab>
          );
        })}
      </View>
    );
  };

  const ShowBoxDetails = (props) => {
    const [total, setTotal] = useState(0);
    const noBox = props?.noBox;
    const data = data ? props?.data : [];

    console.log("ShowBoxDetails", data);

    useEffect(() => {
      let sum = 0;
      for (var i = 0; i < data?.length; i++) {
        console.log("useEffect showBoxDetails", data[i]["total_boxes"]);
        if (data[i]["total_boxes"]) sum += Number(data[i]["total_boxes"]);
      }
      setTotal(sum);
    }, [data]);

    const TotalBox = (props) => {
      const ttl = props.total;
      return (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            backgroundColor: "#F47B20",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "66%",
              borderRightWidth: 1,
              borderColor: "#DDDDDD",
            }}
          >
            <PoppinsTextMedium
              style={{ color: "white", fontSize: 16, fontWeight: "800" }}
              content="Total"
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "33%",
              borderRightWidth: 1,
              borderColor: "#DDDDDD",
            }}
          >
            <PoppinsTextMedium
              style={{ color: "white", fontSize: 16, fontWeight: "800" }}
              content={ttl}
            ></PoppinsTextMedium>
          </View>
        </View>
      );
    };

    const MultiplierBox = (props) => {
      const matched = props.data.matched;
      const boxes = props.data.trigger_value;
      const mtdBoxes = props.data.total_boxes;
      const temp = props.data.point;

      const bonusPoints = temp.split("-")[1];
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            backgroundColor: matched ? "#5CA509" : "#FFFFFF",
          }}
        >
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#DDDDDD",
              padding: 4,
            }}
          >
            <PoppinsTextMedium
              style={{
                color: matched ? "white" : "#171717",
                fontSize: 15,
                fontWeight: "600",
              }}
              content={boxes}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#DDDDDD",
              padding: 4,
            }}
          >
            <PoppinsTextMedium
              style={{
                color: matched ? "white" : "#171717",
                fontSize: 15,
                fontWeight: "600",
              }}
              content={bonusPoints}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#DDDDDD",
              padding: 4,
            }}
          >
            <PoppinsTextMedium
              style={{
                color: matched ? "white" : "#171717",
                fontSize: 15,
                fontWeight: "600",
              }}
              content={mtdBoxes}
            ></PoppinsTextMedium>
          </View>
        </View>
      );
    };

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          borderWidth: 1,
          borderColor: "#DDDDDD",
          borderRadius: 4,
          backgroundColor: "#FFFFFF",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#D3CFCF",
            width: "100%",
            padding: 10,
            flexDirection: "row",
          }}
        >
          <PoppinsTextMedium
            style={{ color: "#171717", fontSize: 16, fontWeight: "600" }}
            content="No. of Boxes Bought (MTD )"
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              color: "#171717",
              fontSize: 16,
              fontWeight: "600",
              marginLeft: 20,
            }}
            content={noBox}
          ></PoppinsTextMedium>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 40,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "#171717", fontSize: 16, fontWeight: "600" }}
            content="Monthly Vol Based Multiplier"
          ></PoppinsTextMedium>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            backgroundColor: "#F0F0F0",
          }}
        >
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#DDDDDD",
              padding: 4,
            }}
          >
            <PoppinsTextMedium
              style={{ color: "#171717", fontSize: 15, fontWeight: "600" }}
              content="Boxes in Month"
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#DDDDDD",
              padding: 4,
            }}
          >
            <PoppinsTextMedium
              style={{ color: "#171717", fontSize: 15, fontWeight: "600" }}
              content="Bonus points"
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#DDDDDD",
              padding: 4,
            }}
          >
            <PoppinsTextMedium
              style={{ color: "#171717", fontSize: 15, fontWeight: "600" }}
              content="MTD Boxes"
            ></PoppinsTextMedium>
          </View>
        </View>
        {data &&
          data.map((item, index) => {
            return <MultiplierBox data={item}></MultiplierBox>;
          })}
        <TotalBox total={total}></TotalBox>
      </View>
    );
  };

  const ShowCategoryTable = (props) => {
    const data = props.data;

    const CategoryTab = (props) => {
      const backGroundColor = props.backGroundColor;
      const noSubCategories = props.noSubCategories;
      const multiplier = props.multiplier;
      const points = props.points;
      return (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
            height: 40,
            backgroundColor: backGroundColor ? "#5CA509" : "white",
            borderWidth: 1,
            borderColor: "#DDDDDD",
          }}
        >
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              borderRightWidth: 1,
              borderColor: "#DDDDDD",
            }}
          >
            <PoppinsTextMedium
              style={{
                fontWeight: "600",
                fontSize: 14,
                color: backGroundColor ? "white" : "black",
              }}
              content={noSubCategories}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              borderRightWidth: 1,
              borderColor: "#DDDDDD",
            }}
          >
            <PoppinsTextMedium
              style={{
                fontWeight: "600",
                fontSize: 14,
                color: backGroundColor ? "white" : "black",
              }}
              content={multiplier}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <PoppinsTextMedium
              style={{
                fontWeight: "600",
                fontSize: 14,
                color: backGroundColor ? "white" : "black",
              }}
              content={points}
            ></PoppinsTextMedium>
          </View>
        </View>
      );
    };

    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "#DDDDDD",
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
            height: 40,
            backgroundColor: "#F0F0F0",
          }}
        >
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              borderRightWidth: 1,
              borderColor: "#DDDDDD",
            }}
          >
            <PoppinsTextMedium
              style={{ fontWeight: "800", fontSize: 16, color: "black" }}
              content="Sub-Category"
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              borderRightWidth: 1,
              borderColor: "#DDDDDD",
            }}
          >
            <PoppinsTextMedium
              style={{ fontWeight: "800", fontSize: 16, color: "black" }}
              content="Multiplier"
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "33%",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <PoppinsTextMedium
              style={{ fontWeight: "800", fontSize: 16, color: "black" }}
              content="Points"
            ></PoppinsTextMedium>
          </View>
        </View>
        {data.map((item, index) => {
          return (
            <CategoryTab
              key={index}
              points={item.pointsRewarded}
              multiplier={item.point}
              noSubCategories={item.trigger_value}
              backGroundColor={item.matched}
              boxes ={item.matched == true ? item.total_boxes : ""}
            ></CategoryTab>
          );
        })}
      </View>
    );
  };

  const FilterSchemeComponent = React.memo((props) => {
    const [openStart, setOpenStart] = useState(false);

    const handleDateChange = (date) => {
      console.log("dateee", date);
      setOpenStart(false);
      setSelectedDataStart(date);
    };

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            padding: 8,
            width: "90%",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            marginLeft: 20,
            marginTop: 10,
          }}
        >
          <PoppinsTextMedium
            content={`${moment(date).format("MMM YYYY")}`}
            style={{ fontSize: 16, fontWeight: "700", color: "black" }}
          />
          {/* <TouchableOpacity
            style={{
              backgroundColor: "white",
              paddingLeft: 10,
              borderRadius: 30,
              padding: 6,
              marginLeft: 20,
              borderWidth: 1,
            }}
            onPress={() => setOpenStart(!openStart)}
          >
            <DatePicker
              modal
              mode="date"
              open={openStart}
              date={selectedDataStart}
              onConfirm={handleDateChange}
              onCancel={() => setOpenStart(false)}
            />
            <PoppinsTextMedium
              style={{ color: "#808080" }}
              content="Select Month & Year"
            />
          </TouchableOpacity> */}
        </View>
      </View>
    );
  });

  
  const FilterScheme = (props) => {
    const [month, setMonth] = useState();
    const title = props.title;

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          flexDirection: "row",
        }}
      >
        <PoppinsTextMedium
          style={{
            color: "black",
            fontSize: 16,
            fontWeight: "600",
            width: "40%",
          }}
          content={title}
        ></PoppinsTextMedium>
      </View>
    );
  };
  return (
    <View>
      <View
        style={{
          alignItems: "center",
          // justifyContent: "center",
          width: "100%",
          backgroundColor: ternaryThemeColor,
          height: "100%",
        }}
      >
        
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            width: "100%",
            marginTop: 10,
            height: "6%",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              style={{
                height: 24,
                width: 24,
                resizeMode: "contain",
                marginLeft: 10,
              }}
              source={require("../../../assets/images/blackBack.png")}
            ></Image>
          </TouchableOpacity>

          <PoppinsTextMedium
            content="View Purchase"
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "700",
              color: "white",
            }}
          ></PoppinsTextMedium>
        </View>
        

        <View
          style={{
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: "white",
            marginTop: 0,
            justifyContent: "flex-start",
            width: "100%",
            paddingBottom: 10,
            height: "100%",
          }}
        >
        <FilterSchemeComponent></FilterSchemeComponent>

          <Text
            style={{
              marginTop: 20,
              fontWeight: "bold",
              fontSize: 20,
              color: "black",
              marginLeft: 20,
            }}
          >
            {titleName}
          </Text>
          {/* <FilterScheme title={"Super 20-20 for 2024"}></FilterScheme> */}
          {/* <View style={{ width: "90%", height: "30%" }}>
            {getSalesBoosterFocusData && type == "target category" && (
              <ShowCategoryTable
                data={getSalesBoosterFocusData.body.triggers}
              ></ShowCategoryTable>
            )}
            {type == "purchase limit" && (
              <ShowBoxDetails
                data={getSalesBoosterFocusData?.body.triggers}
              ></ShowBoxDetails>
            )}
          </View> */}

          <ScrollView
            // style={{backgroundColor:'red'}}
            contentContainerStyle={{ alignItems: "center", width: "100%" }}
          >
            {getSalesBoosterFocusData && type == "target category" && (
              <ShowDoneCategoriesTable
                data={getSalesBoosterFocusData.body?.ranges}
              ></ShowDoneCategoriesTable>
            )}

            {getSalesBoosterFocusData && type == "20-20" && (
              <Show2020Details
                data={getSalesBoosterFocusData?.body?.triggers}
                boxesTillNow ={getSalesBoosterFocusData?.body?.boxes_till_now}
              ></Show2020Details>
            )}
            
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TargetAchievementDetails;
