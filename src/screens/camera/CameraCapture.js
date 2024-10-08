import React,{useRef,useState,useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity,Image, ActivityIndicator } from 'react-native';
import { Camera, useCameraPermission,useCameraDevice } from "react-native-vision-camera";
import CameraIcon from 'react-native-vector-icons/Entypo'
import CameraRotate from 'react-native-vector-icons/FontAwesome6'
import Flash from 'react-native-vector-icons/Entypo'
import { useSelector } from 'react-redux';
import { useUploadSingleFileMutation } from '../../apiServices/imageApi/imageApi';
import * as Keychain from "react-native-keychain";


const CameraCapture = ({navigation}) => {
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [cameraType, setCameraType] = useState("back")
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState()
  const device = useCameraDevice(cameraType);
  const camera = useRef(null)
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
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
        if (uploadImageData) {
          console.log("uploadImageData",uploadImageData);
          if (uploadImageData.success) {
            setLoading(false)
            navigation.navigate("CheckKycOptions",{imageData:uploadImageData.body})
            
          }
        } else if(uploadImageError) {
          console.log("uploadImageError",uploadImageError);
          setLoading(false)

        }
      }, [uploadImageData, uploadImageError]);

      const uploadImageToCloud=(uploadFile)=>{
        const getToken = async () => {
          const credentials = await Keychain.getGenericPassword();
          const token = credentials.username;
          console.log("uploadImageFunc",JSON.stringify(uploadFile))
          setLoading(true)
          uploadImageFunc({ body: uploadFile,token:token });
        };
        getToken()
      }

const captureImage=async()=>{
    const photo = await camera.current.takePhoto({flash:flashEnabled})
    console.log("photodata", photo)
    setImage("file:///"+photo.path)
    const imageData = {
        uri: "file:///"+photo.path,
        name: 'Shopname',
        type: 'image/png',
      };
      const uploadFile = new FormData();
      uploadFile.append("image", imageData);
      uploadImageToCloud(uploadFile)
      

    console.log("captureImage",photo)
}
    return (
        <View style={{flex:1}}>
        <Camera
        ref={camera}
        photo={true}
        style={{flex:0.92}}
        device={device}
        
        isActive={true}
      />
      {loading &&
      <View style={{backgroundColor:"#333333",width:'100%',alignItems:'center',justifyContent:"center",flex:0.1}}>
       <ActivityIndicator size={40} color={ternaryThemeColor}></ActivityIndicator>
      </View>
       }
      {!loading && <View style={{flex:0.1,backgroundColor:"#333333", width:'100%',alignItems:'center',justifyContent:'space-evenly',flexDirection:'row'}}>
      
      <TouchableOpacity onPress={()=>{
        setFlashEnabled(!flashEnabled)
      }} style={{marginRight:40}}>
        <Flash name="flashlight" size={30} color={flashEnabled ? ternaryThemeColor : "white"}></Flash>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{captureImage()}}>
        <CameraIcon name="camera" size={40} color={ternaryThemeColor}></CameraIcon>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{
            if(cameraType == "back")
            {
                setCameraType("front")
            }
            else{
                setCameraType("back")
            }
        }} style={{marginLeft:40}}>
        <CameraRotate name="camera-rotate" size={30} color={"white"}></CameraRotate>
        </TouchableOpacity>
      </View>}
        </View>
       
    );
}

const styles = StyleSheet.create({})

export default CameraCapture;
