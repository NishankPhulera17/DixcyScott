import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Text,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import {
  useFetchUserPointsMutation,
  useFetchUserPointsHistoryMutation,
} from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from "react-native-keychain";
import { useSelector } from "react-redux";
import moment from "moment";
import FastImage from "react-native-fast-image";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import FilterModal from "../../components/modals/FilterModal";
import { useGetPointSharingDataMutation } from "../../apiServices/pointSharing/pointSharingApi";
import { dispatchCommand } from "react-native-reanimated";
import InputDate from "../../components/atoms/input/InputDate";
import { useTranslation } from "react-i18next";
import {
  useGetOrderHistoryDateWiseMutation,
  useGetOrderHistoryMutation,
} from "../../apiServices/orders/GetOrderApi";
import { hasTdsSetup } from "../../utils/HandleClientSetup";
import RewardBox from "../../components/molecules/RewardBox";

const OrderHistory = ({ navigation }) => {
  const [displayList, setDisplayList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const points = 100;
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";

  const addonfeatures = useSelector((state) => state.apptheme.extraFeatures);
  const registrationRequired = useSelector(
    (state) => state.appusers.registrationRequired
  );
  const userData = useSelector((state) => state.appusersdata.userData);

  console.log("userData mob", userData);
  const userId = useSelector((state) => state.appusersdata.id);

  const [openBottomModal, setOpenBottomModal] = useState(false);

  const [
    getPointSharingFunc,
    {
      data: getPointSharingData,
      error: getPointSharingError,
      isLoading: getPointSharingIsLoading,
      isError: getPointSharingIsError,
    },
  ] = useGetPointSharingDataMutation();

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  const [
    getOrderFunc,
    {
      data: getOrderData,
      error: getOrderError,
      isLoading: getOrderIsLoading,
      isError: getOrderIsError,
    },
  ] = useGetOrderHistoryDateWiseMutation();

  const { t } = useTranslation();

  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loader.gif")
  ).uri;
  const noData = Image.resolveAssetSource(
    require("../../../assets/gif/noData.gif")
  ).uri;
  let startDate, endDate;

  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;

      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      console.log(">>>>>>>", month, year);
      // Get the first day of the current month
      const today = new Date(); // Get today's date
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      console.log("today date", firstDayOfMonth);
      // Format dates to "YYYY-MM-DD"
      const formattedFirstDay = `${year}-${month}-01`;
      const formattedToday = today.toISOString().split("T")[0];

      console.log(
        "formattedFirstDay,formattedToday",
        formattedFirstDay,
        formattedToday
      );

      const params = {
        token: token,
        body: {
          //   user_id: userData,
          mobile: userData.mobile,
          //   mobile: "",
          startDate: formattedFirstDay,
          endDate: formattedToday,
        },
      };
      getOrderFunc(params);
    })();
  }, []);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPointHistoryData = (start, end) => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const startDate = moment(start).format("YYYY-MM-DD");
      const endDate = moment(end).format("YYYY-MM-DD");
      console.log("Start End", startDate, endDate);

      const params = {
        token: token,
        body: {
          //   user_id: userData,
          mobile: userData.mobile,
          //   mobile: "",
          startDate: startDate,
          endDate: endDate,
        },
      };
      getOrderFunc(params);
    })();
  };

  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    console.log("userId", userId);
    const params = {
      userId: String(userId),
      token: token,
    };
    userPointFunc(params);
  };

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
    } else if (userPointError) {
      console.log("userPointError", userPointError);
    }
  }, [userPointData, userPointError]);

  useEffect(() => {
    if (getOrderData) {
      console.log("getOrderData", JSON.stringify(getOrderData));

      if (getOrderData.success) {
        setIsLoading(false);
        setDisplayList(getOrderData.body?.order_list);
      }
    } else if (getOrderError) {
      console.log("getOrderError", getOrderError);
    }
  }, [getOrderData, getOrderError]);

  useEffect(() => {
    if (getOrderIsLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [getOrderIsLoading]);

  const fetchDataAccToFilter = () => {
    console.log("fetchDataAccToFilter", startDate, endDate);
    if (startDate && endDate) {
      if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
        alert("Kindly enter proper end date");
        startDate = undefined;
        endDate = undefined;
        // FilterModal(false)
        setOpenBottomModal(false);
      } else {
        fetchPointHistoryData(startDate, endDate);
        setOpenBottomModal(false);
      }
    } else {
      alert("Kindly enter a valid date");

      setOpenBottomModal(false);
      startDate = undefined;
      endDate = undefined;
    }
  };

  const getRegistrationPoints = async (cause) => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      token: token,
      id: String(userData.id),
      cause: cause,
    };
    getPointSharingFunc(params);
  };

  //Point category tab
  const PointCategoryTab = () => {
    const [type, setType] = useState("");
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        style={{
          backgroundColor: "white",
          height: 70,
          elevation: 1,
          opacity: 0.8,
          borderWidth: 1,
          borderColor: "grey",
        }}
      >
        {registrationRequired.includes(userData.user_type) && (
          <TouchableOpacity
            onPress={() => {
              (async () => {
                const credentials = await Keychain.getGenericPassword();
                const token = credentials.username;

                const params = {
                  token: token,
                  userId: userId,
                };
                fetchUserPointsHistoryFunc(params);
              })();
              fetchPoints();
              setType("regular");
            }}
            style={{
              height: "100%",
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: type === "regular" ? "#DDDDDD" : "white",
            }}
          >
            {/* <PoppinsTextMedium content="Regular Points" style={{color:'black',fontWeight:'700',fontSize:14}}></PoppinsTextMedium> */}
            <PoppinsTextMedium
              content={t("regular points")}
              style={{ color: "black", fontWeight: "700", fontSize: 14 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}
        {registrationRequired.includes(userData.user_type) && (
          <TouchableOpacity
            onPress={() => {
              getRegistrationPoints("points_sharing");
              setType("extra");
            }}
            style={{
              height: "100%",
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: "#DDDDDD",
              backgroundColor: type === "extra" ? "#DDDDDD" : "white",
            }}
          >
            {/* <PoppinsTextMedium content="Extra Points" style={{color:'black',fontWeight:'700',fontSize:14}}></PoppinsTextMedium> */}
            <PoppinsTextMedium
              content={t("extra points")}
              style={{ color: "black", fontWeight: "700", fontSize: 14 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}
        {registrationRequired.includes(userData.user_type) && (
          <TouchableOpacity
            onPress={() => {
              getRegistrationPoints("registration_bonus");
              setType("registration_bonus");
            }}
            style={{
              height: "100%",
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: type === "registration" ? "#DDDDDD" : "white",
            }}
          >
            {/* <PoppinsTextMedium content="Registration Bonus" style={{color:'black',fontWeight:'700',fontSize:14}}></PoppinsTextMedium> */}
            <PoppinsTextMedium
              content={t("Registration Bonus")}
              style={{ color: "black", fontWeight: "700", fontSize: 14 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}

        {registrationRequired.includes(userData.user_type) && (
          <TouchableOpacity
            onPress={() => {
              getRegistrationPoints("annual_kitty_2024_25");
              setType("Annual Kitty");
            }}
            style={{
              height: "100%",
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: type === "Annual Kitty" ? "#DDDDDD" : "white",
            }}
          >
            {/* <PoppinsTextMedium content="Registration Bonus" style={{color:'black',fontWeight:'700',fontSize:14}}></PoppinsTextMedium> */}
            <PoppinsTextMedium
              content={t("Annual Kitty")}
              style={{ color: "black", fontWeight: "700", fontSize: 14 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}

        {hasTdsSetup && (
          <TouchableOpacity
            onPress={() => {
              getRegistrationPoints("tds_deducted_2024_25");
              setType("TDS Deducted");
            }}
            style={{
              height: "100%",
              width: 120,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: type === "TDS Deducted" ? "#DDDDDD" : "white",
              borderLeftWidth: 1,
              borderColor: "#DDDDDD",
            }}
          >
            {/* <PoppinsTextMedium content="Registration Bonus" style={{color:'black',fontWeight:'700',fontSize:14}}></PoppinsTextMedium> */}
            <PoppinsTextMedium
              content={t("TDS Deducted")}
              style={{ color: "black", fontWeight: "700", fontSize: 14 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };
  //header
  const Header = () => {
    const [message, setMessage] = useState();
    const modalClose = () => {
      setOpenBottomModal(false);
    };

    const onFilter = (data, type) => {
      console.log("submitted", data, type);

      if (type === "start") {
        startDate = data;
      }
      if (type === "end") {
        endDate = data;
      }
    };

    const ModalContent = (props) => {
      const [startDate, setStartDate] = useState("");
      const [endDate, setEndDate] = useState("");

      const handleStartDate = (startdate) => {
        // console.log("start date", startdate)
        setStartDate(startdate?.value);
        props.handleFilter(startdate?.value, "start");
      };

      const handleEndDate = (enddate) => {
        // console.log("end date", enddate?.value)
        setEndDate(enddate?.value);
        props.handleFilter(enddate?.value, "end");
      };
      return (
        <View
          style={{
            height: 320,
            backgroundColor: "white",
            width: "100%",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          {/* {openBottomModal && <FilterModal
                        modalClose={modalClose}
                        message={message}
                        openModal={openBottomModal}
                        handleFilter={onFilter}
                        comp={ModalContent}></FilterModal>} */}

          <PoppinsTextLeftMedium
            content="Date Filter"
            style={{
              color: "black",
              marginTop: 20,
              fontWeight: "bold",
              alignSelf: "center",
            }}
          ></PoppinsTextLeftMedium>
          <TouchableOpacity
            onPress={() => {
              setOpenBottomModal(false);
            }}
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/cancel.png")}
            ></Image>
          </TouchableOpacity>
          <View>
            <InputDate data="Start Date" handleData={handleStartDate} />
          </View>
          <View>
            <InputDate data="End Date" handleData={handleEndDate} />
          </View>
          <TouchableOpacity
            onPress={() => {
              fetchDataAccToFilter();
            }}
            style={{
              backgroundColor: ternaryThemeColor,
              marginHorizontal: 50,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              borderRadius: 10,
            }}
          >
            <PoppinsTextMedium
              content="SUBMIT"
              style={{ color: "white", fontSize: 20, borderRadius: 10 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "#DDDDDD",
          alignItems: "center",
          flexDirection: "row",
          marginTop: 20,
        }}
      >
        <PoppinsTextMedium
          style={{
            marginLeft: 20,
            fontSize: 16,
            position: "absolute",
            left: 10,
            color: "black",
          }}
          content="Date Filter"
        ></PoppinsTextMedium>

        <TouchableOpacity
          onPress={() => {
            setOpenBottomModal(!openBottomModal), setMessage("BOTTOM MODAL");
          }}
          style={{ position: "absolute", right: 20 }}
        >
          <Image
            style={{ height: 22, width: 22, resizeMode: "contain" }}
            source={require("../../../assets/images/settings.png")}
          ></Image>
        </TouchableOpacity>

        {openBottomModal && (
          <FilterModal
            modalClose={modalClose}
            message={message}
            openModal={openBottomModal}
            handleFilter={onFilter}
            comp={ModalContent}
          ></FilterModal>
        )}
      </View>
    );
  };

  const DisplayEarnings = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          backgroundColor: "#DDDDDD",
          padding: 8,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          {userPointData && (
            <PoppinsText
              style={{ color: "black" }}
              content={userPointData.body.point_earned}
            ></PoppinsText>
          )}
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 14, color: "black" }}
            content="Lifetime Earnings"
          ></PoppinsTextMedium>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 40,
          }}
        >
          {userPointData && (
            <PoppinsText
              style={{ color: "black" }}
              content={userPointData.body.point_redeemed}
            ></PoppinsText>
          )}
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 14, color: "black" }}
            content="Lifetime Redemptions"
          ></PoppinsTextMedium>
        </View>
        {/* <TouchableOpacity style={{ borderRadius: 2, height: 40, width: 100, backgroundColor: "#FFD11E", alignItems: "center", justifyContent: "center", marginLeft: 20, color: 'black' }}>
                    <PoppinsTextMedium style={{ color: 'black' }} content="Redeem"></PoppinsTextMedium>
                </TouchableOpacity> */}
      </View>
    );
  };

  const ListItem = (props) => {
    const description = props.description;
    const productCode = props.productCode;
    const visibleCode = props.visibleCode;
    const qty = props.qty;
    const billType = props.billType;
    const time = props.time;
    const amount = props.amount;
    const status = props.status;
    const image = props.image;
    const date = props.date;
    const type = props.type;
    const points = props?.points;
    const is_reverted = props.is_reverted;
    // console.log("point props", props,type,image)
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          margin: 8,
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
          paddingBottom: 10,
          width: "100%",
          height: 120,
          //   height: 120,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            height: 60,
            width: "14%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#DDDDDD",
          }}
        >
          {image ? (
            <Image
              style={{ height: 40, width: 40, resizeMode: "contain" }}
              source={{ uri: image }}
            ></Image>
          ) : (
            <Image
              style={{ height: 40, width: 40, resizeMode: "contain" }}
              source={require("../../../assets/images/coinDixy.png")}
            ></Image>
          )}
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            width: "60%",
            height: "100%",
            bottom: 10,
            marginLeft: 20,
            // marginTop:20
          }}
        >
          {type !== "registration_bonus" && (
            <PoppinsTextMedium
              style={{ fontWeight: "700", fontSize: 15, color: "black" }}
              content={
                billType
                  ? `Invoice No : ${description}`
                  : `GR No : ${description}`
              }
            ></PoppinsTextMedium>
          )}

          {type !== "registration_bonus" && (
            <PoppinsTextMedium
              style={{ fontSize: 15, color: "black", marginTop: 5 }}
              content={`Total Qty : ${Math.trunc(qty)}`}
            ></PoppinsTextMedium>
          )}
          {type === "registration_bonus" && (
            <PoppinsTextMedium
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "black",
                fontWeight: "700",
              }}
              content={`Registration Bonus`}
            ></PoppinsTextMedium>
          )}
          {/* 
          {type !== "registration_bonus" && (
            <PoppinsTextMedium
              style={{ fontWeight: "400", fontSize: 12, color: "black" }}
              content={`Invoice Number : ${productCode}`}
            ></PoppinsTextMedium>
          )} */}
          {/* {type !== "registration_bonus" && (
            <PoppinsTextMedium
              style={{ fontWeight: "400", fontSize: 12, color: "black" }}
              content={`Purchase Amount : ${amount} INR`}
            ></PoppinsTextMedium>
          )} */}
          <View style={{ flexDirection: "row", marginTop: 3 }}>
            <Image
              style={{
                height: 12,
                width: 12,
                resizeMode: "contain",
                marginTop: 5,
                marginRight: 5,
              }}
              source={require("../../../assets/images/Date.png")}
            ></Image>
            <PoppinsTextMedium
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "black",
                //   marginTop: 5,
              }}
              content={date}
            ></PoppinsTextMedium>
          </View>

          {/* <PoppinsTextMedium
            style={{ fontWeight: "400", fontSize: 12, color: "black" }}
            content={time}
          ></PoppinsTextMedium> */}
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            right: 10,
            width: "26%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: 20, width: 20, resizeMode: "contain" }}
              source={
                !billType == true
                  ? // require("../../../assets/images/minus_wallet.png")
                    require("../../../assets/images/coinDixy.png")
                  : require("../../../assets/images/coinDixy.png")
                // require("../../../assets/images/wallet.png")
              }
            ></Image>
            <PoppinsTextMedium
              style={{
                color: "#91B406",
                fontSize: 16,
                color: !billType == true ? "red" : "black",
              }}
              content={`${billType ? " +" : " -"} ${Math.trunc(amount)}`}
            ></PoppinsTextMedium>
          </View>
          {is_reverted && (
            <PoppinsTextMedium
              style={{ color: "red" }}
              content="reverted"
            ></PoppinsTextMedium>
          )}
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'white',
        width: "100%",
        height: "100%",
        marginBottom:20
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          // marginTop: 10,
          height: 60,
          // marginLeft: 20,
          marginBottom:20,
          backgroundColor: ternaryThemeColor,
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
        {/* <PoppinsTextMedium content="Points History" style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium> */}
        <PoppinsTextMedium
          content={t("Order history")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "600",
            color: "#fff",
          }}
        ></PoppinsTextMedium>

        {/* <TouchableOpacity style={{ marginLeft: 180 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity> */}
      </View>

      {/* DIXY COMMENT */}
      {/* <View
        style={{
          padding: 14,
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          flexDirection: "row",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            width: "70%",
            alignItems: "flex-start",
            justifyContent: "space-evenly",
            marginLeft: 10,
          }}
        >

          <PoppinsTextMedium
            style={{ fontSize: 24, fontWeight: "600", color: "#6E6E6E" }}
            content={t("You have")}
          ></PoppinsTextMedium>

          {userPointData && (
            <PoppinsText
              style={{ fontSize: 24, fontWeight: "600", color: "#373737" }}
              content={userPointData.body.point_balance}
            ></PoppinsText>
          )}

          <PoppinsTextMedium
            style={{ fontSize: 24, fontWeight: "600", color: "#6E6E6E" }}
            content={t("Balance Points")}
          ></PoppinsTextMedium>
        </View>
        <Image
          style={{
            height: 50,
            width: "30%",
            resizeMode: "contain",
            position: "absolute",
            right: 20,
          }}
          source={require("../../../assets/images/points.png")}
          // source={require("../../../assets/images/coinDixy.png")}

        ></Image>
      </View> */}


      {/* <DisplayEarnings></DisplayEarnings> */}

      {/* DIXY COMMENT */}
      
      <View style={{ alignItems: "center", justifyContent: "center", width: '90%',backgroundColor:'white' }}>
                        <RewardBox ></RewardBox>
                    </View>
      

      <Header></Header>

      {displayList.length == 0 && !isLoading && (
        <TouchableOpacity onPress={()=>{
          setOpenBottomModal(!openBottomModal)
        }} style={{backgroundColor:'white',marginTop:'20%',alignItems:'center'}}>
                 <FastImage
            style={{ width: 180, height: 180 }}
            source={{
              uri: noData, // Update the path to your GIF
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={{ borderRadius:5,borderWidth:1, borderColor:'white',backgroundColor:ternaryThemeColor}}>
          <Text style={{color:'black', fontWeight:'600', padding:10, color:'white',fontWeight:'bold'}}>Select Date Filter</Text>
          </View>
        </TouchableOpacity>
      )}

      {isLoading && (
        <View style={{ backgroundColor: "white" }}>
          <FastImage
            style={{
              width: 100,
              height: 100,
              alignSelf: "center",
              marginTop: "50%",
            }}
            source={{
              uri: gifUri, // Update the path to your GIF
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}

      {displayList && (
        <FlatList
          style={{ width: "100%", height: "60%" }}
          data={displayList}
          contentContainerStyle={{
            backgroundColor: "white",
            // paddingBottom: 200,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            console.log(item);
            return (
              <ListItem
                visibleCode={item.invoice_id}
                type={item?.cause?.type}
                image={
                  item?.images === undefined
                    ? undefined
                    : item?.images === null
                    ? undefined
                    : item?.images[0]
                }
                description={item?.invoice_id}
                productCode={item?.invoice_id}
                amount={item?.bill_value}
                status={item?.status}
                billType={item?.bill_type == "SALES"}
                points={item?.points}
                qty={item.qty}
                is_reverted={item?.is_reverted}
                date={moment(item?.date).format("DD-MMM-YYYY")}
                time={moment(item?.created_at).format("HH:mm a")}
              />
            );
          }}
          keyExtractor={(item, index) => index}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default OrderHistory;
