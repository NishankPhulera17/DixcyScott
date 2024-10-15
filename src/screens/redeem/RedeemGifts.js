import React, { useEffect, useId, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Text,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import Plus from "react-native-vector-icons/Entypo";
import { theme } from "../../utils/HandleClientSetup";
import Minus from "react-native-vector-icons/Entypo";
import Check from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
import { useFetchGiftCatalogueByUserTypeAndCatalogueTypeMutation } from "../../apiServices/gifts/GiftApi";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import * as Keychain from "react-native-keychain";
import ErrorModal from "../../components/modals/ErrorModal";
import SuccessModal from "../../components/modals/SuccessModal";
import MessageModal from "../../components/modals/MessageModal";
import PointHistory from "../historyPages/PointHistory";
import { useTranslation } from "react-i18next";
import { use } from "i18next";
import { check } from "react-native-permissions";
import RewardBox from "../../components/molecules/RewardBox";

const RedeemGifts = ({ navigation, route }) => {
  const [search, setSearch] = useState();
  const [cart, setCart] = useState(null);
  const [distinctCategories, setDistinctCategories] = useState([]);
  const [displayContent, setDisplayContent] = useState();
  const [pointBalance, setPointBalance] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const action = route.params?.action;
  const schemeType = route.params?.schemeType;
  const schemeGiftCatalogue = route.params?.schemeGiftCatalogue;
  const schemeID = route.parmas?.schemeID;
  const { t } = useTranslation();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  )
    ? useSelector((state) => state.apptheme.secondaryThemeColor)
    : "#FFB533";
  const userId = useSelector((state) => state.appusersdata.id);
  let tempPoints = 0;
  const [
    fetchGiftCatalogue,
    { data: giftCatalogueData, error: giftCatalogueError },
  ] = useFetchGiftCatalogueByUserTypeAndCatalogueTypeMutation();

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  useEffect(() => {
    const getData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const params = { userId: userId, token: token };
        userPointFunc(params);

        if (schemeGiftCatalogue == undefined) {
          fetchGiftCatalogue({
            token: token,
            type: "point",
            limit: 1000,
            offset: 0,
          });
        }
      }
    };
    getData();
    setCart(null);
  }, []);
  useEffect(() => {
    getDistinctSchemeCategories(schemeGiftCatalogue);
    setDisplayContent(schemeGiftCatalogue);
  }, [schemeGiftCatalogue]);

  useEffect(() => {
    if (giftCatalogueData) {
      if (schemeGiftCatalogue == undefined) {
        console.log("giftCatalogueData", giftCatalogueData);
        if (theme == "1") {
          getDistinctCategories(giftCatalogueData.body);
          setDisplayContent(giftCatalogueData.body);
        } else {
          const reconstructedData = groupGiftsByPoints(giftCatalogueData);
          console.log("reconstructedData", reconstructedData);
          setDisplayContent(reconstructedData);
        }
      }
    } else if (giftCatalogueError) {
      console.log("giftCatalogueError", giftCatalogueError);
    }
  }, [giftCatalogueData, giftCatalogueError]);

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
      if (userPointData.success) {
        setPointBalance(userPointData.body.point_balance);
      }
    } else if (userPointError) {
      console.log("userPointError", userPointError);
    }
  }, [userPointData, userPointError]);

  const getDistinctSchemeCategories = (data) => {
    let allCategories = [];

    for (var i = 0; i < data?.length; i++) {
      allCategories.push(data[i]?.category);
    }
    const set = new Set(allCategories);
    const arr = Array.from(set);
    setDistinctCategories(arr);
  };

  const getDistinctCategories = (data) => {
    let allCategories = [];

    for (var i = 0; i < data.length; i++) {
      allCategories.push(giftCatalogueData.body[i].category);
    }
    const set = new Set(allCategories);
    const arr = Array.from(set);
    setDistinctCategories(arr);
  };

  const modalClose = () => {
    setError(false);
    setSuccess(false);
  };

  const handleSearch = (data) => {
    if(theme=="1")
    {
      const searchOutput = giftCatalogueData.body.filter((item, index) => {
        return item.name.toLowerCase().includes(data.toLowerCase());
      });
      setDisplayContent(searchOutput);
    }
    else{
      const searchOutput = giftCatalogueData.body.filter((item, index) => {
        return item.name.toLowerCase().includes(data.toLowerCase());
      });
      const tempData = transformData(searchOutput)
      console.log("Search Items",tempData)
      setDisplayContent(tempData)

    }

  };

  const groupGiftsByPoints = (data) => {
    const giftsByPoints = {};

    // Iterate over each gift
    data.body.forEach((gift) => {
      const { points } = gift;

      // Initialize the array for this points value if it doesn't exist
      if (!giftsByPoints[points]) {
        giftsByPoints[points] = [];
      }

      // Add the gift to the array for this points value
      giftsByPoints[points].push(gift);
    });

    return giftsByPoints;
  };

  const transformData = (data) => {
    // Create an empty object to hold the transformed data
    const transformed = {};
  
    // Iterate through each item in the data array
    data.forEach(item => {
      // Extract the points from the item
      const { points } = item;
  
      // Initialize an array for the points key if it doesn't exist
      if (!transformed[points]) {
        transformed[points] = [];
      }
  
      // Add the current item to the array for the corresponding points
      transformed[points].push(item);
    });
  
    return transformed;
  };
  
  const Categories = (props) => {
    const image = props.image;
    const data = props.data;
    return (
      <TouchableOpacity
        onPress={() => {
          const filteredData = giftCatalogueData.body.filter((item, index) => {
            return item.category == data;
          });
          setDisplayContent(filteredData);
          setCart(null);
        }}
        style={{
          marginLeft: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 35,
            marginLeft: 0,
            backgroundColor: secondaryThemeColor,
          }}
        >
          <Image
            style={{ height: 30, width: 30, resizeMode: "contain" }}
            source={image}
          ></Image>
        </View>
        <PoppinsTextMedium
          style={{
            color: "black",
            fontSize: 14,
            fontWeight: "600",
            marginTop: 2,
          }}
          content={data}
        ></PoppinsTextMedium>
      </TouchableOpacity>
    );
  };
  const addItemToCart = (data, operation, count) => {
    let tempCount = 0;
    let temp = cart;
    console.log("data", data);
    if (cart.length <= 1) {
      if (operation === "plus") {
        temp.push(data);
        setCart(temp);
      } else {
        // setPointBalance(pointBalance+Number(data.points))
        const tempcart = [...cart];
        console.log("Deleted the data from cart", tempcart);
        for (var i = 0; i < tempcart.length; i++) {
          if (tempcart[i].id === data.id) {
            tempCount++;
            if (tempCount === 1) {
              tempcart.splice(i, 1);
            }
          }
        }

        setCart(tempcart);
      }
    } else {
      alert("You can redeem one gift at a time");
    }

    console.log("cart issahdashdghashgd", cart);

    console.log(temp);
  };

  const handleAddToCart = (gift) => {
    if (cart && cart.id === gift.id) {
      // If the same item is being unchecked, remove it from the cart
      setCart(null);
    } else {
      // Otherwise, add the new item to the cart
      setCart(gift);
    }
  };
  useEffect(() => {
    console.log("cart ready to go", cart);
  }, [cart]);

  const RewardsBox = (props) => {
    const [count, setCount] = useState(0);
    const [checked, setChecked] = useState(props.selected);
    const image = props.image;
    const points = props.points;
    const index = props.ind;
    const selected = props.selected;
    const product = props.product;
    const category = props.category;
    const data = props.data;

    useEffect(() => {
      setChecked(selected);
    }, [selected]);

    const handlePress = () => {
      setChecked(!checked);
      props.handleSelect(data);
    };

    const changeCounter = (operation) => {
      console.log(pointBalance, "tempPoints", tempPoints, data.points);
      if (operation === "plus") {
        console.log(Number(pointBalance), Number(data.points));
        if (tempPoints + Number(data.points) <= pointBalance) {
          if (Number(pointBalance) >= Number(data.points)) {
            if (count == 0 && cart.length == 0) {
              tempPoints = tempPoints + data.points;
              let temp = count;
              temp++;
              setCount(temp);
              props.handleOperation(data, operation, temp);
            }
          } else {
            setError(true);
            setMessage("Sorry you don't have enough points.");
          }
        }
        // else{
        //   setError(true)
        //   setMessage("You don't have enough points")
        // }
      } else {
        if (count == 1) {
          let temp = count;
          temp--;
          setCount(temp);
          props.handleOperation(data, operation, temp);
          tempPoints = tempPoints - data.points;
        }

        // setPointBalance(pointBalance+data.points)
      }
    };

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "50%",
        }}
      >
        {theme == "1" ? (
          <TouchableOpacity
            onPress={() => {
              console.log("Pressed");
            }}
            style={{
              height: 120,
              width: "90%",
              alignItems: "center",
              justifyContent: "flex-start",
              borderWidth: 0.6,
              borderColor: "#EEEEEE",
              backgroundColor: "#FFFFFF",
              margin: 10,
              marginLeft: 20,
              elevation: 4,
            }}
          >
            <View
              style={{
                height: "40%",
                width: "100%",
                backgroundColor: secondaryThemeColor,
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: 50,
                  width: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 0.4,
                  borderColor: "#DDDDDD",
                  backgroundColor: "white",
                  marginLeft: 20,
                  top: 14,
                }}
              >
                <Image
                  style={{ height: 40, width: 40, resizeMode: "contain" }}
                  source={{ uri: image }}
                ></Image>
              </View>
              <LinearGradient
                style={{
                  height: 30,
                  padding: 4,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  borderRadius: 4,
                  position: "absolute",
                  right: 80,
                }}
                colors={["#FF9100", "#E4C52B"]}
              >
                <Image
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                  source={require("../../../assets/images/coin.png")}
                ></Image>
                <PoppinsTextMedium
                  style={{
                    fontSize: 12,
                    color: "white",
                    fontWeight: "700",
                    marginLeft: 10,
                  }}
                  content={`Points : ${points}`}
                ></PoppinsTextMedium>
              </LinearGradient>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  position: "absolute",
                  right: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (count > 0) {
                      changeCounter("minus");
                    }
                  }}
                >
                  <Minus name="minus" color="black" size={24}></Minus>
                </TouchableOpacity>

                <View
                  style={{
                    height: 24,
                    width: 20,
                    backgroundColor: "white",

                    borderRadius: 4,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PoppinsTextMedium
                    style={{ color: "black", fontSize: 14, fontWeight: "700" }}
                    content={count}
                  ></PoppinsTextMedium>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    changeCounter("plus");
                  }}
                >
                  <Plus name="plus" color="black" size={20}></Plus>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                height: "60%",
                alignItems: "flex-start",
                justifyContent: "center",
                marginTop: 4,
                width: "90%",
              }}
            >
              <PoppinsTextMedium
                style={{
                  color: "black",
                  fontSize: 13,
                  width: "90%",
                  marginLeft: 4,
                }}
                content={product}
              ></PoppinsTextMedium>

              <PoppinsTextMedium
                style={{ color: "#919191", fontSize: 13, width: "90%" }}
                content={category}
              ></PoppinsTextMedium>
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: "90%",
              height: 200,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#DDDDDD",
              alignItems: "center",
              justifyContent: "center",
              margin: '4%',
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Image
                style={{ height: 110, width: 100, resizeMode: "contain" }}
                source={{ uri: image }}
              ></Image>
             {checked && ( <TouchableOpacity
                onPress={() => {}}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "black",
                  position: "absolute",
                  top: 6,
                  right: 6,
                }}
              >
                
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 9,
                      backgroundColor: ternaryThemeColor,
                    }}
                  ></View>
                
              </TouchableOpacity>
              )}
            </View>
            <PoppinsTextMedium
              style={{ color: "#494949", fontSize: 16, fontWeight: "700" }}
              content={product}
            ></PoppinsTextMedium>
            <TouchableOpacity
              onPress={() => {
                handlePress();
              }}
              style={{
                height: 36,
                width: 140,
                backgroundColor: ternaryThemeColor,
                borderRadius: 10,
                marginTop: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PoppinsTextMedium
                content="ADD"
                style={{ color: "white", fontSize: 16, fontWeight: "700" }}
              ></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        backgroundColor: ternaryThemeColor,
        height: "100%",
      }}
    >
    
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          message={message}
          openModal={success}
        ></MessageModal>
      )}
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: "10%",
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
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <PoppinsTextMedium
            content={t("Redeem Points")}
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "700",
              color: "white",
            }}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            content={`${pointBalance} ${t("pts available")}`}
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "700",
              color: "white",
            }}
          ></PoppinsTextMedium>
        </View>
      </View>
      <View
        style={{
          height: "90%",
          width: "100%",
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          alignItems: "center",
          justifyContent: "flexx-start",
          backgroundColor: "white",
        }}
      >
               <View style={{ alignItems: "center", justifyContent: "center", width: '90%',backgroundColor:'white', marginTop:40 }}>
                        <RewardBox ></RewardBox>
                    </View>
                    <ScrollView >

                    
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: "#EFF6FC",
            width: "100%",
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
            paddingBottom: 20,
          }}
        >
          {giftCatalogueData && (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  height: 40,
                  width: "80%",
                  backgroundColor: "white",
                  borderRadius: 20,
                }}
              >
                <Icon
                  style={{ position: "absolute", left: 10 }}
                  name="magnifying-glass"
                  size={30}
                  color={ternaryThemeColor}
                ></Icon>
                <TextInput
                  style={{ marginLeft: 20, width: "70%", color: "black" }}
                  placeholder="Type Product Name"
                  value={search}
                  onChangeText={(text) => {
                    handleSearch(text);
                  }}
                ></TextInput>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
              >
                <Image
                  style={{ height: 26, width: 26, resizeMode: "contain" }}
                  source={require("../../../assets/images/settings.png")}
                ></Image>
              </View>
            </View>
          )}
        </View>
        {theme == "1" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setDisplayContent(giftCatalogueData.body);
                setCart(null);
              }}
              style={{
                height: 70,
                width: 70,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{ height: 40, width: 40, resizeMode: "contain" }}
                source={require("../../../assets/images/categories.png")}
              ></Image>
              <PoppinsTextMedium
                style={{
                  color: "black",
                  fontSize: 14,
                  fontWeight: "600",
                  marginTop: 2,
                }}
                content="All"
              ></PoppinsTextMedium>
            </TouchableOpacity>
            <View
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >
              {distinctCategories &&
                distinctCategories.map((item, index) => {
                  return (
                    <Categories
                      key={index}
                      data={item}
                      image={require("../../../assets/images/box.png")}
                    ></Categories>
                  );
                })}
            </View>
          </View>
        )}
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: theme == "1" ? 300 : 0,
          }}
        >
          {theme == "1" && (
            <PoppinsTextMedium
              style={{
                color: "#171717",
                fontSize: 14,
                fontWeight: "700",
                marginTop: 10,
                marginBottom: 10,
              }}
              content={t("Rewards")}
            ></PoppinsTextMedium>
          )}
          {theme == "1" && displayContent && (
            <FlatList
              data={displayContent}
              style={{ width: "100%" }}
              contentContainerStyle={{ width: "100%" }}
              renderItem={({ item, index }) => {
                return (
                  <RewardsBox
                    handleOperation={addItemToCart}
                    handleSelect={handleAddToCart}
                    data={item}
                    key={index}
                    ind={index}
                    product={item.name}
                    category={item.catalogue_name}
                    points={item.points}
                    image={item.images[0]}
                  ></RewardsBox>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          )}

          {theme !== "1" && displayContent && (
            <FlatList
              data={Object.keys(displayContent)}
              style={{ width: "100%" }}
              contentContainerStyle={{ width: "100%", paddingBottom: 200 }}
              renderItem={({ item, index }) => {
                console.log("pointasdasdqweqw", item);
                return (
                  <View key={index} style={styles.categoryContainer}>
                    <View
                      style={{
                        opacity: 0.8,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: ternaryThemeColor,
                        borderRadius: 10,
                        backgroundColor: secondaryThemeColor,
                        width: "94%",
                        padding: 6,
                        marginBottom: 20,
                      }}
                    >
                      <Text style={styles.header}>Points: {item}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "flex-start", // Align items at the start of each row
                        justifyContent: "space-between", // Distribute space evenly between items
                        width: "100%",
                      }}
                    >
                      {displayContent[item].map((gift, index) => (
                        <RewardsBox
                          ind={index}
                          product={gift.name}
                          category={gift.catalogue_name}
                          points={gift.points}
                          image={gift.images[0]}
                          key={gift.id}
                          data={gift}
                          handleSelect={handleAddToCart}
                          selected={cart && cart.id === gift.id}
                        />
                      ))}
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (cart !== null) {
              navigation.replace("CartList", {
                cart: [cart],
                schemeType: schemeType,
                schemeID: schemeID,
              });
            } else setError(true), setMessage("Cart cannot be empty");
          }}
          style={{
            alignItems: "center",
            borderRadius: 30,
            justifyContent: "center",
            alignSelf:'center',
            marginBottom:30,
            height: 50,
            width: "60%",
            backgroundColor: 'black',
            position: "absolute",
            bottom: 20,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "white", fontSize: 16, fontWeight: "700" }}
            content={t("Proceed")}
          ></PoppinsTextMedium>
        </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  categoryContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#171717",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    backgroundColor: "red",
  },
});

export default RedeemGifts;
