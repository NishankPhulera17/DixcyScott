import React, { useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  BackHandler,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import Pdf from "react-native-pdf";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";

const PdfIntroduction = ({ route, navigation }) => {
  const pdf = route?.params?.pdf;
  console.log("THE PDF IS HERE", pdf, route);
  const pdfLink = pdf == null ? "" : pdf;
  const source =
    pdf == null ? { uri: "", cache: true } : { uri: pdfLink, cache: true };

  const { t } = useTranslation();

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack(); // Navigate back when back button is pressed
      // Prevent default back press behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove(); // Cleanup function to remove the event listener
  }, [navigation]); // Include navigation in the dependency array

  return (
    <View style={styles.container}>
      <View style={{ height: "85%" }}>
        {pdf != undefined && pdf != null && (
          <Pdf
            trustAllCerts={false}
            source={pdf && source}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        )}
      </View>

      <View style={{ alignItems: "center", height:'15%',justifyContent:'center' }}>
        <TouchableOpacity
          onPress={() => {
            // handleNext();
            navigation.navigate("SelectUser")
          }}
          style={{
            width: 200,
            marginTop:10,
            paddingVertical: 20,
            alignItems: "center",
            backgroundColor: "#FF6318",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              Continue
            </Text>

            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
                marginLeft: 20,
                marginTop: 4,
              }}
              source={require("../../../assets/images/whiteArrowRight.png")}
            ></Image>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default PdfIntroduction;
