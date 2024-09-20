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
  PermissionsAndroid
} from "react-native";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import CameraInputWithUpload from "../../components/atoms/input/CameraInputWithUpload";
import { useUpdateProfileMutation } from "../../apiServices/profile/profileApi";
import AADHAARVerificationComp from "../../components/organisms/KYC/AADHAARVerificationComp";
import GSTINVerificationComp from "../../components/organisms/KYC/GSTINVerificationComp";
import PanVerificationComp from "../../components/organisms/KYC/PanVerificationComp";
import { kycOption1, kycOption2 } from "../../utils/HandleClientSetup";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import * as Keychain from "react-native-keychain";
import ModalWithBorder from "../../components/modals/ModalWithBorder";
import Icon from 'react-native-vector-icons/Feather';
import Close from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LeftIcon from 'react-native-vector-icons/AntDesign'

const CheckKycOptions = ({navigation,route}) => {
  const [checked, setChecked] = React.useState();
  const [gotShopImage, setGotShopImage] = useState(false);
  const [shopData, setShopData] = useState()
  const [openModalWithBorder, setModalWithBorder] = useState(false)
  const [message, setMessage] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const [clickedSubmit, setClickedSubmit] = useState(true)
  const [panDetails, setPanDetails] = useState()
  const [aadharDetails, setAadharDetails] = useState()
  const [gstinDetails, setGstinDetails] = useState()
  const [gotPan, setGotPan] = useState(false)
  const [gotAadhar, setGotAadhar] = useState(false)
  const [gotGstin, setGotGstin] = useState(false)
  const [aadharNumber, setAadharNumber] = useState()
  // const [imageDta, setImageDta] = useState()
  const icon = useSelector((state) => state.apptheme.icon1);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const timer = useRef(0);
  const imageData = route?.params?.imageData
  console.log("imageData", imageData)
  const [
    updateProfileFunc,
    {
      data: updateProfileData,
      error: updateProfileError,
      isLoading: updateProfileIsLoading,
      isError: updateProfileIsError,
    },
  ] = useUpdateProfileMutation();


  useEffect(()=>{
    console.log("imageDataqwerty",imageData)
    if(imageData)
    {
      setGotShopImage(true)
      setShopData(imageData)
    }
    
  },[imageData])

  useEffect(()=>{
    if(kycOption2.length == 0)
    {
      setShowOptions(false)
    }
    else{
      setShowOptions(true)
    }
  },[])

  const modalClose = () => {
    setMessage('')
    setModalWithBorder(false)
    navigation.navigate("Dashboard")
  };
  
  const getShowImage = (data) => {
    console.log("GSTIN IMAGE UPLOADED", data);
    setShopData(data)
    setGotShopImage(true);
  };

  const handleGstinSubmission = () => {
    submitKycData()
  };  

  const panData =(panVerified, verifyPanData)=>{
    console.log("PAN Verification status", panVerified,verifyPanData)
    setPanDetails(verifyPanData)
    setGotPan(true)
  }
  const gstinData=(gstinVerified,verifyGstData)=>{
    console.log("GSTIN Verification status", gstinVerified,verifyGstData)
    setGstinDetails(verifyGstData)
    setGotGstin(true)
  }
  const aadharData=(aadharVerified,verifyAadharData,aadhar)=>{
    console.log("AADHAAR Verification status", aadharVerified,verifyAadharData)
    setAadharDetails(verifyAadharData)
    setGotAadhar(true)
    setAadharNumber(aadhar)
  }

  useEffect(() => {
    if (updateProfileData) {
      console.log("updateProfileData", updateProfileData);
      setClickedSubmit(true)
      setModalWithBorder(true)
      setGotShopImage(false)
      setMessage("Congratulation, your account has been successfully updated.")
      createValidatedJson(updateProfileData?.body)
      // setTimeout(() => {
      //   console.log("running2")
      //   modalWithBorderClose()
      // }, 2000);
    } else if (updateProfileError) {
      console.log("updateProfileError", updateProfileError);
      setClickedSubmit(true)
      
    }
  }, [updateProfileData, updateProfileError]);

  useEffect(()=>{
    console.log("checked status",checked,kycOption1,kycOption2)
    tempData={}

  },[checked])

  const createValidatedJson=async(profileData)=>{
    let temp ={}
    try {
      const jsonValue = await AsyncStorage.getItem('loginData');
      console.log("loginData",JSON.parse(jsonValue))
      if(jsonValue!=null)
      {
        console.log("updateLoginData",jsonValue,profileData)
        if(profileData)
        {
          const keys = Object.keys(profileData)
          const values = Object.values(profileData)
          console.log("updateLoginDatakeys",keys,values)
        for(var i =0;i<keys.length;i++)
        {
          if(keys.includes("gstin"))
          {
            if(profileData["gstin"]!=null)
            temp["gstin"] = profileData["gstin"]
          }
          if(keys.includes("aadhar"))
          {
            if(profileData["aadhar"]!=null)
            temp["aadhar"] = profileData["aadhar"]
          }
          if(keys.includes("pan"))
          {
            if(profileData["pan"]!=null)
            temp["pan"] = profileData["pan"]
          }
          console.log("ghsadghhgsafdhhashdghas",profileData["gstin"],profileData["aadhar"],profileData["pan"])

        }
        console.log("updateLoginDataqwerty",temp)
        updateLoginData(temp, JSON.parse(jsonValue))
      }

      }
      
    } catch (e) {
      console.log("Error is reading loginData",e)
    }
  }

  const updateLoginData=(recievedKyc, loginData)=>{
    let temp = loginData
    const keys = Object.keys(recievedKyc)
    for(var i=0;i<keys.length;i++)
    {
      if(keys[i]== "gstin")
      {
        if(recievedKyc["gstin"])
        {
          temp["is_valid_gstin"] = true
          console.log("heloo form the other side",recievedKyc["gstin"],temp["is_valid_gstin"],temp)

        }
      }
      if(keys[i]== "aadhar")
      {
        if(recievedKyc["aadhar"])
        {
          temp["is_valid_aadhar"] = true
        }
      }
      if(keys[i]== "pan")
      {
        if(recievedKyc["pan"])
        {
          temp["is_valid_pan"] = true
        }
      }
    }
    console.log("dfgdfashjgdhjasghjdghjasgdhjgashjdgh",recievedKyc["gstin"],recievedKyc["aadhar"],recievedKyc["pan"])
    const storeData = async (value) => {
      console.log("storeDataloginDataQwerty",value)
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('loginData', jsonValue);
      } catch (e) {
        console.log("Error while saving loginData", e)
      }
    };
    storeData(temp)
  }

  const submitKycData =async()=>{
    let tempData = {}
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;

    if(gotPan)
    {
    tempData = {...tempData, "pan" : panDetails.pan}
    }
    if(gotAadhar)
    {
    tempData = {...tempData, "aadhar" : aadharNumber}
    }
    if(gotGstin)
    {
      tempData = {...tempData, "gstin" : gstinDetails?.GSTIN}
    }
    if(checked)
    {
      const optionsLength = kycOption1.length;
      const kycObjectValues = Object.values(tempData)
      const kycObjectKeys = Object.keys(tempData)

      if(kycObjectKeys.length == optionsLength && kycObjectValues.length == optionsLength)
      {
        console.log("got all fields from option 1",gotShopImage)
        if(!gotShopImage)
    {
      alert("Shop image is required to continue")
    }
    else{
      tempData={...tempData, "profile_pic" : shopData.fileLink,"is_online_verification":true}
      const params = {token:token,data:tempData}
      console.log("FINAL FORM SUBMISSION", params)
      setClickedSubmit(false)
      updateProfileFunc(params)
    }

      }
      else{
        let missingFields = " "
        for(var i=0;i<kycOption1.length;i++)
        {
          if(!kycObjectKeys.includes(kycOption1[i]))
          {
            missingFields +=  " "+kycOption1[i]
          }
        }
        alert("Missing fields "+missingFields)
      }
    }
    else{
      const optionsLength = kycOption2.length;
      const kycObjectValues = Object.values(tempData)
      const kycObjectKeys = Object.keys(tempData)

      if(kycObjectKeys.length == optionsLength && kycObjectValues.length == optionsLength)
      {
        console.log("got all fields from option 2")
        if(!gotShopImage)
    {
      alert("Shop image is required to continue")
    }
    else{
      tempData={...tempData, "profile_pic" : shopData.value,"is_online_verification":true}
      const params = {token:token,data:tempData}
      console.log("FINAL FORM SUBMISSION", params)
      setClickedSubmit(false)
      updateProfileFunc(params)
    }
      }
      else{
        let missingFields = " "
        for(var i=0;i<kycOption2.length;i++)
        {
          if(!kycObjectKeys.includes(kycOption2[i]))
          {
            missingFields += " "+kycOption2[i]
          }
        }
        alert("Missing fields "+missingFields)
      }
    }

    

  }
  const modalWithBorderClose = () => {
    setModalWithBorder(false);
    setMessage('')
    navigation.navigate("Dashboard")

    
    
  };

  const ModalContent = () => {
    return (
      <View style={{ width: '100%', alignItems: "center", justifyContent: "center",height:'100%' }}>
        <ScrollView contentContainerStyle={{ marginTop: 10, alignItems: 'center', maxWidth: '96%',marginTop:40 }}>
         
          <PoppinsTextMedium style={{ fontSize: 20, fontWeight: '800', color: ternaryThemeColor, marginLeft: 5, marginTop: 5 }} content={"Legal Notice & Consent - During validation of Aadhaar, PAN & GSTIN"}></PoppinsTextMedium>
          <PoppinsTextMedium style={{color:'black',fontWeight:'800',marginTop:10}} content="Aadhaar validation"></PoppinsTextMedium>
          <PoppinsTextMedium style={{color:'black'}} content="We, DIXCY industries Ltd, are in the business of manufacturing & selling of electrical cables & wires. We respect your privacy and handle your personal data in accordance with the applicable data protection laws. DIXCY may need to process your personal data for the purpose of future communications and incentive schemes, if any. The personal data collected may include but is not limited to name, address, contact details etc. We may share your personal data with service providers, business associates etc. or where required or permitted by law. All personal data processed is stored and retained in compliance with legal, regulatory and best practice business requirements."></PoppinsTextMedium>
          <PoppinsTextMedium style={{color:'black',fontWeight:'800',marginTop:10}} content="PAN validation"></PoppinsTextMedium>
          <PoppinsTextMedium style={{color:'black'}} content="We, DIXCY industries Ltd, are in the business of manufacturing & selling of electrical cables & wires. We respect your privacy and handle your personal data in accordance with the applicable data protection laws. DIXCY may need to process your personal data for the purpose of future communications and incentive schemes, if any. The personal data collected may include but is not limited to name, address, contact details etc. We may share your personal data with service providers, business associates etc. or where required or permitted by law. All personal data processed is stored and retained in compliance with legal, regulatory and best practice business requirements."></PoppinsTextMedium>
          


          {/* <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <ButtonOval handleOperation={modalWithBorderClose} backgroundColor="#000000" content="OK" style={{ color: 'white', paddingVertical: 4 }} />
          </View> */}

        </ScrollView>

        <TouchableOpacity style={[{
          backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: 4, right: 0,
        }]} onPress={modalClose} >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>

      </View>
    )
  }
  

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",
        height: "100%",
        width: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: ternaryThemeColor,
        }}
      >
        <View style={{alignItems:'center',justifyContent:'center',flexDirection:"row",marginLeft:10}}>
          <TouchableOpacity onPress={()=>{
            navigation.navigate("SelectUser")
          }}>
        <LeftIcon name="arrowleft" size={24} color={"white"}></LeftIcon>
        </TouchableOpacity>
        <Image
          style={{
            height: 80,
            width: 80,
            resizeMode: "contain",
            marginLeft: 20,
          }}
          source={{ uri: icon }}
        ></Image>
        </View>
        
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "white", fontSize: 29, fontWeight: "600" }}
            content="Complete Your"
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{ color: "white", fontSize: 29, fontWeight: "600" }}
            content="Registration"
          ></PoppinsTextMedium>
        </View>
      </View>
      <ScrollView
        style={{ width: "100%", flex: 1 }}
        contentContainerStyle={{ alignItems: "flex-start" }}
      >
        {showOptions && <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 20,
            width:'100%'
          }}

        >
          <View style={{width:'40%',alignItems:'center',justifyContent:'center'}}>
          <PoppinsTextLeftMedium
            style={{
              color: "#171717",
              fontSize: 16,
              fontWeight: "700",
              marginLeft: 10,
              marginRight: 4,
              
            }}
            content="Do you have GST ? "
          ></PoppinsTextLeftMedium>
          </View>
          <View style={{width:'60%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              padding:8,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: "black",
              flexDirection: "row",
            }}
          >
            <RadioButton
              value="option1"
              color={ternaryThemeColor}
              status={checked === true ? "checked" : "unchecked"}
              onPress={() => setChecked(true)}
            />
            <PoppinsTextMedium
              style={{ color: "#171717", fontSize: 12, fontWeight: "700" }}
              content="Yes"
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              padding:8,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: "black",
              flexDirection: "row",
              marginLeft: 10,
            }}
          >
            <RadioButton
              value="option2"
              color={ternaryThemeColor}
              status={checked === false ? "checked" : "unchecked"}
              onPress={() => setChecked(false)}
            />
            <PoppinsTextMedium
              style={{ color: "#171717", fontSize: 12, fontWeight: "700" }}
              content="No"
            ></PoppinsTextMedium>
          </View>
          </View>
        </View>}
        {checked == true && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 20,
            }}
          >
            {
              checked &&
              kycOption1.map((item,index)=>{
                if(item == "gstin")
                {
                  return(
                    <GSTINVerificationComp key = {`Option1${index}`} required = {true} verify= {true} showDetails={true} gstinData={gstinData} ></GSTINVerificationComp>
                  )
                }
                else if(item == "aadhar")
                {
                  return(
                    <AADHAARVerificationComp key = {`Option1${index}`} required = {true} verify= {true} showDetails={true} aadharData={aadharData}></AADHAARVerificationComp>
                  )
                }
                else if(item == "pan")
                {
                  return(
                    <PanVerificationComp key = {`Option1${index}`} required = {true} verify= {true} showDetails={true} panData={panData}></PanVerificationComp>

                  )
                }
              })
            }
            


              <View style={{ marginTop: 20 }}>
                <CameraInputWithUpload
                  theme = "new"
                  image = {imageData}
                  name={"shop image"}
                  title={"Shop Image"}
                  jsonData={{
                    name: "shop image",
                    required: true,
                    title: "Shop Image",
                  }}
                  handleData={getShowImage}
                ></CameraInputWithUpload>
              </View>
            
            
              <TouchableOpacity
                onPress={() => {
                  handleGstinSubmission();
                }}
                style={{
                  height: 40,
                  width: 140,
                  backgroundColor: ternaryThemeColor,
                  borderRadius: 10,
                  marginTop: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom:20
                }}
              >
                <PoppinsTextMedium
                  style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                  content="Submit"
                ></PoppinsTextMedium>
              </TouchableOpacity>
            
          </View>
        )}
        {checked === false && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 0,
            }}
          >
           {
              kycOption2.map((item,index)=>{
                console.log("Option 2",item)
                if(item === "gstin")
                {
                  return(
                    <GSTINVerificationComp key = {`Option2${index}`} required = {true} verify= {true} showDetails={true} gstinData={gstinData} ></GSTINVerificationComp>
                  )
                }
                 if(item === "aadhar")
                {
                  return(
                    <AADHAARVerificationComp key = {`Option2${index}`} required = {true} verify= {true} showDetails={true} aadharData={aadharData}></AADHAARVerificationComp>
                  )
                }
                 if(item === "pan")
                {
                  return(
                    <PanVerificationComp key = {`Option2${index}`} required = {true} verify= {true} showDetails={true} panData={panData}></PanVerificationComp>

                  )
                }
              })
            }
              <View style={{ marginTop: 20 }}>
                <CameraInputWithUpload
                theme ="new"
                  image = {imageData}
                  name={"shop image"}
                  title={"Shop Image"}
                  jsonData={{
                    name: "shop image",
                    required: true,
                    title: "Shop Image",
                  }}
                  handleData={getShowImage}
                ></CameraInputWithUpload>
              </View>
           
           
              <TouchableOpacity
                onPress={() => {
                  handleGstinSubmission();
                }}
                style={{
                  height: 40,
                  width: 140,
                  backgroundColor: ternaryThemeColor,
                  borderRadius: 10,
                  marginTop: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PoppinsTextMedium
                  style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                  content="Submit"
                ></PoppinsTextMedium>
              </TouchableOpacity>
            
          </View>
        )}
        {openModalWithBorder &&
          <ModalWithBorder
            modalClose={modalWithBorderClose}
            message={message}
            openModal={openModalWithBorder}
            comp={ModalContent}>
          </ModalWithBorder>}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default CheckKycOptions;
