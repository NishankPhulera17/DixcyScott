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
import moment from "moment";
import DatePicker from "react-native-date-picker";
import { useGetSalesBoosterOrderMutation } from "../../apiServices/salesBooster/salesBoosterApi";
import * as Keychain from "react-native-keychain";

const SchemePointDetails = ({navigation, route}) => {
  const [selectedDataStart, setSelectedDataStart] = useState(new Date());
  const [searchTitle, setSearchTitle] = useState()
    const type = route.params.type
    const schemeData = route.params.data
    const secondaryThemeColor = useSelector(
        (state) => state.apptheme.secondaryThemeColor
      );
      const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
      );
    
      const userData = useSelector(state => state.appusersdata.userData)
      console.log("userdata",userData)

      const [getSalesBoosterOrderFunc,{
        data:getSalesBoosterOrderData,
        error:getSalesBoosterOrderError,
        isLoading:getSalesBoosterOrderIsLoading,
        isError:getSalesBoosterOrderIsError
      }] = useGetSalesBoosterOrderMutation()

      useEffect(()=>{
        const getToken = async () => {
          const credentials = await Keychain.getGenericPassword();
          const token = credentials.username;
          const currDate = new Date();
          const currMonth = moment(currDate).format("MM");
          const currYear = moment(currDate).format("YYYY")
          console.log("month time data",currMonth,currYear)
          const params= {
            appUserID:userData.id,
            sb_id:schemeData.id,
            month:currMonth,
            year:currYear,
            token:token
          }
          console.log("getSalesBoosterOrderFunc", JSON.stringify(params))
          getSalesBoosterOrderFunc(params)
        };
      
        getToken();
      },[])


      useEffect(()=>{
        if(getSalesBoosterOrderData)
        {
          console.log("getSalesBoosterOrderData",JSON.stringify(getSalesBoosterOrderData))
          // if(getSalesBoosterOrderData.body.type == "purchase limit")
          // {

          // }
        }
        else if(getSalesBoosterOrderError)
        {
          console.log("getSalesBoosterOrderError",getSalesBoosterOrderError)
        }
      },[getSalesBoosterOrderData,getSalesBoosterOrderError])

    console.log("selected date", selectedDataStart,type)
    const boxesData = {
      "status": 200,
      "success": true,
      "message": "Data Fetched",
      "body": {
          "type": "purchase limit",
          "triggers": [
              {
                  "id": 6,
                  "sb_id": 5,
                  "trigger_on": "purchase limit",
                  "trigger_value": 50,
                  "offer_type": "S",
                  "point": "M-100",
                  "gift_id": null,
                  "coupon": null,
                  "wheel_campaign_id": null,
                  "cashback": null,
                  "point_probability": 0,
                  "gift_probability": 0,
                  "coupon_probability": 0,
                  "wheel_campaign_probability": 0,
                  "cashback_probability": 0,
                  "status": "1",
                  "created_at": "2024-08-22T08:31:18.168Z",
                  "created_by_id": 1,
                  "created_by_name": "Jqr",
                  "updated_at": "2024-08-22T08:31:18.168Z",
                  "updated_by_id": 1,
                  "updated_by_name": "Jqr",
                  "matched": false
              },
              {
                  "id": 140,
                  "sb_id": 5,
                  "trigger_on": "purchase limit",
                  "trigger_value": "100.00",
                  "offer_type": "S",
                  "point": "M-200",
                  "gift_id": null,
                  "coupon": null,
                  "wheel_campaign_id": null,
                  "cashback": null,
                  "point_probability": "0.00",
                  "gift_probability": "0.00",
                  "coupon_probability": "0.00",
                  "wheel_campaign_probability": "0.00",
                  "cashback_probability": "0.00",
                  "status": 1,
                  "created_at": "2024-08-22T08:31:30.548Z",
                  "created_by_id": 1,
                  "created_by_name": "Jqr",
                  "updated_at": "2024-08-22T08:31:30.548Z",
                  "updated_by_id": 1,
                  "updated_by_name": "Jqr",
                  "app_user_id": "957",
                  "trigger_id": 7,
                  "total_boxes": 448,
                  "total_points": "4480.00",
                  "unique_ranges": [
                      "DSJRIUNDER PANTIESPANTIES"
                  ],
                  "range_count": 1,
                  "order_ids": [
                      2539,
                      13300,
                      13351,
                      13402,
                      13453,
                      13504,
                      13555,
                      13606,
                      13657,
                      13708,
                      13759,
                      13810,
                      13861,
                      13912,
                      13963,
                      14014,
                      14065,
                      14116,
                      14167,
                      14218,
                      14269,
                      14320
                  ],
                  "month": 6,
                  "year": 2024,
                  "matched": true
              }
          ]
      }
  }
    const data = {
      "status": 200,
      "success": true,
      "message": "Data Fetched",
      "body": {
        "type": "target category",
        "triggers": [
          {
            "id": 146,
            "sb_id": 6,
            "trigger_on": "target category",
            "trigger_value": "5.00",
            "offer_type": "S",
            "point": "M-25",
            "gift_id": null,
            "coupon": null,
            "wheel_campaign_id": null,
            "cashback": null,
            "point_probability": "0.00",
            "gift_probability": "0.00",
            "coupon_probability": "0.00",
            "wheel_campaign_probability": "0.00",
            "cashback_probability": "0.00",
            "status": 1,
            "created_at": "2024-08-22T08:39:08.486Z",
            "created_by_id": 1,
            "created_by_name": "Jqr",
            "updated_at": "2024-08-22T08:39:08.486Z",
            "updated_by_id": 1,
            "updated_by_name": "Jqr",
            "app_user_id": "957",
            "trigger_id": 8,
            "total_boxes": 3351,
            "total_points": "64760.00",
            "unique_ranges": [
              "DSJRIUNDER PANTIESPANTIES",
              "DSJRIUNDER PANTSTRUNK",
              "DSORIUNDER PANTSTRUNK",
              "DSORIVESTVEST",
              "SLIMRISLIPSSLIPS",
              "SLIMRIUNDER PANTIESPANTIES"
            ],
            "range_count": 6,
            "month": 7,
            "year": 2024,
            "matched": true
          },
          {
            "id": 9,
            "sb_id": 6,
            "trigger_on": "target category",
            "trigger_value": 7,
            "offer_type": "S",
            "point": "M-40",
            "gift_id": null,
            "coupon": null,
            "wheel_campaign_id": null,
            "cashback": null,
            "point_probability": 0,
            "gift_probability": 0,
            "coupon_probability": 0,
            "wheel_campaign_probability": 0,
            "cashback_probability": 0,
            "status": "1",
            "created_at": "2024-08-22T08:39:29.625Z",
            "created_by_id": 1,
            "created_by_name": "Jqr",
            "updated_at": "2024-08-22T08:39:29.625Z",
            "updated_by_id": 1,
            "updated_by_name": "Jqr",
            "matched": false
          },
          {
            "id": 10,
            "sb_id": 6,
            "trigger_on": "target category",
            "trigger_value": 9,
            "offer_type": "S",
            "point": "M-70",
            "gift_id": null,
            "coupon": null,
            "wheel_campaign_id": null,
            "cashback": null,
            "point_probability": 0,
            "gift_probability": 0,
            "coupon_probability": 0,
            "wheel_campaign_probability": 0,
            "cashback_probability": 0,
            "status": "1",
            "created_at": "2024-08-22T08:39:46.948Z",
            "created_by_id": 1,
            "created_by_name": "Jqr",
            "updated_at": "2024-08-22T08:39:46.948Z",
            "updated_by_id": 1,
            "updated_by_name": "Jqr",
            "matched": false
          },
          {
            "id": 11,
            "sb_id": 6,
            "trigger_on": "target category",
            "trigger_value": 11,
            "offer_type": "S",
            "point": "M-100",
            "gift_id": null,
            "coupon": null,
            "wheel_campaign_id": null,
            "cashback": null,
            "point_probability": 0,
            "gift_probability": 0,
            "coupon_probability": 0,
            "wheel_campaign_probability": 0,
            "cashback_probability": 0,
            "status": "1",
            "created_at": "2024-08-22T08:40:03.489Z",
            "created_by_id": 1,
            "created_by_name": "Jqr",
            "updated_at": "2024-08-22T08:40:03.489Z",
            "updated_by_id": 1,
            "updated_by_name": "Jqr",
            "matched": false
          }
        ],
        "ranges": {
          "unique_ranges": [
           {"id" : 1 , "name" : " DSJRIUNDER PANTIESPANTIES" , "matched" : true},
           {"id" : 2 , "name" :   "DSJRIUNDER PANTSTRUNK", "matched" : true},
           {"id" : 3 , "name" : " DSJRIUNDER PANTIESPANTIES" , "matched" : true},
           {"id" : 4 , "name" :   "DSJRIUNDER PANTSTRUNK", "matched" : true},
           {"id" : 5 , "name" :  "DSORIUNDER PANTSTRUNK", "matched" : true},
           {"id" : 6 , "name" :  "DSORIVESTVEST", "matched" : false},
           {"id" : 7 , "name" :  "SLIMRISLIPSSLIPS", "matched" : false},
           {"id" : 8 , "name" :  "SLIMRIUNDER PANTIESPANTIES", "matched" : false},
           {"id" : 9 , "name" :  "DSORIVESTVEST", "matched" : false},
           {"id" : 10 , "name" :  "SLIMRISLIPSSLIPS", "matched" : false},
           {"id" : 11 , "name" :  "SLIMRIUNDER PANTIESPANTIES", "matched" : false},
           {"id" : 12 , "name" :  "SLIMRIUNDER PANTIESPANTIES", "matched" : false},
           {"id" : 13 , "name" :  "DSORIVESTVEST", "matched" : false},
           {"id" : 14 , "name" :  "SLIMRISLIPSSLIPS", "matched" : false},
           {"id" : 15 , "name" :  "SLIMRIUNDER PANTIESPANTIES", "matched" : false}
          
          ],
          "range_count": 6
        }
      }
    }

    const ShowDoneCategoriesTable=(props)=>{
      const data = props.data
      console.log("ShowDoneCategoriesTable",data)
      const CategoryTab=(props)=>{
        const index = props.index
        const brand = props.brand
        const style = props.style
        const points = props.points
        const matched = props.matched
        return(
          <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginTop:10}}>
          <View style={{width:'100%',alignItems:'center',justifyContent:'space-evenly',flexDirection:'row',backgroundColor:matched ? "#5CA509" : "#C6280A",height:36}}>
          <PoppinsTextMedium style={{fontWeight:'600',fontSize:14,color: "white",width:'13%'}} content={index}></PoppinsTextMedium>
          <PoppinsTextMedium style={{fontWeight:'600',fontSize:14,color: "white",width:'63%'}} content={style}></PoppinsTextMedium>

          <View style={{height:'100%',width:2,backgroundColor:'white'}}></View>

          <PoppinsTextMedium style={{fontWeight:'600',fontSize:14,color: "white",width:'20%'}} content={points}></PoppinsTextMedium>

          </View>
          </View>
        )
      }
      return(
        <View style={{width:'90%',alignItems:'center',justifyContent:'center',marginTop:20}}>
          <View style={{width:'100%',alignItems:'center',justifyContent:'space-evenly',flexDirection:'row',backgroundColor:ternaryThemeColor,height:40}}>
          <PoppinsTextMedium style={{fontWeight:'800',fontSize:15,color: "white",width:'13%'}} content="Index"></PoppinsTextMedium>
          <PoppinsTextMedium style={{fontWeight:'800',fontSize:15,color: "white",width:'63%'}} content="STYLE"></PoppinsTextMedium>
          <View style={{height:'100%',width:2,backgroundColor:'white'}}></View>
          <PoppinsTextMedium style={{fontWeight:'800',fontSize:15,color: "white",width:'20%'}} content="POINTS"></PoppinsTextMedium>
          </View>
          
          {
             data.map((item, index)=>{
              return(
                <CategoryTab key = {index} index = {index+1} matched = {item.matched} points = {item.points} style={item.name} brand = {item.brand}></CategoryTab>
              )
             })
          }
          
        </View>
      )
    }

    const ShowBoxDetails=(props)=>
    {
      const [total, setTotal] = useState(0)
      const noBox = props.noBox;
      const data = props.data
      
      console.log("ShowBoxDetails",data)

      useEffect(()=>{
        let sum = 0;
        for(var i=0;i<data.length;i++)
        {
          console.log("useEffect showBoxDetails",data[i]["total_boxes"])
          if(data[i]["total_boxes"])
          sum += Number(data[i]["total_boxes"])
        }
        setTotal(sum)
      },[data])

      const TotalBox =(props)=>{
        const ttl = props.total
        return(
          <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#F47B20'}}>
            <View style={{alignItems:"center",justifyContent:'center',width:'66%',borderRightWidth:1,borderColor:'#DDDDDD'}}>
            <PoppinsTextMedium style={{color:'white', fontSize:16,fontWeight:'800'}} content="Total"></PoppinsTextMedium>
            </View>
            <View style={{alignItems:"center",justifyContent:'center',width:'33%',borderRightWidth:1,borderColor:'#DDDDDD'}}>
            <PoppinsTextMedium style={{color:'white', fontSize:16,fontWeight:'800'}} content={ttl}></PoppinsTextMedium>
            </View>
          </View>
        )
      }

      const MultiplierBox = (props)=>{
        const matched = props.data.matched;
        const boxes = props.data.trigger_value;
        const mtdBoxes = props.data.total_boxes
        const temp = props.data.point

        const bonusPoints = temp.split("-")[1];
        return (
          <View style={{flexDirection:'row',alignItems:"center",justifyContent:'center',width:'100%',backgroundColor:matched ? "#5CA509" : "#FFFFFF"}}>
          <View style={{width:'33%',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#DDDDDD',padding:4}}>
          <PoppinsTextMedium style={{color:matched ? "white":"#171717",fontSize:15,fontWeight:'600'}} content={boxes}></PoppinsTextMedium>
          </View>
          <View style={{width:'33%',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#DDDDDD',padding:4}}>
          <PoppinsTextMedium style={{color:matched ? "white":"#171717",fontSize:15,fontWeight:'600'}} content={bonusPoints}></PoppinsTextMedium>
          </View>
          <View style={{width:'33%',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#DDDDDD',padding:4}}>
          <PoppinsTextMedium style={{color:matched ? "white":"#171717",fontSize:15,fontWeight:'600'}} content={mtdBoxes}></PoppinsTextMedium>
          </View>
        </View>
        )
      }

      return(
        <View style={{alignItems:'center',justifyContent:'center',width:'100%',borderWidth:1,borderColor:'#DDDDDD',borderRadius:4,backgroundColor:"#FFFFFF"}}>
          <View style={{alignItems:'center',justifyContent:'flex-start',backgroundColor:"#D3CFCF",width:'100%',padding:10,flexDirection:'row'}}>
            <PoppinsTextMedium style={{color:"#171717",fontSize:16,fontWeight:'600'}} content="No. of Boxes Bought (MTD )"></PoppinsTextMedium>
            <PoppinsTextMedium style={{color:"#171717",fontSize:16,fontWeight:'600',marginLeft:20}} content={noBox}></PoppinsTextMedium>
          </View>
          <View style={{alignItems:'center',justifyContent:'center',width:'100%',height:40}}>
          <PoppinsTextMedium style={{color:"#171717",fontSize:16,fontWeight:'600'}} content="Monthly Vo. Based Multiplier"></PoppinsTextMedium>
          </View>
          <View style={{flexDirection:'row',alignItems:"center",justifyContent:'center',width:'100%',backgroundColor:'#F0F0F0'}}>
            <View style={{width:'33%',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#DDDDDD',padding:4}}>
            <PoppinsTextMedium style={{color:"#171717",fontSize:15,fontWeight:'600'}} content="Boxes in Month"></PoppinsTextMedium>
            </View>
            <View style={{width:'33%',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#DDDDDD',padding:4}}>
            <PoppinsTextMedium style={{color:"#171717",fontSize:15,fontWeight:'600'}} content="Bonus points"></PoppinsTextMedium>
            </View>
            <View style={{width:'33%',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#DDDDDD',padding:4}}>
            <PoppinsTextMedium style={{color:"#171717",fontSize:15,fontWeight:'600'}} content="MTD Boxes"></PoppinsTextMedium>
            </View>
          </View>
          {
            data && data.map((item,index)=>{
              return(
                <MultiplierBox data = {item}></MultiplierBox>
              )
            })
          }
          <TotalBox total={total}></TotalBox>
        </View>
      )
    }
    

        const ShowCategoryTable=(props)=>{
          const data = props.data

          const CategoryTab=(props)=>{
            const backGroundColor = props.backGroundColor 
            const noSubCategories = props.noSubCategories
            const multiplier = props.multiplier
            const points = props.points
            return(
              <View style={{width:'100%',alignItems:'center',justifyContent:'space-evenly',flexDirection:'row',height:40,backgroundColor:backGroundColor? "#5CA509" : "white",borderWidth:1,borderColor:'#DDDDDD'}}>
                <View style={{width:'33%',alignItems:'center',justifyContent:'center',height:'100%',borderRightWidth:1,borderColor:'#DDDDDD'}}>
                  <PoppinsTextMedium style={{fontWeight:'600',fontSize:14,color:backGroundColor? "white" : "black"}} content={noSubCategories}></PoppinsTextMedium>
                </View>
                <View style={{width:'33%',alignItems:'center',justifyContent:'center',height:'100%',borderRightWidth:1,borderColor:'#DDDDDD'}}>
                  <PoppinsTextMedium style={{fontWeight:'600',fontSize:14,color:backGroundColor? "white" : "black"}} content={multiplier}></PoppinsTextMedium>
                </View>
                <View style={{width:'33%',alignItems:'center',justifyContent:'center',height:'100%'}}>
                  <PoppinsTextMedium style={{fontWeight:'600',fontSize:14,color:backGroundColor? "white" : "black"}} content={points}></PoppinsTextMedium>
                </View>
              </View>
            )
          }

          return(
            <View style={{width:'100%',alignItems:'center',justifyContent:"center",borderWidth:1,borderColor:'#DDDDDD'}}>
              <View style={{width:'100%',alignItems:'center',justifyContent:'space-evenly',flexDirection:'row',height:40,backgroundColor:'#F0F0F0'}}>
                <View style={{width:'33%',alignItems:'center',justifyContent:'center',height:'100%',borderRightWidth:1,borderColor:'#DDDDDD'}}>
                  <PoppinsTextMedium style={{fontWeight:'800',fontSize:16,color:'black'}} content="Sub-Category"></PoppinsTextMedium>
                </View>
                <View style={{width:'33%',alignItems:'center',justifyContent:'center',height:'100%',borderRightWidth:1,borderColor:'#DDDDDD'}}>
                  <PoppinsTextMedium style={{fontWeight:'800',fontSize:16,color:'black'}} content="Multiplier"></PoppinsTextMedium>
                </View>
                <View style={{width:'33%',alignItems:'center',justifyContent:'center',height:'100%'}}>
                  <PoppinsTextMedium style={{fontWeight:'800',fontSize:16,color:'black'}} content="Points"></PoppinsTextMedium>
                </View>
              </View>
              {data.map((item,index)=>{
                return(
                  <CategoryTab key={index} points={item.pointsRewarded} multiplier={item.point} noSubCategories={item.trigger_value} backGroundColor = {item.matched }></CategoryTab>
                )
              })}
            </View>
          )
        }

      const FilterSchemeComponent = React.memo((props) => {
        const [openStart, setOpenStart] = useState(false);
        
    
        const handleDateChange = (date) => {
          setOpenStart(false);
          setSelectedDataStart(date);
    
        }
     
      
        return (
          <View style={{ alignItems: 'center', justifyContent: 'flex-start', width: '100%', flexDirection: 'row', marginBottom: 10 }}>
            <View
              style={{
                padding: 10,
                width: "50%",
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: 'row',
                marginLeft: 20
              }}
            >
              <PoppinsTextMedium
                content={`${moment(selectedDataStart).format("MM/YYYY")}`}
                style={{ fontSize: 16, fontWeight: "700" }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: ternaryThemeColor,
                  paddingLeft: 10,
                  borderRadius: 6,
                  padding: 6,
                  marginLeft: 20
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
                  style={{ color: "white", fontWeight: "700" }}
                  content=" Select"
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    const FilterScheme=(props)=>{
      const [month, setMonth] = useState()
      const title = props.title
      
      return(
        <View style={{alignItems:'center',justifyContent:'space-between',width:'100%',flexDirection:"row"}}>
          <PoppinsTextMedium style={{color:'black',fontSize:16,fontWeight:'600',width:'40%'}} content={title}></PoppinsTextMedium>
         <FilterSchemeComponent ></FilterSchemeComponent>
          
        </View>
      )
    }
    return (
        <View >
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
          content="View Points"
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
        <FilterScheme title={"Sub-Category Purchase For"}></FilterScheme>
        <View style={{width:'90%',height:'30%'}}>
        {getSalesBoosterOrderData && type == "target category" && <ShowCategoryTable data = {getSalesBoosterOrderData.body.triggers}></ShowCategoryTable>}
        {getSalesBoosterOrderData && type == "purchase limit" && <ShowBoxDetails data = {getSalesBoosterOrderData.body.triggers}></ShowBoxDetails>}

        </View>
        <ScrollView contentContainerStyle={{alignItems:'center',width:'100%'}}>
        {getSalesBoosterOrderData && type == "target category" && <ShowDoneCategoriesTable data = {getSalesBoosterOrderData.body.ranges} ></ShowDoneCategoriesTable>}
        </ScrollView>
        </View>
        
        </View>
        </View>

    );
}

const styles = StyleSheet.create({})

export default SchemePointDetails;
