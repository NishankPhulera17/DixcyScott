import React,{useEffect,useState} from 'react';
import {View,Text,Platform, TouchableOpacity} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/dashboard/Dashboard';
import Gift from 'react-native-vector-icons/AntDesign'
import Qrcode from 'react-native-vector-icons/AntDesign'
import Book from 'react-native-vector-icons/AntDesign'
import {useSelector, useDispatch} from 'react-redux';
import Wave from '../../assets/svg/bottomDrawer.svg'
import PoppinsTextMedium from '../components/electrons/customFonts/PoppinsTextMedium';
import BookOpen from 'react-native-vector-icons/Entypo' 
import { useTranslation } from 'react-i18next';
import FlipAnimation from '../components/animations/FlipAnimation';

const Tab = createBottomTabNavigator();

//custom bottom drawer 



function BottomNavigator({navigation}) {
const [requiresLocation, setRequiresLocation] = useState(false)
const {t} = useTranslation()

  const locationSetup = useSelector(state=>state.appusers.locationSetup)
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const userData = useSelector(state => state.appusersdata.userData)
  const workflow = useSelector(state => state.appWorkflow.program)

    const platformFontWeight = Platform.OS==="ios" ? "400":"800"
    console.log("workflow",workflow,userData)

    useEffect(()=>{
      if(locationSetup)
      {
        if(Object.keys(locationSetup)?.length != 0)
        {
          setRequiresLocation(true)
        }
      }
      
    },[locationSetup])

  return (
    <Tab.Navigator tabBar={()=><View style={{alignItems:"center",justifyContent:"center",width:"100%",backgroundColor:"#F7F7F7"}}>
      <Wave style={{top:10}} width={100}></Wave>
    <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row",height:60,backgroundColor:"white",width:'100%'}}>
    <TouchableOpacity onPress={()=>{navigation.navigate('GiftCatalogue')}} style={{alignItems:"center",position:'absolute', left:80}}>
    <FlipAnimation direction="horizontal" duration={1400} comp={()=>{
      return(
    <Gift name="gift" size={24} color={ternaryThemeColor}></Gift>
    )
  }} />
    <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content={t("Gift Catalogue")}></PoppinsTextMedium>
    </TouchableOpacity>
    {/* ozone change */}
    {/* { ((userData?.user_type).toLowerCase()!=="dealer"  && (userData?.user_type).toLowerCase()!=="sales") ? <TouchableOpacity onPress={()=>{Platform.OS == 'android' ? navigation.navigate('EnableCameraScreen') : requiresLocation ? navigation.navigate('EnableLocationScreen',{navigateTo:"QrCodeScanner"}) : navigation.navigate("QrCodeScanner")
}} style={{alignItems:"center",justifyContent:"center",}}>
    <FlipAnimation direction="horizontal" duration={1400} comp={()=>{
      return(
        <Qrcode name="qrcode" size={24} color={ternaryThemeColor}></Qrcode> 

      )
    }} />
    <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content={t("Scan QR")}></PoppinsTextMedium>
    </TouchableOpacity>
    :
    workflow?.includes("Genuinity") && <TouchableOpacity onPress={()=>{navigation.navigate('ScanAndRedirectToGenuinity')}} style={{alignItems:"center",justifyContent:"center",}}>
    <FlipAnimation direction="horizontal" duration={1400} comp={()=>{
      return(
        <Qrcode name="qrcode" size={24} color={ternaryThemeColor}></Qrcode> 

      )
    }} />
    <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content="Check Genuinity"></PoppinsTextMedium>
    </TouchableOpacity>
    } */}
    {(userData?.user_type).toLowerCase()!=="sales" &&
      <TouchableOpacity onPress={()=>{navigation.navigate('Passbook')}} style={{alignItems:"center",justifyContent:"center",position:'absolute',right:80}}>
     <FlipAnimation direction="horizontal" duration={1400} comp={()=>{
      return(
    <Book name="book" size={24} color={ternaryThemeColor}></Book>
    )
  }} />
    <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content={t("passbook")}></PoppinsTextMedium>
    </TouchableOpacity>
    }
    
    {(userData?.user_type).toLowerCase()=="sales" &&
      <TouchableOpacity onPress={()=>{navigation.navigate('ProductCatalogue')}} style={{alignItems:"center",justifyContent:"center",position:'absolute',right:20}}>
    <BookOpen name="open-book" size={24} color={ternaryThemeColor}></BookOpen>
    <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content="Product Catalogue"></PoppinsTextMedium>
    </TouchableOpacity>
    }
    </View>
    </View>}>
      <Tab.Screen  options={{headerShown:false,
      tabBarLabel:"Home",
    tabBarIcon:()=><Home name="home" size={24} color={ternaryThemeColor}></Home>
    }} name="DashboardBottom" component={Dashboard} />
    </Tab.Navigator>
  );
}

export default BottomNavigator