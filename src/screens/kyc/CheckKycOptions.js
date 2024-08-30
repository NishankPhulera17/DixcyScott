import React, { useEffect, useState } from 'react';
import { StyleSheet, View,Image, TextInput, KeyboardAvoidingView,ScrollView,Keyboard, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { RadioButton } from 'react-native-paper';
import TextInputGST from '../../components/atoms/input/TextInputGST';
import Check from 'react-native-vector-icons/AntDesign'
import Cross from 'react-native-vector-icons/Entypo'
import { useVerifyGstMutation } from '../../apiServices/verification/GstinVerificationApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useVerifyPanMutation } from '../../apiServices/verification/PanVerificationApi';
import CameraInputWithUpload from '../../components/atoms/input/CameraInputWithUpload';
import { useSendAadharOtpMutation, useVerifyAadharMutation } from '../../apiServices/verification/AadharVerificationApi';
const CheckKycOptions = () => {
    const [checked, setChecked] = React.useState();
    const [gstin, setGstin] = useState()
    const [message, setMessage] = useState()
    const [pan, setPan] = useState()
    const [value,setValue] = useState()
    const [otp, setOtp] = useState()
    const [otpSent, setOtpSent] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [aadhar, setAadhar] = useState()
    const [marg, setMarg] = useState(0)
    const [gotGstinImage, setGotGstinImage] = useState(false)
    const [panVerified, setPanVerified] = useState()
    const [aadharVerified, setAadharVerified] = useState()
    const [gstinVerified, setGstinVerified] = useState()
    const icon = useSelector(state => state.apptheme.icon)
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )

      const [sendAadharOtpFunc,{
        data:sendAadharOtpData,
        error:sendAadharOtpError,
        isLoading:sendAadharOtpIsLoading,
        isError:sendAadharOtpIsError
      }]= useSendAadharOtpMutation()

      const [verifyAadharFunc,{
        data:verifyAadharData,
        error:verifyAadharError,
        isLoading:verifyAadharIsLoading,
        isError:verifyAadharIsError
      }]= useVerifyAadharMutation()

      const [verifyPanFunc, {
        data: verifyPanData,
        error: verifyPanError,
        isLoading: verifyPanIsLoading,
        isError: verifyPanIsError
      }] = useVerifyPanMutation()

      const [verifyGstFunc,{
        data:verifyGstData,
        error:verifyGstError,
        isLoading:verifyGstIsLoading,
        isError:verifyGstIsError
      }]= useVerifyGstMutation()

      useEffect(()=>{
        if(sendAadharOtpData)
        {
        console.log("sendAadharOtpData",sendAadharOtpData)
        // setRefId(sendAadharOtpData.body.ref_id)
        if(sendAadharOtpData.success)
        {
          console.log("success")
          setOtpSent(true)
          setShowOtp(true)
          setShowLoading(false)
          props.notVerified(false)
        }
        }
        else if(sendAadharOtpError)
        {
          props.notVerified(false)
        console.log("sendAadharOtpError",sendAadharOtpError)
          setShowLoading(false)
          setAadharExists(true)
        
        }
        
        },[sendAadharOtpData,sendAadharOtpError])

        useEffect(()=>{
          if(verifyAadharData)
          {
            console.log("verifyAadharData",verifyAadharData)
            if(verifyAadharData.success)
            {
            setModalVisible(true)
            setShowLoading(false)
            setAadharVerified(true)
            props.notVerified(true)
            }
          }
          else if(verifyAadharError){
            console.log("verifyAadharError",verifyAadharError)
            props.notVerified(false)
            setShowLoading(false)

          }
          },[verifyAadharError,verifyAadharData])

      useEffect(() => {
        if (verifyPanData) {
          console.log("verifyPanData", verifyPanData)
          if (verifyPanData.success) {
           
            setPanVerified(true)
          }
        }
        else if (verifyPanError) {
          console.log("verifyPanError", verifyPanError)
        
          setPanVerified(false)
        }
      }, [verifyPanData, verifyPanError])

      useEffect(()=>{
        if(verifyGstData)
        {
        console.log("verifyGstData",JSON.stringify(verifyGstData))
        if(verifyGstData.success)
        {
        setGstinVerified(true)
        }
        }
        else if(verifyGstError)
        {
            if(verifyGstError.status == 409)
            {
              setMessage(verifyGstError.data.message)
            }

            if(verifyGstError.status == 500)
            {
              setMessage(verifyGstError.data.Error.message)
            }

            setGstinVerified(false)
        console.log("verifyGstError",verifyGstError)
        }
        },[verifyGstData,verifyGstError])


        useEffect(()=>{
            setGstin()
            setGstinVerified()
        },[checked])

        useEffect(() => {
            if (pan) {
              if (pan.length === 10) {
                const data = {
                  "pan": pan
                }
                verifyPanFunc(data)
              }
            }
          }, [pan])

      useEffect(()=>{
        if(gstin)
        if(gstin.length===15)
        {
            const data = {
                "gstin":gstin,
        
            }
            verifyGstFunc(data)
        }
      },[gstin])

      const getGstinImage=(data)=>{
        console.log("GSTIN IMAGE UPLOADED",data)
        setGotGstinImage(true)
      }

      const handleGstinSubmission=()=>{

      }

    Keyboard.addListener('keyboardDidShow',()=>{
        console.log("keyboard open")
        setMarg(20)
    })
    Keyboard.addListener('keyboardDidHide',()=>{
        console.log("keyboard closed")
        setMarg(0)

    })
    
    return (
        <View style={{alignItems:'center',justifyContent:'flex-start',backgroundColor:'white',height:'100%',width:'100%'}}>
            <View style={{width:'100%',alignItems:'flex-start',justifyContent:'flex-start',backgroundColor:ternaryThemeColor}}>
                <Image style={{height:80,width:80,resizeMode:'contain',marginLeft:20}} source={{uri:icon}}></Image>
                <View style={{alignItems:'flex-start',justifyContent:'flex-start',marginLeft:20,marginTop:10,marginBottom:10}}>
                <PoppinsTextMedium style={{color:"white",fontSize:29,fontWeight:'600'}} content="Complete Your"></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:"white",fontSize:29,fontWeight:'600'}} content="Registration"></PoppinsTextMedium>
                </View>
            </View>
            <ScrollView style={{width:'100%',flex:1}} contentContainerStyle={{alignItems:'flex-start'}}>
                <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:20,marginLeft:20}}>
                <PoppinsTextMedium style={{color:"black",fontSize:16,fontWeight:'400',marginLeft:20,marginRight:10}} content="Do you have GST?"></PoppinsTextMedium>
                
                <View style={{alignItems:'center',justifyContent:'center',height:40,width:74,borderRadius:18,borderWidth:1,borderColor:'#171717',flexDirection:'row'}}>
                <RadioButton
                value="yes"
                color={ternaryThemeColor}
                status={ checked === true ? 'checked' : 'unchecked' }
                onPress={() => setChecked(true)}
                />
                <PoppinsTextMedium style={{color:"black",fontSize:14,fontWeight:'500'}} content="Yes"></PoppinsTextMedium>
                
                </View>
                <View style={{alignItems:'center',justifyContent:'center',height:40,width:74,borderRadius:18,borderWidth:1,borderColor:'#171717',flexDirection:'row',marginLeft:10}}>
                <RadioButton
                value="no"
                color={ternaryThemeColor}
                status={ checked === false ? 'checked' : 'unchecked' }
                onPress={() => setChecked(false)}
                />
                <PoppinsTextMedium style={{color:"black",fontSize:14,fontWeight:'500'}} content="No"></PoppinsTextMedium>
                
                </View>
            </View>
            {checked == true && <View style={{alignItems:'center',justifyContent:'center',width:'100%',marginTop:20}}>
                <View style={{alignItems:'flex-start',justifyContent:'flex-start',height:60,width:'80%',borderWidth:1,borderColor:"#DDDDDD",flexDirection:'row'}}>
                <View style={{padding:4,backgroundColor:'white',position:"absolute",top:-16,left:16}}>
                <PoppinsTextMedium style={{color:"#919191",fontSize:15,fontWeight:'500'}} content="Enter GST Number"></PoppinsTextMedium>
                </View>
                <TextInput maxLength={15} onChangeText={(text)=>{
                    setGstin(text)
                }} style={{alignItems:"center",justifyContent:'center',width:'80%',color:'#171717',letterSpacing:2,marginLeft:14,height:'100%'}}></TextInput>
                <View style={{alignItems:"center",justifyContent:'center',height:'100%'}}>
                { gstinVerified == true && <Check name="checkcircle" size={30} color={ternaryThemeColor}></Check>}
                { gstinVerified == false && <Cross name="circle-with-cross" size={30} color={ternaryThemeColor}></Cross>}
                </View>
               

                </View>
                {verifyGstData && <View style={{alignItems:'flex-start',justifyContent:'flex-start',width:'84%',borderWidth:1,borderStyle:'dotted',backgroundColor:"#F1F8FA",borderColor:'#DDDDDD',marginTop:20,borderRadius:20,paddingTop:10,paddingBottom:10}}>
                <PoppinsTextMedium style={{color:"#171717",fontSize:16,fontWeight:'500',marginLeft:10,marginTop:10}} content={`Name : ${verifyGstData?.body?.legal_name_of_business}`}></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:"#171717",fontSize:16,fontWeight:'500',marginLeft:10,marginTop:10,textAlign:'left'}} content={`Address : ${verifyGstData?.body?.principal_place_address}`}></PoppinsTextMedium>
                </View>}
                {
                    gstinVerified == false && 
                    <View style={{alignItems:"flex-start",justifyContent: 'flex-start'}}>
                <PoppinsTextMedium style={{color:"red",fontSize:16,fontWeight:'500',marginLeft:10,marginTop:10}} content={message}></PoppinsTextMedium>
                    </View>

                }
                { gstinVerified &&
                <View style={{marginTop:20}}>
                    <CameraInputWithUpload
                    name = {"Gstin Image"}
                    title={"GSTIN Image"}
                    jsonData={{name:"Gstin Image", required:true, title:"GSTIN Image"}}
                    handleData={getGstinImage}
                ></CameraInputWithUpload>
                </View>
                }
                {gotGstinImage && <TouchableOpacity onPress={()=>{
                    handleGstinSubmission()
                }} style={{height:40,width:100,backgroundColor:ternaryThemeColor,borderRadius:10,marginTop:20,alignItems:"center",justifyContent:"center"}}>
                <PoppinsTextMedium style={{color:"white",fontSize:16,fontWeight:'600'}} content="Submit"></PoppinsTextMedium>
                    
                    </TouchableOpacity>}
            </View> }
            {checked===false && <View style={{alignItems:'center',justifyContent:'center',width:'100%',marginTop:20}}>
            <View style={{alignItems:'flex-start',justifyContent:'flex-start',height:60,width:'80%',borderWidth:1,borderColor:"#DDDDDD",flexDirection:'row'}}>
                <View style={{padding:4,backgroundColor:'white',position:"absolute",top:-16,left:16}}>
                <PoppinsTextMedium style={{color:"#919191",fontSize:15,fontWeight:'500'}} content="Enter PAN Number"></PoppinsTextMedium>
                </View>
                <TextInput maxLength={15} onChangeText={(text)=>{
                    setPan(text)
                }} style={{alignItems:"center",justifyContent:'center',width:'80%',color:'#171717',letterSpacing:2,marginLeft:14,height:'100%'}}></TextInput>
                <View style={{alignItems:"center",justifyContent:'center',height:'100%'}}>
                { panVerified == true && <Check name="checkcircle" size={30} color={ternaryThemeColor}></Check>}
                { panVerified == false && <Cross name="circle-with-cross" size={30} color={ternaryThemeColor}></Cross>}
                </View>
                {verifyPanData && <View style={{alignItems:'flex-start',justifyContent:'flex-start',width:'84%',borderWidth:1,borderStyle:'dotted',backgroundColor:"#F1F8FA",borderColor:'#DDDDDD',marginTop:20,borderRadius:20,paddingTop:10,paddingBottom:10}}>
                <PoppinsTextMedium style={{color:"#171717",fontSize:16,fontWeight:'500',marginLeft:10,marginTop:10}} content={`Name : ${verifyPanData?.body?.registered_name}`}></PoppinsTextMedium>
                <PoppinsTextMedium style={{color:"#171717",fontSize:16,fontWeight:'500',marginLeft:10,marginTop:10,textAlign:'left'}} content={`Father Name : ${verifyPanData?.body?.father_name}`}></PoppinsTextMedium>
                </View>}

                </View>
                <View style={{alignItems:'flex-start',justifyContent:'flex-start',height:60,width:'80%',borderWidth:1,borderColor:"#DDDDDD",flexDirection:'row',marginTop:40}}>
                <View style={{padding:4,backgroundColor:'white',position:"absolute",top:-16,left:16}}>
                <PoppinsTextMedium style={{color:"#919191",fontSize:15,fontWeight:'500'}} content="Enter Aadhar Number"></PoppinsTextMedium>
                </View>
                <TextInput maxLength={15} onChangeText={(text)=>{
                    setAadhar(text)
                }} style={{alignItems:"center",justifyContent:'center',width:'80%',color:'#171717',letterSpacing:2,marginLeft:14,height:'100%'}}></TextInput>
                <View style={{alignItems:"center",justifyContent:'center',height:'100%'}}>
                { aadharVerified == true && <Check name="checkcircle" size={30} color={ternaryThemeColor}></Check>}
                { aadharVerified == false && <Cross name="circle-with-cross" size={30} color={ternaryThemeColor}></Cross>}
                </View>
               

                </View>
            </View>}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({})

export default CheckKycOptions;
