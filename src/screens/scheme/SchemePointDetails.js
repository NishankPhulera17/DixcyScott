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
