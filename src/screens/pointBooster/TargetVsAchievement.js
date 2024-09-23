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


const TargetVsAchievement = ({navigation}) => {
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

    // const FilterSchemeComponent = React.memo((props) => {
    //     const [openStart, setOpenStart] = useState(false);
        
    
    //     const handleDateChange = (date) => {
    //       setOpenStart(false);
    //       setSelectedDataStart(date);
    //       props.getDate(selectedDataStart);
    
    //     }
      
    //     return (
    //       <View style={{ alignItems: 'center', justifyContent: 'flex-start', width: '100%', flexDirection: 'row', marginBottom: 10 }}>
    //         <View
    //           style={{
    //             padding: 10,
    //             width: "90%",
    //             alignItems: "center",
    //             justifyContent: "flex-start",
    //             flexDirection: 'row',
    //             marginLeft: 20
    //           }}
    //         >
    //           <PoppinsTextMedium
    //             content={`${moment(selectedDataStart).format("MM/YYYY")}`}
    //             style={{ fontSize: 16, fontWeight: "700" }}
    //           />
    //           <TouchableOpacity
    //             style={{
    //               backgroundColor: ternaryThemeColor,
    //               paddingLeft: 10,
    //               borderRadius: 6,
    //               padding: 6,
    //               marginLeft: 10
    //             }}
    //             onPress={() => setOpenStart(!openStart)}
    //           >
    //             <DatePicker
    //               modal
    //               mode="date"
    //               open={openStart}
    //               date={selectedDataStart}
    //               onConfirm={handleDateChange}
    //               onCancel={() => setOpenStart(false)}
    //             />
    //             <PoppinsTextMedium
    //               style={{ color: "white", fontWeight: "700" }}
    //               content=" Select"
    //             />
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //     );
    //   });
    //   const getSelectedDates = useCallback((startDate) => {
    //     // Convert the input start date to a JavaScript Date object
    //     const inputStartDate = new Date(startDate);
      
    //     // Filter the data based on the start date
    //     const filteredData = scheme?.filter(item => {
    //       const itemStartDate = new Date(item.start_date);
    //       console.log("getSelectedDate function", itemStartDate,inputStartDate)
      
    //       // Check if the item's start date is greater than or equal to the input start date
    //       return itemStartDate >= inputStartDate;
    //     });
      
    //     console.log("filteredData", filteredData, startDate);
    //     setActiveScheme(filteredData);
    //   }, [setActiveScheme]);

    const NewSchemeComponent =(props)=>{
        const image = props.image;
        const name = props.name;
        const worth = props.worth;
        // const earnedPoints = props?.data?.point_earned ? props?.data?.point_earned : 0;
        const coin = props.coin;
        // const type = props.data.trigger_key
        return (
          <View style={{height:180,width:'90%',alignItems:'center',justifyContent:'flex-start',backgroundColor:ternaryThemeColor,borderRadius:20,marginTop:20}}>
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
              <View style={{width:'100%',borderColor:'white',borderBottomWidth:1,alignItems:'flex-start',paddingBottom:4}}>
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
              {/* <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "500",marginLeft:'60%' }}
                content={earnedPoints}
              ></PoppinsTextMedium> */}
              </View>
              <View style={{width:'100%',alignItems:'flex-start',paddingBottom:6,flexDirection:"row",marginTop:4}}>
                <View style={{alignItems:'flex-start',justifyContent:'center',width:'50%'}}>
                <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "600" }}
                content={"Start Date"}
              ></PoppinsTextMedium>
               {/* <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "600" }}
                content={props.data.start_date}
              ></PoppinsTextMedium> */}
                </View>
                <View style={{alignItems:'flex-end',justifyContent:'center',width:'50%'}}>
                <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "600" }}
                content={"End Date"}
              ></PoppinsTextMedium>
               {/* <PoppinsTextMedium
                style={{ color: "white", fontSize: 12, fontWeight: "600" }}
                content={props.data.end_date}
              ></PoppinsTextMedium> */}
                </View>
              </View>
             </View>
            </View>
            <View style={{width:'96%',height:1,backgroundColor:'white'}}></View>
            <View style={{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10,padding:6}}>
              <TouchableOpacity onPress={()=>{
               
                navigation.navigate("TargetAchievementDetails",{type:"20-20",data:props.data})
                }} style={{height:30,width:100,alignItems:'center',justifyContent:'center',backgroundColor:'#C6280A',borderRadius:30,marginLeft:4}}>
                <PoppinsTextMedium content="View Points" style={{color:'white'}}></PoppinsTextMedium>
              </TouchableOpacity>
              {/* <TouchableOpacity style={{height:30,width:100,alignItems:'center',justifyContent:'center',backgroundColor:'#C6280A',borderRadius:10,marginLeft:4}}>
                <PoppinsTextMedium content="Redeem" style={{color:'white'}}></PoppinsTextMedium>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={()=>{
                   navigation.navigate('PdfComponent', { pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/Mask+Group+64.pdf" })
              }}
               style={{height:30,alignItems:'center',justifyContent:'center',backgroundColor:'#000',borderRadius:30,marginLeft:4,padding:4, paddingHorizontal:20}}>
                <PoppinsTextMedium content="View Scheme PDF" style={{color:'white'}}></PoppinsTextMedium>
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
          content="Focus Brands"
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
       
        
        {/* {<FilterSchemeComponent getDate = {getSelectedDates}></FilterSchemeComponent>} */}
        <ScrollView contentContainerStyle={{alignItems:'center',justifyContent:'center'}} style={{ width: "100%" }}>
                <NewSchemeComponent
                    // data = {item}
                    // key={index}
                    name={"Super 20-20 Scheme (2024)"}
                    worth={"10000"}
                    coin={10}
                    image={""}
                    earnedPoints={100}
                ></NewSchemeComponent>
            </ScrollView>
        </View>
        </View>

    );
}

const styles = StyleSheet.create({})

export default TargetVsAchievement;
