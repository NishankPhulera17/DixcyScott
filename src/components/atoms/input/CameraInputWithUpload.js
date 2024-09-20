import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View,ActivityIndicator,PermissionsAndroid } from "react-native";
import { Camera, useCameraPermission,useCameraDevice } from "react-native-vision-camera";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import CameraCapture from "../../../screens/camera/CameraCapture";
import { useNavigation } from "@react-navigation/native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useUploadSingleFileMutation } from "../../../apiServices/imageApi/imageApi";
import * as Keychain from "react-native-keychain";
import CameraIcon from 'react-native-vector-icons/Entypo'

const CameraInputWithUpload = (props) => {
  const [openCamera, setOpenCamera] = useState(false);
  const [showButton, setShowButton] = useState(false)
  const [capturePressed, setCapturePressed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

  const navigation = useNavigation();
  const title = props.title
  const theme = props.theme
  const jsonData = props.jsonData
  const image = props.image
    console.log("Image was already saved", image,theme)
  const [
    uploadImageFunc,
    {
      data: uploadImageData,
      error: uploadImageError,
      isLoading: uploadImageIsLoading,
      isError: uploadImageIsError,
    },
  ] = useUploadSingleFileMutation();

  useEffect(() => {
    console.log("hasPermission", hasPermission);
    let timeoutID;
    if(!hasPermission)
    {
        requestPermission()
        
    }
    else{
       timeoutID = setTimeout(() => {
      setShowButton(true)
        
      }, 1000);
    }


    return (()=>{
      clearTimeout(timeoutID)
    })
  }, [hasPermission]);

  useEffect(() => {
    if (uploadImageData) {
      console.log("uploadImageData",uploadImageData);
      if (uploadImageData.success) {
        setLoading(true)
        let data = {...props.jsonData, value:uploadImageData?.body?.fileLink}
        props.handleData(data)
      }
    } else if(uploadImageError) {
      console.log("uploadImageError",uploadImageError);
    }
  }, [uploadImageData, uploadImageError]);


const captureImage=async()=>{
  try{
  
const result = await launchCamera({quality:0.9})
console.log("launchCameraOutput",result)
const imageData = {
    uri: result.assets[0]?.uri,
    name: result.assets[0]?.fileName,
    type: result.assets[0]?.type,
  };
  const uploadFile = new FormData();
  uploadFile.append("image", imageData);

  const getToken = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    console.log("uploadImageFunc",JSON.stringify(uploadFile))
    setLoading(false)
    uploadImageFunc({ body: uploadFile});
  };

  getToken();
  
}
  catch(e)
  {
    console.log("Exception in Image libray",e)
  }

// console.log("captureImage",photo)
}

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
    {theme!="new" && <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'700'}} content ={`${title} ${jsonData.required ? "*" : ""}`}></PoppinsTextMedium>}
    {/* {loading  && <ActivityIndicator size={40} color={ternaryThemeColor}></ActivityIndicator>} */}
    {image && <Image loadingIndicatorSource={{uri:"https://picsum.photos/200"}} style={{height:200,width:300,resizeMode:'contain',marginTop:20}} source={{uri:image?.fileLink}}></Image>}
    {uploadImageData && <Image style={{height:260,width:340,resizeMode:'contain',marginTop:20}} source={{uri:uploadImageData?.body?.fileLink}}></Image>}
   {!showButton && <ActivityIndicator size={40} color={ternaryThemeColor}></ActivityIndicator>}
   {showButton && theme !== "new" && <TouchableOpacity onPress={async()=>{
      //   setCapturePressed(true)
      //  setTimeout(() => {
      //   captureImage()
      //   setCapturePressed(false)
      //  }, 2000);
      
       navigation.navigate("CameraCapture")
    }} style={{height:40,width:100,alignItems:'center',justifyContent:'center',borderRadius:10,backgroundColor:capturePressed ? "#DDDDDD":ternaryThemeColor,marginTop:10}}>
        <PoppinsTextMedium content={(uploadImageData || image) ? "Recapture":"Capture"} style={{color:'white', fontSize:18}}></PoppinsTextMedium>
    </TouchableOpacity>}
    {showButton && theme == "new"  && <TouchableOpacity style={{marginTop:20,borderWidth:1,borderStyle:'dashed',height:60,alignItems:"center",justifyContent:'center',flexDirection:'row',borderRadius:10,width:'100%',padding:10}} onPress={async()=>{
      //   setCapturePressed(true)
      //  setTimeout(() => {
      //   captureImage()
      //   setCapturePressed(false)
      //  }, 2000);
      
       navigation.navigate("CameraCapture")
    }} >
      <CameraIcon name="camera" size={30} color={"black"}></CameraIcon>
      <PoppinsTextMedium content={"Click Your Shop Picture"} style={{color:'black', fontSize:16,marginLeft:10}}></PoppinsTextMedium>

    </TouchableOpacity>}
    
    </View>
  );
};

const styles = StyleSheet.create({});

export default CameraInputWithUpload;
