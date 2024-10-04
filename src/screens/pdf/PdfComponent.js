import React, { useEffect } from "react";
import { StyleSheet, Dimensions, View, BackHandler, Text, TouchableOpacity, Image } from "react-native";
import Pdf from "react-native-pdf";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";

const PdfComponent = ({ route, navigation }) => {
  const pdf = route?.params?.pdf;
  const pdfLink = pdf == null ? "" : pdf;
  const source =
    pdf == null ? { uri: "", cache: true } : { uri: pdfLink, cache: true };

    const {t} = useTranslation()
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
      <View
        style={{
          height: 50,
          width: "100%",
          backgroundColor: ternaryThemeColor,
          alignItems: "flex-start",
          justifyContent: "center",
          flexDirection: "row",
        //   marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            height: 20,
            width: 20,
            position: "absolute",
            left: 20,
            marginTop: 20,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>

        <PoppinsTextMedium
          style={{
            fontSize: 20,
            color: "#ffffff",
            marginTop: 15,
            position: "absolute",
            left: 50,
          }}
          content={t("PDF")}
        ></PoppinsTextMedium>
      </View>

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

export default PdfComponent;
