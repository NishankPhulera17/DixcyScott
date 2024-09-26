import React, { useEffect, useState,useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Text,
  Touchable,
} from "react-native";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import * as Keychain from "react-native-keychain";
import Logo from "react-native-vector-icons/AntDesign";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import { useGetBasePointsMutation } from "../../apiServices/pointBooster/basePointsApi";

const BasePoints = ({navigation}) => {
  const [scheme, setScheme] = useState([]);
  const [activeScheme, setActiveScheme] = useState()
  const [selectedDataStart, setSelectedDataStart] = useState(new Date());
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const location = useSelector((state) => state.userLocation.location);
    console.log("Location Data from redux state", location);
  const height = Dimensions.get("window").height;
  const userData = useSelector(state => state.appusersdata.userData);

  const [getBasePointsFunc,{
    data:getBasePointsData,
    error:getBasePointsError,
    isLoading:getBasePointsIsLoading,
    isError:getBasePointsIsError
  }] = useGetBasePointsMutation()


  useEffect(()=>{
    const getToken=async()=>{
        const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const month = moment(new Date()).format("MM")
    const year = moment(new Date()).format("YYYY")
    const appUserId = userData.id
    console.log("base Point mounted", month,year)
    const body = {token:token,month:month,year:year,appUserId:appUserId}
    getBasePointsFunc(body)

    }
    getToken()
  },[])


  useEffect(()=>{
    const getToken=async()=>{
        const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;

    const month = selectedDataStart.getMonth() + 1; // Adding 1 because getMonth() returns 0-based month (0 for January, 1 for February, etc.)
    const year = selectedDataStart.getFullYear();
    
    console.log("monthyear prev", month,year)
    const appUserId = userData.id
    console.log("base selected date", selectedDataStart)
    const body = {token:token,month:month,year:year,appUserId:appUserId}
    getBasePointsFunc(body)

    }
    getToken()
  },[selectedDataStart])


  

  useEffect(()=>{
    if(getBasePointsData)
    {
        console.log("getBasePointsData",getBasePointsData)
        
    }
    else if(getBasePointsError)
    {
        console.log("getBasePointsError",getBasePointsError)
    }
  },[getBasePointsData,getBasePointsError])


  const FilterSchemeComponent = React.memo((props) => {
    const [openStart, setOpenStart] = useState(false);

    const handleDateChange = (date) => {
      setOpenStart(false);
      setSelectedDataStart(date);
      props.getDate(selectedDataStart);
    };

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            padding: 10,
            width: "90%",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            marginLeft: 20,
          }}
        >
          <PoppinsTextMedium
            content={`${moment(selectedDataStart).format("MMM YYYY")}`}
            style={{ fontSize: 16, fontWeight: "700", color:'black', borderBottomWidth:0.5 }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              paddingLeft: 10,
              borderRadius: 30,
              paddingHorizontal:10,
              paddingVertical:8,
              marginLeft: 'auto',
              borderWidth:0.5,
              borderColor:'#808080',flexDirection:'row',
              justifyContent:'center'
            }}
            onPress={() => setOpenStart(!openStart)}
          >
            <DatePicker
              modal
              mode="date"
              open={openStart}
              date={selectedDataStart}
              onConfirm={handleDateChange}
              onCancel={() => setOpenStart(false)}
            />
            <PoppinsTextMedium
              style={{ color: "#808080", fontWeight: "600",marginRight:10 }}
              content= {"Select Month & Year"}
            />
            <Image style={{height:13,width:12, resizeMode:'contain',marginTop:2,marginLeft:5}} source={require("../../../assets/images/arrowDown.png")}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  });


      const getSelectedDates = useCallback((startDate) => {
        // Convert the input start date to a JavaScript Date object
        const inputStartDate = new Date(startDate);
      
        // Filter the data based on the start date
        const filteredData = scheme?.filter(item => {
          const itemStartDate = new Date(item.start_date);
          console.log("getSelectedDate function", itemStartDate,inputStartDate)
      
          // Check if the item's start date is greater than or equal to the input start date
          return itemStartDate >= inputStartDate;
        });
      
        console.log("filteredData", filteredData, startDate);
        setActiveScheme(filteredData);
      }, [setActiveScheme]);

    const NewSchemeComponent =(props)=>{
        const image = props.image;
        const name = props.name;
        const worth = props.worth;
        // const earnedPoints = props?.data?.point_earned ? props?.data?.point_earned : 0;
        const coin = props.coin;
        const startDate = moment(new Date()).format("MM-YYYY")
        const endDate = moment(new Date()).format("MM-YYYY")

        // const type = props.data.trigger_key
        console.log("NewSchemeComponent",props.data)
        return (
          <View style={{height:200,width:'90%',alignItems:'center',justifyContent:'flex-start',backgroundColor:ternaryThemeColor,borderRadius:20,marginTop:20}}>
            <View style={{height:'60%',width:'100%',flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start',marginTop:10}}>
            <View
                style={{
                  height: 100,
                  width: '25%',
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",   
                }}
              >
                <View
              style={{
                height: 65,
                width: 65,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                //   borderWidth: 1,
                borderColor: "white",
              }}
            >
              <Image
                style={{
                  height: 65,
                  width: 65,
                  resizeMode: "contain",
                  borderRadius: 10,
                }}
                source={require("../../../assets/images/giftBlue.png")}
              ></Image>
            </View>
              </View>
             <View style={{width:'70%',alignItems:'flex-start',justifyContent:'center'}}>
              <View style={{width:'100%',borderColor:'white',borderBottomWidth:1,alignItems:'flex-start',paddingBottom:4,marginTop:15,}}>
              <PoppinsTextMedium
                style={{ color: "white", fontSize: 18, fontWeight: "700" }}
                content={name}
              ></PoppinsTextMedium>
              </View>
              <View style={{width:'100%',borderColor:'white',borderBottomWidth:1,alignItems:'flex-start',flexDirection:'row',marginTop:10,paddingBottom:6}}>
              <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "500" }}
                content={"Total Earn Points"}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "500",marginLeft:'50%' }}
                content={Number(props.data.points)}
              ></PoppinsTextMedium>
              </View>
              <View style={{width:'100%',alignItems:'flex-start',paddingBottom:6,flexDirection:"row",marginTop:4,marginBottom:10}}>
                <View style={{alignItems:'flex-start',justifyContent:'center',width:'50%'}}>
                <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "600" }}
                content={"Start Date"}
              ></PoppinsTextMedium>
               <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "600" }}
                content={startDate}
              ></PoppinsTextMedium>
                </View>
                <View style={{alignItems:'flex-end',justifyContent:'center',width:'50%'}}>
                <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "600" }}
                content={"End Date"}
              ></PoppinsTextMedium>
               <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "600" }}
                content={endDate}
              ></PoppinsTextMedium>
                </View>
              </View>
             </View>
            </View>
            <View style={{width:'96%',height:1,backgroundColor:'white', marginTop:15}}></View>
            <View style={{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:10,padding:6}}>
              {/* <TouchableOpacity onPress={()=>{
               
                // navigation.navigate("SchemePointDetails",{type:type,data:props.data})
                }} style={{height:30,width:100,alignItems:'center',justifyContent:'center',backgroundColor:'#171717',borderRadius:10,marginLeft:4}}>
                <PoppinsTextMedium content="View Points" style={{color:'white'}}></PoppinsTextMedium>
              </TouchableOpacity> */}
              {/* <TouchableOpacity style={{height:30,width:100,alignItems:'center',justifyContent:'center',backgroundColor:'#C6280A',borderRadius:10,marginLeft:4}}>
                <PoppinsTextMedium content="Redeem" style={{color:'white'}}></PoppinsTextMedium>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={()=>{
               navigation.navigate('PdfComponent', { pdf: getBasePointsData?.body?.pdf })
              }} style={{height:30,alignItems:'center',justifyContent:'center',backgroundColor:'#000',borderRadius:30,marginLeft:4,paddingLeft:8,paddingRight:8}}>
                <PoppinsTextMedium content="View PDF" style={{color:'white', paddingHorizontal:20}}></PoppinsTextMedium>
              </TouchableOpacity>
            </View>
            
          </View>
        )
    
    
      }

    return (
        <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: ternaryThemeColor,
        height:'100%'
        
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: '6%',
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content="Base Points"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "white",
          }}
        ></PoppinsTextMedium>
      </View>
      <View
        style={{
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          backgroundColor: "white",
          marginTop: 10,
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          paddingBottom: 10,
          height:'90%'
        }}
      >
       
        
        {<FilterSchemeComponent getDate = {getSelectedDates}></FilterSchemeComponent>}
        <ScrollView contentContainerStyle={{alignItems:'center',justifyContent:'center'}} style={{ width: "100%" }}>
                {getBasePointsData && <NewSchemeComponent
                    data = {getBasePointsData?.body}
                    name={"Base points For The Month Scheme (2024)"}
                    worth={"10000"}
                    coin={10}
                    image={""}
                    earnedPoints={400}
                ></NewSchemeComponent>}
            </ScrollView>
        </View>
        </View>

    );
}

const styles = StyleSheet.create({})

export default BasePoints;
