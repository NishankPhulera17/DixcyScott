import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BaseUrl } from '../../utils/BaseUrl';
import LinearGradient from 'react-native-linear-gradient';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import CustomTextInput from '../../components/organisms/CustomTextInput';
import CustomTextInputNumeric from '../../components/organisms/CustomTextInputNumeric';
import ButtonNavigateArrow from '../../components/atoms/buttons/ButtonNavigateArrow';
import { useGetLoginOtpMutation } from '../../apiServices/login/otpBased/SendOtpApi';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import ErrorModal from '../../components/modals/ErrorModal';
import { useGetNameMutation } from '../../apiServices/login/GetNameByMobile';
import TextInputRectangularWithPlaceholder from '../../components/atoms/input/TextInputRectangularWithPlaceholder';
import { useIsFocused } from '@react-navigation/native';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import Checkbox from '../../components/atoms/checkbox/Checkbox';
import * as Keychain from 'react-native-keychain';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import AlertModal from '../../components/modals/AlertModal';
import crashlytics from '@react-native-firebase/crashlytics';
import LeftIcon from 'react-native-vector-icons/AntDesign'
import { useFetchLegalsMutation } from '../../apiServices/fetchLegal/FetchLegalApi';
const OtpLogin = ({ navigation, route }) => {
  const [mobile, setMobile] = useState("")
  const [name, setName] = useState("")
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState()
  const [error, setError] = useState(false)
  const [isChecked, setIsChecked] = useState(false);
  const [hideButton, setHideButton] = useState(false)
  const [alert, setAlert] = useState(false)
  const {t} = useTranslation()
  // fetching theme for the screen-----------------------

  const primaryThemeColor = useSelector(
    state => state.apptheme.primaryThemeColor,
  )
    
  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
   
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
   

  const buttonThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
   
  const icon = useSelector(state => state.apptheme.icon1)


  // ------------------------------------------------
  const focused = useIsFocused()
  // send otp for login--------------------------------
  const [sendOtpFunc, {
    data: sendOtpData,
    error: sendOtpError,
    isLoading: sendOtpIsLoading,
    isError: sendOtpIsError
  }] = useGetLoginOtpMutation()

  const [getTermsAndCondition, {
    data: getTermsData,
    error: getTermsError,
    isLoading: termsLoading,
    isError: termsIsError
  }] = useFetchLegalsMutation()



  const [
    getNameFunc,
    {
      data: getNameData,
      error: getNameError,
      isLoading: getLoading,
      isError: getIsError
    }
  ] = useGetNameMutation()

  const needsApproval = route?.params?.needsApproval;
  const user_type_id = route?.params?.userId;
  const user_type = route?.params?.userType;
  const registrationRequired = route?.params?.registrationRequired 
  console.log("registrationRequiredotpLogin", registrationRequired)
  const width = Dimensions.get('window').width;
  const navigationParams = { "needsApproval": needsApproval, "user_type_id": user_type_id, "user_type": user_type, "mobile": mobile, "name": name }
  console.log("navigationParams",navigationParams)
  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loader.gif")
  ).uri;
  useEffect(() => {
    fetchTerms();
    setHideButton(false)
  }, [focused])

  useEffect(() => {
    if (getTermsData) {
      console.log("getTermsData", getTermsData?.body?.data?.[0]?.files[0]);
    }
    else if (getTermsError) {
      console.log("gettermserror", getTermsError)
    }
  }, [getTermsData, getTermsError])



  useEffect(() => {
    if (sendOtpData) {
      console.log("sendOtpData", sendOtpData)
      if (sendOtpData?.success === true && mobile.length === 10) {
        if(Object.keys(getNameData.body).length!=0)
        {
        const nameData = getNameData?.body
        navigation.navigate('VerifyOtp', {navigationParams,kycData:nameData })

        }
      }
      else {
        console.log("Trying to open error modal")
      }
      setHideButton(false)
    }
    else if (sendOtpError) {
      console.log("err", sendOtpError)

      if(sendOtpError.status == 400)
      setAlert(true)
      else
      setError(true)

      setHideButton(false)
      setMessage(sendOtpError?.data?.message)
    }



  }, [sendOtpData, sendOtpError])

  useEffect(() => {
    if (getNameData) {
      console.log("getNameData", getNameData)
      if (getNameData?.success) {
        setMobile(getNameData?.body.mobile)
      }
    }
    else if (getNameError) {
      console.log("getNameError", getNameError)

    }
  }, [getNameData, getNameError])

  useEffect(() => {
    console.log("Name in use effect--------->>>>>>>>>>>>>>>",name)
  }, [name])

  const getUid = data => {
    console.log("UID DATA",data)
    setName(data)
    // const reg = '^([0|+[0-9]{1,5})?([6-9][0-9]{9})$';
    // const mobReg = new RegExp(reg)
    
    //   setMobile(data)
    //   if (data !== undefined) {
    //     if (data.length === 10) {
    //       if(mobReg.test(data))
    //     {
          // getNameFunc({ mobile: data })
          if(data.length===6)
          getNameFunc({ uid: data })

      //     Keyboard.dismiss();
      //   }
      //   else{
      //     setError(true)
      //     setMessage("Please enter a valid mobile number")
      //   }
      // }
    // }
    
    

  };

  const fetchTerms = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      type: "term-and-condition"
    }
    getTermsAndCondition(params)
  }




  const getMobile = data => {
    console.log("Data getting function", data)
    if (data !== undefined) {
        const reg = '^([0|+[0-9]{1,5})?([6-9][0-9]{9})$';
    const mobReg = new RegExp(reg)
    
      setMobile(data)
      if (data !== undefined) {
        if (data.length === 10) {
          if(mobReg.test(data))
        {
        setMobile(data)
        }
        else{
        Alert.alert("Kindly enter a valid UID ")
        setMobile("")
        }
      }
    }
      
    
    }
  };

  const getCheckBoxData = (data) => {
    setIsChecked(data)
    console.log("Checkbox data", data)
  }

  const navigateToOtp = () => {
    sendOtpFunc({ mobile, name, user_type, user_type_id })
    setHideButton(true)
    // navigation.navigate('VerifyOtp',{navigationParams})
  }
  const handleButtonPress = () => {
   
    if (isChecked) {
      console.log("handleButtonPress",getNameData,isChecked,name,mobile)
      if (getNameData && isChecked && name !== undefined && mobile !== undefined && name != "" && mobile.length !== 0 && name.length !== 0) {
        // console.log("mobile",mobile,name.length)
        if (getNameData.message === "Not Found") {
          console.log("registrationRequired", registrationRequired)
          if (mobile?.length == 10) {
            if(registrationRequired){
              setMobile('')
              setName('')
              navigation.navigate('BasicInfo', { needsApproval: needsApproval, userType: user_type, userId: user_type_id, name: name, mobile: mobile, navigatingFrom: "OtpLogin",registrationRequired:registrationRequired })
            }
            else{
              navigateToOtp()
            }
            
          }
          else {
            setError(true)
            setMessage("Please enter your 6 digit UID")
          }
          // setName('')
          // setMobile('')
        }
        else {
          sendOtpFunc({ mobile, name, user_type, user_type_id })
          // navigation.navigate('VerifyOtp',{navigationParams})
        }

      }

      else {
        if (mobile?.length != 10) {
          setError(true)
          setMessage("Please enter your 10 digit mobile number")
        }

        else if (name == undefined || name == "") {

          setError(true)
          setMessage("Please enter name")
        }
      }
    }
    else{
      setError(true)
      setMessage("Please Accept Terms and condition")
    }

  }

  const modalClose = () => {
    setError(false)
    setAlert(false)
  }
  return (
    <LinearGradient
      colors={["white", "white"]}
      style={styles.container}>


      <View style={{
        width: '100%', alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ternaryThemeColor,
      }}>
        <View
          style={{
            height: 120,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: ternaryThemeColor,
            flexDirection: 'row',
          }}>

          <TouchableOpacity
            style={{ height: 50, alignItems: "center", justifyContent: 'center', position: "absolute", left: 10, top: 20 }}
            onPress={() => {
              navigation.goBack();
            }}>
            {/* <Image
              style={{ height: 20, width: 20, resizeMode: 'contain' }}
              source={require('../../../assets/images/blackBack.png')}></Image> */}
              <LeftIcon name="arrowleft" size={24} color={"white"}></LeftIcon>
          </TouchableOpacity>
          <Image
            style={{
              height: 50,
              width: 100,
              resizeMode: 'contain',
              top: 20,
              position: "absolute",
              left: 50,



            }}
            source={{uri:icon}}></Image>
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 10,
            width: '90%'
          }}>
          <PoppinsText
            style={{ color: 'white', fontSize: 28 }}
            content={t("Tell us your identity")}></PoppinsText>

        </View>
      </View>

      {error && <ErrorModal modalClose={modalClose} message={message} openModal={error}></ErrorModal>}
        {alert && <AlertModal modalClose={modalClose} message={message} openModal={alert}></AlertModal>}
      <ScrollView contentContainerStyle={{ flex: 1 }} style={{ width: '100%' }}>
        <KeyboardAvoidingView>


          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 40,
            }}>
            <TextInputRectangularWithPlaceholder
              placeHolder={t("UID")}
              handleData={getUid}
              value = {name}
            ></TextInputRectangularWithPlaceholder>

            <TextInputRectangularWithPlaceholder
              placeHolder={t("mobile")}
              handleData={getMobile}
              value={mobile}
              maxLength = {10}
              keyboardType = "numeric"
            ></TextInputRectangularWithPlaceholder>
          </View>
        </KeyboardAvoidingView>

        <View
          style={{
            width: '100%',
            // marginTop: 20,
            marginBottom: 30,
            marginLeft: 10
          }}>
          <View style={{ flexDirection: 'row', marginHorizontal: 24, }}>
            <Checkbox CheckBoxData={getCheckBoxData} />
            <TouchableOpacity onPress={() => {
              navigation.navigate('PdfComponent', { pdf: getTermsData?.body?.data?.[0]?.files[0] })
            }}>
              <PoppinsTextLeftMedium content={t("terms and condition")} style={{ color: '#808080', marginHorizontal: 30, marginBottom: 20, fontSize: 15, marginLeft: 8, marginTop: 16 }}></PoppinsTextLeftMedium>
            </TouchableOpacity>
          </View>


        
            <ButtonNavigateArrow
            success={success}
            handleOperation={handleButtonPress}
            backgroundColor={buttonThemeColor}
            style={{ color: 'white', fontSize: 16 }}
            isLoading={sendOtpIsLoading}
            content={t("Agree & Continue")}
            navigateTo="VerifyOtp"
            navigationParams={navigationParams}
            mobileLength={mobile}
            isChecked={isChecked && mobile?.length == 10 && name != "" && !hideButton}
          ></ButtonNavigateArrow>
          

      {
        sendOtpIsLoading && <FastImage
          style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 10 }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      }
        </View>
       


        {/* {registrationRequired && <View style={{width:"100%",alignItems:'center',justifyContent:"center",marginTop:20}}>
        <PoppinsTextMedium style={{fontSize:18}} content ="Don't have an account ?"></PoppinsTextMedium>
        <ButtonNavigate
              handleOperation={handleNavigationToRegister}
              backgroundColor={buttonThemeColor}
              style={{color: 'white', fontSize: 16}}
              content="Register"
              >
        </ButtonNavigate>

        </View>} */}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  semicircle: {

    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  banner: {
    height: 184,
    width: '90%',
    borderRadius: 10,
  },
  userListContainer: {
    width: '100%',
    height: 600,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default OtpLogin;