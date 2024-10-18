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
import Video from "react-native-video";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import {
  useCheckActiveSchemeMutation,
  useCheckAllSchemeMutation,
} from "../../apiServices/scheme/GetSchemeApi";
import * as Keychain from "react-native-keychain";
import Logo from "react-native-vector-icons/AntDesign";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import { useGetAllSalesBoosterMutation } from "../../apiServices/salesBooster/salesBoosterApi";
import { useIsFocused } from "@react-navigation/native";
export default function Scheme({ navigation }) {
  const [scheme, setScheme] = useState([]);
  const [getAllScheme, setGetAllScheme] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [activeScheme, setActiveScheme] = useState();
  const [selectedDataStart, setSelectedDataStart] = useState(new Date());
  const [selectedGifts, setSelectedGifts] = useState();
  const [categories, setCategories] = useState();
  const [highlightWidthPrevious, setHighlightWidthPrevious] = useState(false);
  const [selected, setSelected] = useState(false);
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const location = useSelector((state) => state.userLocation.location);
  console.log("Location Data from redux state", location);
  const height = Dimensions.get("window").height;
  const userData = useSelector((state) => state.appusersdata.userData);
  console.log("userdata", userData);
  const [
    checkAllSchemeFunc,
    {
      data: checkAllSchemeData,
      error: checkAllSchemeError,
      isLoading: checkAllSchemeIsLoading,
      isError: checkAllSchemeIsError,
    },
  ] = useCheckAllSchemeMutation();

  const [
    getAllSalesBoosterFunc,
    {
      data: getAllSalesBoosterData,
      error: getAllSalesBoosterError,
      isLoading: getAllSalesBoosterIsLoading,
      isError: getAllSalesBoosterIsError,
    },
  ] = useGetAllSalesBoosterMutation();

  const [
    checkActiveSchemeFunc,
    {
      data: checkActiveSchemeData,
      error: checkActiveSchemeError,
      isLoading: checkActiveSchemeIsLoading,
      isError: checkActiveSchemeIsError,
    },
  ] = useCheckActiveSchemeMutation();

  const years = [
    2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035,
    2036, 2037, 2038, 2039, 2040,
  ];

  const focused = useIsFocused()

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // const schemeData = {
  //   status: 200,
  //   success: true,
  //   message: "All Scheme Data",
  //   body: [
  //     {
  //       id: 6,
  //       name: "Second Test Scheme",
  //       user_types: [3, 2],
  //       states: ["Delhi", "Uttarkhand", "Haryana"],
  //       gift_catalogue_id: 2,
  //       scheme_start: "2024-07-01",
  //       scheme_end: "2024-07-25",
  //       redeem_start: "2024-07-01",
  //       redeem_end: "2024-07-31",
  //       type: "1",
  //       products: [],
  //       image:
  //         "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720604602806-387774581RUMBA.jpg",
  //       pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720617280204-657186004Terms-and-Conditions---JQR.pdf",
  //       status: "2",
  //       created_at: "2024-07-11T07:45:10.477Z",
  //       created_by_id: 1,
  //       created_by_name: "lyra",
  //       updated_at: "2024-07-11T07:45:10.477Z",
  //       updated_by_id: 1,
  //       updated_by_name: "lyra",
  //       scheme_wallet_id: "490",
  //       app_user_id: 443,
  //       user_type_id: 2,
  //       user_type: "retailer",
  //       wallet_status: "3",
  //       point_earned: "0.00",
  //       point_redeemed: "0.00",
  //       point_balance: "0.00",
  //       point_expired: "0.00",
  //       gift_catalogue: [
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 3,
  //           name: "Combo Voucher",
  //           brand: "Bata",
  //           points: 3,
  //           value: 3,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261406795-222877395.png",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 2,
  //           name: "Voucher",
  //           brand: "Bata",
  //           points: 2,
  //           value: 2,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261376761-588744604.png",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 1,
  //           name: "Bata Card",
  //           brand: "Bata",
  //           points: 1,
  //           value: 1,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261342488-442000408.jpg",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //       ],
  //     },
  //     {
  //       id: 8,
  //       name: "Faltu Test Scheme",
  //       user_types: [2, 3],
  //       states: ["Delhi", "Uttar Pradesh"],
  //       gift_catalogue_id: 2,
  //       scheme_start: "2024-07-01",
  //       scheme_end: "2024-07-25",
  //       redeem_start: "2024-07-26",
  //       redeem_end: "2024-07-31",
  //       type: "1",
  //       products: [],
  //       image:
  //         "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720604602806-387774581RUMBA.jpg",
  //       pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720617280204-657186004Terms-and-Conditions---JQR.pdf",
  //       status: "1",
  //       created_at: "2024-07-12T07:37:13.599Z",
  //       created_by_id: 1,
  //       created_by_name: "lyra",
  //       updated_at: "2024-07-12T07:37:13.599Z",
  //       updated_by_id: 1,
  //       updated_by_name: "lyra",
  //       scheme_wallet_id: "978",
  //       app_user_id: 443,
  //       user_type_id: 2,
  //       user_type: "retailer",
  //       wallet_status: "3",
  //       point_earned: "0.00",
  //       point_redeemed: "0.00",
  //       point_balance: "0.00",
  //       point_expired: "0.00",
  //       gift_catalogue: [
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 3,
  //           name: "Combo Voucher",
  //           brand: "Bata",
  //           points: 3,
  //           value: 3,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261406795-222877395.png",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 2,
  //           name: "Voucher",
  //           brand: "Bata",
  //           points: 2,
  //           value: 2,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261376761-588744604.png",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 1,
  //           name: "Bata Card",
  //           brand: "Bata",
  //           points: 1,
  //           value: 1,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261342488-442000408.jpg",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //       ],
  //     },
  //     {
  //       id: 8,
  //       name: "Expired Test Scheme",
  //       user_types: [2, 3],
  //       states: ["Uttar Pradesh"],
  //       gift_catalogue_id: 2,
  //       scheme_start: "2024-07-01",
  //       scheme_end: "2024-07-25",
  //       redeem_start: "2024-07-26",
  //       redeem_end: "2024-07-31",
  //       type: "1",
  //       products: [],
  //       image:
  //         "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720604602806-387774581RUMBA.jpg",
  //       pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720617280204-657186004Terms-and-Conditions---JQR.pdf",
  //       status: "1",
  //       created_at: "2024-07-12T07:37:13.599Z",
  //       created_by_id: 1,
  //       created_by_name: "lyra",
  //       updated_at: "2024-07-12T07:37:13.599Z",
  //       updated_by_id: 1,
  //       updated_by_name: "lyra",
  //       scheme_wallet_id: "978",
  //       app_user_id: 443,
  //       user_type_id: 2,
  //       user_type: "retailer",
  //       wallet_status: "3",
  //       point_earned: "0.00",
  //       point_redeemed: "0.00",
  //       point_balance: "0.00",
  //       point_expired: "0.00",
  //       gift_catalogue: [
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 3,
  //           name: "Combo Voucher",
  //           brand: "Bata",
  //           points: 3,
  //           value: 3,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261406795-222877395.png",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 2,
  //           name: "Voucher",
  //           brand: "Bata",
  //           points: 2,
  //           value: 2,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261376761-588744604.png",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 1,
  //           name: "Bata Card",
  //           brand: "Bata",
  //           points: 1,
  //           value: 1,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261342488-442000408.jpg",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //       ],
  //     },
  //     {
  //       id: 8,
  //       name: "Expired Test Scheme",
  //       user_types: [2, 3],
  //       states: ["Uttar Pradesh"],
  //       gift_catalogue_id: 2,
  //       scheme_start: "2024-07-01",
  //       scheme_end: "2024-07-12",
  //       redeem_start: "2024-07-17",
  //       redeem_end: "2024-07-31",
  //       type: "1",
  //       products: [],
  //       image:
  //         "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720604602806-387774581RUMBA.jpg",
  //       pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720617280204-657186004Terms-and-Conditions---JQR.pdf",
  //       status: "1",
  //       created_at: "2024-07-12T07:37:13.599Z",
  //       created_by_id: 1,
  //       created_by_name: "lyra",
  //       updated_at: "2024-07-12T07:37:13.599Z",
  //       updated_by_id: 1,
  //       updated_by_name: "lyra",
  //       scheme_wallet_id: "978",
  //       app_user_id: 443,
  //       user_type_id: 2,
  //       user_type: "retailer",
  //       wallet_status: "3",
  //       point_earned: "0.00",
  //       point_redeemed: "0.00",
  //       point_balance: "0.00",
  //       point_expired: "0.00",
  //       gift_catalogue: [
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 3,
  //           name: "Combo Voucher",
  //           brand: "Bata",
  //           points: 3,
  //           value: 3,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261406795-222877395.png",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 2,
  //           name: "Voucher",
  //           brand: "Bata",
  //           points: 2,
  //           value: 2,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261376761-588744604.png",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //         {
  //           catalogue_id: 2,
  //           catalogue_name: "new Bata",
  //           catalogue_type: "point",
  //           user_types: [2],
  //           id: 1,
  //           name: "Bata Card",
  //           brand: "Bata",
  //           points: 1,
  //           value: 1,
  //           images: [
  //             "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261342488-442000408.jpg",
  //           ],
  //           created_at: "2024-03-21T06:36:11.303Z",
  //           created_by_name: "Bata",
  //         },
  //       ],
  //     },
  //   ],
  // };

  useEffect(() => {
    const getToken = async () => {
      const month = String(selectedDataStart.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() is 0-based (0 for January, 1 for February, etc.)
      const year = selectedDataStart.getFullYear();

      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const params = {
          appUserID: userData.id,
          token: token,
          month: month,
          year: year,
        };
        getAllSalesBoosterFunc(params);
      }
    };
    getToken();
  }, []);
  

  useEffect(() => {
    if (getAllSalesBoosterData) {
      console.log(
        "getAllSalesBoosterData",
        JSON.stringify(getAllSalesBoosterData)
      );
      if (getAllSalesBoosterData.success) {
        setScheme(getAllSalesBoosterData?.body);
        setActiveScheme(getAllSalesBoosterData?.body);
        // setGifts(getAllSalesBoosterData.body.gifts);
        // getCategories(getAllSalesBoosterData.body.gifts);
        // setSelectedGifts(getAllSalesBoosterData.body.gifts);
      }
    } else if (getAllSalesBoosterError) {
      console.log("getAllSalesBoosterError", getAllSalesBoosterError);
    }
  }, [getAllSalesBoosterData, getAllSalesBoosterError]);

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );

        console.log("Selected start date", selectedDataStart);

        const month = String(selectedDataStart.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() is 0-based (0 for January, 1 for February, etc.)
        const year = selectedDataStart.getFullYear();

        console.log("mont year", month, year);

        const token = credentials.username;
        const params = {
          appUserID: userData.id,
          token: token,
          type: "",
          month: month + "",
          year: year + "",
        };
        getAllSalesBoosterFunc(params);
      }
    };
    getToken();
  }, [selectedDataStart]);

  const getSelectedDates = useCallback(
    (startDate) => {
      // Convert the input start date to a JavaScript Date object
      const inputStartDate = new Date(startDate);

      // Filter the data based on the start date
      const filteredData = scheme?.filter((item) => {
        const itemStartDate = new Date(item.start_date);
        console.log("getSelectedDate function", itemStartDate, inputStartDate);

        // Check if the item's start date is greater than or equal to the input start date
        return itemStartDate >= inputStartDate;
      });

      console.log("filteredData", filteredData, startDate);
      setActiveScheme(filteredData);
    },
    [setActiveScheme]
  );

  const getCategories = (data) => {
    const categoryData = data.map((item, index) => {
      return item.brand.trim();
    });
    const set = new Set(categoryData);
    const tempArray = Array.from(set);
    setCategories(tempArray);
  };

  const handlePress = (data) => {
    setSelectedGifts(data);
    setSelected(true);
  };

  const FilterSchemeComponent = React.memo((props) => {
    const [openStart, setOpenStart] = useState(false);

    const handleDateChange = (date) => {
      console.log("thedate",date)
      setOpenStart(false);
      setSelectedDataStart(date);
      props.getDate(date);
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
            padding: 10,
            width: "90%",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            marginLeft: 20,
          }}
        >
          <PoppinsTextMedium
            content={`${moment(selectedDataStart).format("MMM YYYY")}`}
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "black",
              borderBottomWidth: 0.5,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              paddingLeft: 10,
              borderRadius: 30,
              paddingHorizontal: 10,
              paddingVertical: 8,
              marginLeft: "auto",
              borderWidth: 0.5,
              borderColor: "#808080",
              flexDirection: "row",
              justifyContent: "center",
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
              style={{ color: "#808080", fontWeight: "600", marginRight: 10 }}
              content={"Select Month & Year"}
            />
            <Image
              style={{
                height: 13,
                width: 12,
                resizeMode: "contain",
                marginTop: 2,
                marginLeft: 5,
              }}
              source={require("../../../assets/images/arrowDown.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  });

  const NewSchemeComponent = (props) => {
    const image = props.image;
    const name = props.name;
    const worth = props.worth;
    const earnedPoints = props?.data?.point_earned
      ? props?.data?.point_earned
      : 0;
    const coin = props.coin;
    const type = props.data.trigger_key;
    console.log("active scheme", props.data.pdf);
    return (
      <View
        style={{
          height: 180,
          width: "90%",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: ternaryThemeColor,
          borderRadius: 20,
          marginTop: 20,
          paddingBottom:5
        }}
      >
        <View
          style={{
            height: "60%",
            width: "100%",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginTop: 10,
          }}
        >
          <View
            style={{
              height: 100,
              width: "25%",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: 65,
                width: 65,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                //   borderWidth: 1,
                borderColor: "white",
              }}
            >
              {image != undefined && image ? (
                <Image
                  style={{
                    height: 65,
                    width: 65,
                    resizeMode: "contain",
                    borderRadius: 10,
                  }}
                  source={{ uri: image }}
                ></Image>
              ) : (
                <Image
                  style={{
                    height: 65,
                    width: 65,
                    resizeMode: "contain",
                    borderRadius: 10,
                  }}
                  source={require("../../../assets/images/giftBlue.png")}
                ></Image>
              )}
            </View>
          </View>
          <View
            style={{
              width: "70%",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                borderColor: "white",
                borderBottomWidth: 1,
                alignItems: "center",
                justifyContent:'center',
                paddingBottom: 4,
              }}
            >
              <PoppinsTextMedium
                style={{ color: "white", fontSize: 18, fontWeight: "700" , marginBottom:5}}
                content={name}
              ></PoppinsTextMedium>
            </View>
            {/* <View
              style={{
                width: "100%",
                borderColor: "white",
                borderBottomWidth: 1,
                alignItems: "flex-start",
                flexDirection: "row",
                marginTop: 10,
                paddingBottom: 6,
              }}
            >
              <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                content={"Total Earn Points"}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{
                  color: "white",
                  fontSize: 12,
                  fontWeight: "500",
                  marginLeft: "60%",
                }}
                content={earnedPoints}
              ></PoppinsTextMedium>
            </View> */}
            <View
              style={{
                width: "100%",
                alignItems: "flex-start",
                paddingBottom: 6,
                flexDirection: "row",
                marginTop: 4,
              }}
            >
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "center",
                  width: "50%",
                  marginTop:15
                }}
              >
                <PoppinsTextMedium
                  style={{ color: "white", fontSize: 12, fontWeight: "600" }}
                  content={"Start Date"}
                ></PoppinsTextMedium>
                <PoppinsTextMedium
                  style={{ color: "white", fontSize: 12, fontWeight: "600", marginTop:5 }}
                  content={props.data.start_date}
                ></PoppinsTextMedium>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                  width: "50%",
                }}
              >
                <PoppinsTextMedium
                  style={{ color: "white", fontSize: 12, fontWeight: "600" , marginTop:15}}
                  content={"End Date"}
                ></PoppinsTextMedium>
                <PoppinsTextMedium
                  style={{ color: "white", fontSize: 12, fontWeight: "600", marginTop:5 }}
                  content={props.data.end_date}
                ></PoppinsTextMedium>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "96%",
            height: 1,
            backgroundColor: "white",
            marginTop: 10,
          }}
        ></View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            padding: 6,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SchemePointDetails", {
                type: type,
                data: props.data,
                date:selectedDataStart
              });
            }}
            style={{
              height: 30,
              width: 100,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#C6280A",
              borderRadius: 30,
              marginLeft: 4,
            }}
          >
            <PoppinsTextMedium
              content="View Points"
              style={{ color: "white" }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{height:30,width:100,alignItems:'center',justifyContent:'center',backgroundColor:'#2F40DE',borderRadius:30,marginLeft:4}}>
            <PoppinsTextMedium content="Redeem" style={{color:'white'}}></PoppinsTextMedium>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PdfComponent", { pdf: props.data.pdf });
            }}
            style={{
              height: 30,
              width: 100,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000",
              borderRadius: 30,
              marginLeft: 4,
            }}
          >
            <PoppinsTextMedium
              content="View PDF"
              style={{ color: "white" }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SchemeComponent = (props) => {
    const image = props.image;
    const name = props.name;
    const worth = props.worth;
    const earnedPoints = props?.data?.point_earned
      ? props?.data?.point_earned
      : 0;
    const coin = props.coin;
    return (
      <View
        style={{
          width: "90%",
          borderWidth: 0.2,
          borderColor: "#DDDDDD",
          elevation: 10,

          backgroundColor: ternaryThemeColor,
          borderRadius: 20,
          marginTop: 20,
          alignItems: "center",
          justifyContent: "center",
          height: 300,
        }}
      >
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "white",
            width: "100%",
            height: "40%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            padding: 4,
          }}
        >
          <View
            style={{
              height: 100,
              width: "40%",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "white",
              }}
            >
              <Image
                style={{
                  height: 100,
                  width: 100,
                  resizeMode: "contain",
                  borderRadius: 10,
                }}
                source={{ uri: props.data?.image }}
              ></Image>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "60%",
            }}
          >
            <PoppinsTextMedium
              style={{ color: "black", fontSize: 16, fontWeight: "700" }}
              content={name}
            ></PoppinsTextMedium>
            <PoppinsTextLeftMedium
              style={{
                color: "black",
                fontSize: 14,
                fontWeight: "500",

                textAlign: "left",
              }}
              content={`${name} Earned Points : ${earnedPoints} `}
            ></PoppinsTextLeftMedium>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: "60%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginTop: 10,
            marginLeft: 10,
          }}
        >
          <View
            style={{
              width: "90%",
              marginTop: 10,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",

                textAlign: "left",
              }}
              content={"Scheme Start Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft: 10,
              }}
              content={props.data?.start_date}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "90%",
              marginTop: 10,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",

                textAlign: "left",
              }}
              content={"Scheme End Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft: 10,
              }}
              content={props.data?.end_date}
            ></PoppinsTextMedium>
          </View>

          <View
            style={{
              height: 40,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            <PoppinsTextMedium
              content="Applicable States :"
              style={{ color: "white", fontSize: 10 }}
            ></PoppinsTextMedium>

            {props?.data?.states?.map((item, index) => {
              if (index == props?.data?.states?.length - 1) {
                return (
                  <PoppinsTextMedium
                    content={`${item} `}
                    style={{ color: "white", fontSize: 10 }}
                  ></PoppinsTextMedium>
                );
              } else {
                return (
                  <PoppinsTextMedium
                    content={`${item}, `}
                    style={{ color: "white", fontSize: 10 }}
                  ></PoppinsTextMedium>
                );
              }
            })}
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 20,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              disabled={!props.data.states?.includes(location.state)}
              onPress={() => {
                if (
                  new Date(props.data.redeem_start).getTime() <=
                    new Date().getTime() &&
                  new Date().getTime() <=
                    new Date(props.data.redeem_end).getTime()
                ) {
                  navigation.navigate("RedeemGifts");
                } else {
                  console.log(
                    "redemption window is not open",
                    new Date(props.data.redeem_start).getTime(),
                    new Date().getTime()
                  );
                  alert(
                    `Redemption window will start at ${props.data.redeem_start} and will end at ${props.data.redeem_end}`
                  );
                }
              }}
              style={{
                height: 40,
                width: "30%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: props.data.states?.includes(location.state)
                  ? "#D4B01C"
                  : "#D5D4D3",
                borderRadius: 20,
              }}
            >
              <PoppinsTextMedium
                content="Redeem"
                style={{
                  color: props.data.states?.includes(location.state)
                    ? "white"
                    : "black",
                  fontWeight: "800",
                  fontSize: 15,
                }}
              ></PoppinsTextMedium>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("PdfComponent", { pdf: props.data?.pdf });
              }}
              style={{
                height: 40,
                width: "30%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: ternaryThemeColor,
                borderRadius: 20,
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              <PoppinsTextMedium
                content="View"
                style={{ color: "white", fontWeight: "800", fontSize: 15 }}
              ></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  // const handleCurrentData=()=>{
  //   const currentScheme = schemeData?.body?.filter((item,index)=>{
  //     if(((new Date(item.scheme_start).getTime()< new Date().getTime()) && ( new Date().getTime()< new Date(item.scheme_end).getTime())))
  //     return item
  //   })
  //   setActiveScheme(currentScheme)
  //   console.log("current scheme", currentScheme)
  // }
  // const handlePreviousData=()=>{
  //   const currentScheme = schemeData?.body?.filter((item,index)=>{
  //     if((( new Date().getTime()> new Date(item.scheme_end).getTime())))
  //     return item
  //   })
  //   setActiveScheme(currentScheme)
  //   console.log("current scheme", currentScheme)
  // }

  // const FilterComp = (props) => {
  //   const [color, setColor] = useState("#F0F0F0");
  //   const [selected, setSelected] = useState(props.selected);
  //   const title = props.title;
  //   const togglebox = () => {
  //     setSelected(!selected);
  //     console.log("selected", selected);

  //     if (!selected) {
  //       const temp = [...gifts];
  //       const filteredArray = temp.filter((item, index) => {
  //         console.log("From filter", item.brand, title);
  //         return item.brand === title;
  //       });
  //       console.log("filteredArray", filteredArray);
  //       // setSelectedGifts(filteredArray)
  //       props.handlePress(filteredArray);
  //     }
  //   };
  //   console.log("selected", selected);
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         togglebox();
  //       }}
  //       style={{
  //         minWidth: 60,
  //         height: 40,
  //         padding: 10,
  //         backgroundColor: selected ? secondaryThemeColor : "#F0F0F0",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         margin: 10,
  //         borderRadius: 4,
  //       }}
  //     >
  //       <PoppinsTextMedium
  //         style={{ fontSize: 12, color: selected ? "white" : "black" }}
  //         content={title}
  //       ></PoppinsTextMedium>
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
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
          content="Vijeta 4x"
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
          marginTop: 10,
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          paddingBottom: 10,
          height: "90%",
        }}
      >
    
        <ScrollView style={{ width: "100%" }}>
        {getAllSalesBoosterData && (
          <FilterSchemeComponent
            getDate={getSelectedDates}
          ></FilterSchemeComponent>
        )}
          <View
            style={{
              width: "100%",

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {gifts &&
              gifts.map((item, index) => {
                return (
                  <SchemeComponent
                    key={index}
                    name={item.name}
                    worth={item.value}
                    coin={item.points}
                    image={item.images[0]}
                  ></SchemeComponent>
                );
              })} */}
            {activeScheme &&
              activeScheme.map((item, index) => {
                return (
                  <NewSchemeComponent
                    data={item}
                    key={index}
                    name={item.name}
                    worth={"10000"}
                    coin={10}
                    image={item.image}
                    earnedPoints={100}
                  ></NewSchemeComponent>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
