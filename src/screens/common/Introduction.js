import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import DotHorizontalList from "../../components/molecules/DotHorizontalList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pdf from "react-native-pdf";

const Introduction = ({ navigation }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [skipEnabled, setSkipEnabled] = useState(false);
  // const [isAlreadyIntroduced, setIsAlreadyIntroduced] = useState(null)

  //asynch storage data saving
  const storeData = async () => {
    try {
      await AsyncStorage.setItem("isAlreadyIntroduced", "Yes");
        console.log("saved")
    } catch (e) {
      // saving error
      console.log("error", e);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSkipEnabled(true);
    }, 1500);
  }, []);
  // This is the array used to display images, add or remove image from the array to modify as per clients need----------------

  // const descriptionImages=[require('../../../assets/images/Vijeta4X.png'),require('../../../assets/images/SchemeVijeta.png')]
  const descriptionImages=[require('../../../assets/images/SchemeVijeta.png')]


  // function to handle next button press and to navigate to Select Language page when all the images are showed-----------------
  const handleNext = () => {
    console.log(descriptionImages?.length);
    if (imageIndex < descriptionImages?.length) {
      if (imageIndex == descriptionImages?.length - 1) {
        storeData();
        // navigation.navigate("SelectUser");
        navigation.navigate("PdfIntroduction",{pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/Step-3.pdf"});

      } else {
        storeData();
        setImageIndex(imageIndex + 1);
      }
    }
    else{
      storeData();

    }
  };

  const handleSkip = () => {
    // navigation.navigate('SelectLanguage')
    storeData();
    navigation.navigate("SelectUser");
  };

  return (
    <View style={{ backgroundColor: "#FFFFFF", height: "100%", width: "100%" }}>
      {/* <ImageBackground
        source={descriptionImages[imageIndex]}
        resizeMode="stretch"
        style={{
          backgroundColor: "transparent",
          minHeight: imageIndex == 1 ? "100%" : "70%",
          width: "100%",
          flex: 1,
        }}
      > */}
        <View style={{width:'100%',height: imageIndex == 1? "100%" : "75%"}}>
                <Image style={{height:"100%",width:"100%"}} source={descriptionImages[imageIndex]}></Image>
            </View>
        <View
          style={{
            width: "100%",
            position: "absolute",
            bottom: 30,
            backgroundColor: "transparent",
          }}
        >
          {/* {!(imageIndex == descriptionImages?.length - 1) && (
            <View style={{ flex: 1 }}>
              <DotHorizontalList
                no={descriptionImages?.length}
                primaryColor="#F47B20"
                secondaryColor="#F47B20"
                selectedNo={imageIndex}
              ></DotHorizontalList>

              <View style={{ width: "100%", height: "100%", marginTop: 20 }}>
                {skipEnabled && (
                  <TouchableOpacity
                    disabled={!skipEnabled}
                    style={{ position: "absolute", left: 40, bottom: 20 }}
                    onPress={() => {
                      handleSkip();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: "#F47B20",
                        fontWeight: "600",
                      }}
                    >
                      Skip
                    </Text>
                  </TouchableOpacity>
                )}
                <Text
                  onPress={() => {
                    handleNext();
                  }}
                  style={{
                    fontSize: 18,
                    color: "#F47B20",
                    position: "absolute",
                    right: 40,
                    bottom: 20,
                    fontWeight: "600",
                  }}
                >
                  Next
                </Text>
              </View>
            </View>
          )} */}

          {true && (
            <View style={{}}>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    handleNext();
                  }}
                  style={{
                    width: 240,
                    paddingVertical: 20,
                    alignItems: "center",
                    backgroundColor: "#FF6318",
                 
                  }}
                >
                    <View style={{flexDirection:'row'}}>
                    <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                  >
                    Continue
                  </Text>

                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                      marginLeft: 20,
                      marginTop:4
                    }}
                    source={require("../../../assets/images/whiteArrowRight.png")}
                  ></Image>
                    </View>
                
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Introduction;
