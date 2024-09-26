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

const PanVerificationComp = (props) => {
  const [pan, setPan] = useState();
  const [panVerified, setPanVerified] = useState();
  
  const icon = useSelector((state) => state.apptheme.icon);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const required = props.required
  const verify = props.verify
  const showDetails = props.showDetails
  
  useEffect(()=>{
    verifyPanData && props.panData(panVerified, verifyPanData?.body)
  },[panVerified])

  const [
    verifyPanFunc,
    {
      data: verifyPanData,
      error: verifyPanError,
      isLoading: verifyPanIsLoading,
      isError: verifyPanIsError,
    },
  ] = useVerifyPanMutation();

  useEffect(() => {
    if (verifyPanData) {
      console.log("verifyPanData", verifyPanData);
      if (verifyPanData.success) {
        setPanVerified(true);
      }
    } else if (verifyPanError) {
      console.log("verifyPanError", verifyPanError);

      setPanVerified(false);
    }
  }, [verifyPanData, verifyPanError]);

  useEffect(() => {
    if (pan) {
      if (pan.length === 10) {
        const data = {
          pan: pan,
        };
        verifyPanFunc(data);
      }
    }
  }, [pan]);


    return (
        <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginTop:20}}>
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
                  content="Enter PAN Number"
                ></PoppinsTextMedium>
              </View>
              <TextInput
              value={pan}
              placeholder="Enter Pan Number"
                maxLength={15}
                onChangeText={(text) => {
                  setPan(text.toUpperCase());
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
                {verifyPanData && panVerified == true && (
                  <Check
                    name="checkcircle"
                    size={30}
                    color={ternaryThemeColor}
                  ></Check>
                )}
                {panVerified == false && (
                  <Cross
                    name="circle-with-cross"
                    size={30}
                    color={ternaryThemeColor}
                  ></Cross>
                )}
              </View>
            </View>

            {
              verifyPanError && <View style={{marginTop:10}}>
                <PoppinsTextMedium style={{color:'red'}} content={verifyPanError.data.message}></PoppinsTextMedium>
              </View>
            }
            {panVerified && verifyPanData && (
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
                    marginTop: 4,
                  }}
                  content={`Name : ${verifyPanData?.body?.registered_name}`}
                ></PoppinsTextMedium>
                {verifyPanData?.body?.father_name != "" && (
                  <PoppinsTextMedium
                    style={{
                      color: "#171717",
                      fontSize: 16,
                      fontWeight: "500",
                      marginLeft: 10,
                      marginTop: 10,
                      textAlign: "left",
                    }}
                    content={`Father's Name : ${verifyPanData?.body?.father_name}`}
                  ></PoppinsTextMedium>
                )}
              </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({})

export default PanVerificationComp;
