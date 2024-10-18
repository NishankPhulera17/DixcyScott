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
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import Check from "react-native-vector-icons/AntDesign";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import Cross from "react-native-vector-icons/Entypo";
import { useSendAadharOtpMutation,useVerifyAadharMutation } from "../../../apiServices/verification/AadharVerificationApi";
import OtpInput from "../OtpInput";
import FastImage from "react-native-fast-image";

const AADHAARVerificationComp = (props) => {
  const [otpSent, setOtpSent] = useState(false);
  const [loadingAadhaar, setLoadingAadhaar] = useState(false);
  const [otp, setOtp] = useState();
  const [showRetry, setShowRetry] = useState(false)
  const [aadhaarVerificationLoading, setAadharVerificationLoading] =
    useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [aadhar, setAadhar] = useState();
  const [aadharVerified, setAadharVerified] = useState();
  const [aadhaarError, setAadhaarError] = useState(false);
  const icon = useSelector((state) => state.apptheme.icon);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const gifUri = Image.resolveAssetSource(require('../../../../assets/gif/loader.gif')).uri;

  const [
    sendAadharOtpFunc,
    {
      data: sendAadharOtpData,
      error: sendAadharOtpError,
      isLoading: sendAadharOtpIsLoading,
      isError: sendAadharOtpIsError,
    },
  ] = useSendAadharOtpMutation();

  const [
    verifyAadharFunc,
    {
      data: verifyAadharData,
      error: verifyAadharError,
      isLoading: verifyAadharIsLoading,
      isError: verifyAadharIsError,
    },
  ] = useVerifyAadharMutation();

  useEffect(() => {
    if (sendAadharOtpData) {
      console.log("sendAadharOtpData", sendAadharOtpData);
      // setRefId(sendAadharOtpData.body.ref_id)
      if (sendAadharOtpData.success) {
        setTimeout(() => {
          setShowRetry(true);
        }, 15000);
        console.log("success");
        setOtpSent(true);
        setShowOtp(true);
        setLoadingAadhaar(false);
      }
    } else if (sendAadharOtpError) {
      setOtpSent(false);
      setLoadingAadhaar(false);
      console.log("sendAadharOtpError", sendAadharOtpError);
    }
  }, [sendAadharOtpData, sendAadharOtpError]);

  

  useEffect(()=>{
   verifyAadharData && props.aadharData(aadharVerified, verifyAadharData,aadhar)
  },[aadharVerified])

  useEffect(() => {
    setShowRetry(false)
    if (aadhar?.length === 12) {
      const data = {
        aadhaar_number: aadhar,
      };
      sendAadharOtpFunc(data);
      setLoadingAadhaar(true)
      console.log(data);
    }
  }, [aadhar]);

  useEffect(() => {
    if (verifyAadharData) {
      console.log("verifyAadharData", verifyAadharData);
      if (verifyAadharData.success) {
        setAadharVerified(true);
        setAadharVerificationLoading(false);
        setAadhaarError(false);
      }
    } else if (verifyAadharError) {
      setAadharVerificationLoading(false);
      setAadhaarError(true);
      console.log("verifyAadharError", verifyAadharError);
    }
  }, [verifyAadharError, verifyAadharData]);

  

  const getOtpFromComponent = (value) => {
    if (value.length === 6) {
      setOtp(value);
      const data = {
        ref_id: sendAadharOtpData?.body.ref_id,
        otp: value,
      };
      setAadharVerificationLoading(true);
      verifyAadharFunc(data);
      console.log("From Verify Otp", data);
    }
  };

  return (
    <View
      style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop:10 }}
    >
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          height: 60,
          width: "80%",
          borderWidth: 1,
          borderColor: "#DDDDDD",
          flexDirection: "row",
          marginTop: 40,
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
            content="Enter Aadhar Number"
          ></PoppinsTextMedium>
        </View>
        <TextInput
          value={aadhar}
          placeholder="Enter Aadhaar Number"
          maxLength={12}
          editable={!aadharVerified}
          onChangeText={(text) => {
            setAadhar(text);
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
          {aadharVerified == true && (
            <Check
              name="checkcircle"
              size={30}
              color={ternaryThemeColor}
            ></Check>
          )}
          {aadharVerified == false && (
            <Cross
              name="circle-with-cross"
              size={30}
              color={ternaryThemeColor}
            ></Cross>
          )}
        </View>
      </View>
      {loadingAadhaar && (
        <View style={{ marginTop: 10 }}>
          {/* <ActivityIndicator
            size={30}
            color={ternaryThemeColor}
          ></ActivityIndicator> */}
              <FastImage
    style={{ width: 30, height: 30, alignSelf: 'center'}}
    source={{
      uri: gifUri, // Update the path to your GIF
      priority: FastImage.priority.normal,
    }}
    resizeMode={FastImage.resizeMode.contain}
  />
          
        </View>
      )}
      {/* {sendAadharOtpError && (
        <View style={{ marginTop: 10 }}>
          <PoppinsTextMedium
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: ternaryThemeColor,
            }}
            content={sendAadharOtpError?.data?.Error?.message}
          ></PoppinsTextMedium>
        </View>
      )} */}

      {console.log("Eorrr", sendAadharOtpError?.data?.message)}





      {otpSent && sendAadharOtpData && !loadingAadhaar && !aadharVerified && (
        <View style={{ marginTop: 10 }}>
          <OtpInput
            getOtpFromComponent={getOtpFromComponent}
            color={"white"}
          ></OtpInput>
          <PoppinsTextMedium
            style={{
              color: "#131313",
              fontSize: 14,
              fontWeight: "600",
              paddingLeft: 20,
              paddingRight: 20,
            }}
            content="Kindly enter the otp sent to your aadhaar registered mobile number"
          ></PoppinsTextMedium>
        </View>
      )}
      {showRetry && !aadharVerified && (
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => {
            setAadhar("");
            setAadharVerified();
            setOtpSent();
            setAadharVerificationLoading(false);
          }}
        >
          <PoppinsTextMedium
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: ternaryThemeColor,
            }}
            content="Didn't got OTP, retry!!"
          ></PoppinsTextMedium>
        </TouchableOpacity>
      )}
      {aadharVerified && verifyAadharData && (
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
              textAlign: "left",
            }}
            content={` Name : ${verifyAadharData?.body?.name}`}
          ></PoppinsTextMedium>
          
          <PoppinsTextMedium
            style={{
              color: "#171717",
              fontSize: 16,
              fontWeight: "500",
              marginLeft: 10,
              marginTop: 4,
              textAlign: "left",
            }}
            content={`Address : ${verifyAadharData?.body?.address}`}
          ></PoppinsTextMedium>
          {aadharVerified && verifyAadharData?.body?.dob != "" && (
            <PoppinsTextMedium
              style={{
                color: "#171717",
                fontSize: 16,
                fontWeight: "500",
                marginLeft: 10,
                marginTop: 10,
                textAlign: "left",
              }}
              content={`Date of birth : ${verifyAadharData?.body?.dob}`}
            ></PoppinsTextMedium>
          )}
        </View>
      )}
      {aadhaarError && verifyAadharError && (
        <PoppinsTextMedium
          style={{ color: "red", fontSize: 14, fontWeight: "600" }}
          content={verifyAadharError?.data?.Error?.message}
        ></PoppinsTextMedium>
      )}

      {sendAadharOtpError && !loadingAadhaar &&  (
        <View style={{ marginTop: 10 }}>
       
          <PoppinsTextMedium
            style={{
              color: "red",
              fontSize: 14,
              fontWeight: "600",
              paddingLeft: 20,
              paddingRight: 20,
            }}
            content={sendAadharOtpError?.data?.message }
          ></PoppinsTextMedium>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default AADHAARVerificationComp;
