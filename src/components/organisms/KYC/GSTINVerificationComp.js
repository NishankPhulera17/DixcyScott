import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useVerifyPanMutation } from "../../../apiServices/verification/PanVerificationApi";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import Check from "react-native-vector-icons/AntDesign";
import Cross from "react-native-vector-icons/Entypo";
import { useVerifyGstMutation } from "../../../apiServices/verification/GstinVerificationApi";

const GSTINVerificationComp = (props) => {
  const [gstin, setGstin] = useState();
  const [gstinVerified, setGstinVerified] = useState();
  const [message, setMessage] = useState();

  const icon = useSelector((state) => state.apptheme.icon);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const [
    verifyGstFunc,
    {
      data: verifyGstData,
      error: verifyGstError,
      isLoading: verifyGstIsLoading,
      isError: verifyGstIsError,
    },
  ] = useVerifyGstMutation();

  useEffect(()=>{
   verifyGstData &&  props.gstinData(gstinVerified,verifyGstData.body)

  },[gstinVerified])
  

  

  useEffect(() => {
    if (verifyGstData) {
      console.log("verifyGstData", JSON.stringify(verifyGstData));
      if (verifyGstData.success) {
        setGstinVerified(true);
      }
    } else if (verifyGstError) {
      if (verifyGstError.status == 409) {
        setMessage(verifyGstError.data.message);
      }

      if (verifyGstError.status == 500) {
        setMessage(verifyGstError.data.Error.message);
      }

      setGstinVerified(false);
      console.log("verifyGstError", verifyGstError);
    }
  }, [verifyGstData, verifyGstError]);

  useEffect(() => {
    if (gstin)
      if (gstin.length === 15) {
        const data = {
          gstin: gstin,
        };
        verifyGstFunc(data);
      }
      else{
        setGstinVerified()
      }
  }, [gstin]);

  return <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginTop:20}}>
        <View
              style={{
                alignItems: "flex-start",
                justifyContent: "flex-start",
                height: 60,
                width: "80%",
                borderWidth: 1,
                borderColor: "#DDDDDD",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  padding: 4,
                  backgroundColor: "white",
                  position: "absolute",
                  top: -16,
                  left: 16,
                }}
              >
                <PoppinsTextMedium
                  style={{ color: "#919191", fontSize: 15, fontWeight: "500" }}
                  content="Enter GST Number"
                ></PoppinsTextMedium>
              </View>
              <TextInput
              autoCapitalize='characters'
                value={gstin}
                placeholder="Enter GSTIN Number"
                maxLength={15}
                onChangeText={(text) => {
                  setGstin(text.toLocaleUpperCase());
                }}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80%",
                  color: "#171717",
                  letterSpacing: 2,
                  marginLeft: 14,
                  height: "100%",
                }}
              ></TextInput>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {gstinVerified == true && (
                  <Check
                    name="checkcircle"
                    size={30}
                    color={ternaryThemeColor}
                  ></Check>
                )}
                {gstinVerified == false && (
                  <Cross
                    name="circle-with-cross"
                    size={30}
                    color={ternaryThemeColor}
                  ></Cross>
                )}
              </View>
            </View>
            {gstinVerified && verifyGstData && (
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "84%",
                  borderWidth: 1,
                  borderStyle: "dotted",
                  backgroundColor: "#F1F8FA",
                  borderColor: "#DDDDDD",
                  marginTop: 20,
                  borderRadius: 20,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                <PoppinsTextMedium
                  style={{
                    color: "#171717",
                    fontSize: 16,
                    fontWeight: "500",
                    marginLeft: 10,
                    marginTop: 10,
                  }}
                  content={`Name : ${verifyGstData?.body?.legal_name_of_business}`}
                ></PoppinsTextMedium>
                <PoppinsTextMedium
                  style={{
                    color: "#171717",
                    fontSize: 16,
                    fontWeight: "500",
                    marginLeft: 10,
                    marginTop: 10,
                    textAlign: "left",
                  }}
                  content={`Address : ${verifyGstData?.body?.principal_place_address}`}
                ></PoppinsTextMedium>
              </View>
            )}
            {gstinVerified == false && (
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <PoppinsTextMedium
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontWeight: "500",
                    marginLeft: 10,
                    marginTop: 10,
                  }}
                  content={message}
                ></PoppinsTextMedium>
              </View>
            )}
  </View>;
};

const styles = StyleSheet.create({});

export default GSTINVerificationComp;
