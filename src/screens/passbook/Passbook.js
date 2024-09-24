import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Text,Modal, TouchableWithoutFeedback } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import RewardBox from '../../components/molecules/RewardBox';
import { useGetActiveMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import * as Keychain from 'react-native-keychain';
import PlatinumModal from '../../components/platinum/PlatinumModal';
import { useGetPointSharingDataMutation } from '../../apiServices/pointSharing/pointSharingApi';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import { useTranslation } from 'react-i18next';
import { neededHistory } from '../../utils/HandleClientSetup';
import { useCashPerPointMutation, useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import { useGetkycStatusMutation } from '../../apiServices/kyc/KycStatusApi';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';

const Passbook = ({ navigation }) => {
    const [warrantyOptionEnabled, setWarrantyOptionEnabled] = useState(false)
    const [showKyc, setShowKyc] = useState(true)
    const [modalVisible, setModalVisible] = useState(false);
    const [redemptionStartData, setRedemptionStartDate]  = useState()
  const [redemptionEndDate, setRedemptionEndDate] = useState()
  const [minRedemptionPoints, setMinRedemptionPoints] = useState()
    const [couponOptionEnabled, setCouponOptionEnabled] = useState(false)
    const [cashbackOptionEnabled, setCashbackOptionEnabled] = useState(false)
    const [wheelOptionEnabled, setWheelOptionEnabled] = useState(false)
    const [pointsOptionEnabled, setPointsOptionEnabled] = useState(false)
    const [PlatinumModalOpen, setPlatinumModal] = useState(false)
    const [listView, setListView] = useState(true)
    const [navigateTo, setNavigateTo] = useState()
    const [pointBalance, setPointBalance] = useState()
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState()
    const shouldSharePoints = useSelector(state => state.pointSharing.shouldSharePoints)

    const { t } = useTranslation();

    const [getPointSharingFunc, {
        data: getPointSharingData,
        error: getPointSharingError,
        isLoading: getPointSharingIsLoading,
        isError: getPointSharingIsError
    }] = useGetPointSharingDataMutation()

    const [getKycStatusFunc, {
        data: getKycStatusData,
        error: getKycStatusError,
        isLoading: getKycStatusIsLoading,
        isError: getKycStatusIsError
      }] = useGetkycStatusMutation()

      
    const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
        isError: userPointIsError
      }] = useFetchUserPointsMutation()

    const [cashPerPointFunc,{
        data:cashPerPointData,
        error:cashPerPointError,
        isLoading:cashPerPointIsLoading,
        isError:cashPerPointIsError
      }] = useCashPerPointMutation()


    const [getActiveMembershipFunc, {
        data: getActiveMembershipData,
        error: getActiveMembershipError,
        isLoading: getActiveMembershipIsLoading,
        isError: getActiveMembershipIsError
    }] = useGetActiveMembershipMutation();

    const [pointSharing, setPointSharing] = useState(false)
    const colors = ["blue", "red", "green"]


    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    const userData = useSelector(state => state.appusersdata.userData)

    console.log('userdata', userData)
    const workflowProgram = useSelector(state => state.appWorkflow.program);
    const pointSharingData = useSelector(state => state.pointSharing.pointSharing)
    console.log("pointSharingData", JSON.stringify(pointSharingData),workflowProgram)
    const name = userData.name
    const membership = getActiveMembershipData && getActiveMembershipData.body?.tier.name;


    const getOptionsAccordingToWorkflow = () => {
        if (workflowProgram?.includes('Warranty')) {
            setWarrantyOptionEnabled(true)
        }
        if (workflowProgram?.includes('Static Coupon')) {
            setCouponOptionEnabled(true)
        }
        if (workflowProgram?.includes('Points On Product')) {
            setPointsOptionEnabled(true)
        }
        if (workflowProgram?.includes('Cashback')) {
            setCashbackOptionEnabled(true)
        }
        if (workflowProgram?.includes('Wheel')) {
            setWheelOptionEnabled(true)
        }

    }
    useEffect(() => {
        (async () => {
          const credentials = await Keychain.getGenericPassword();
          const token = credentials.username;
          const userId = userData.id
          cashPerPointFunc(token)
          getKycStatusFunc(token)

          
        })();
      }, []);

    useEffect(() => {
        getOptionsAccordingToWorkflow()
        getMembership()
        fetchPoints()
    }, [])

    useEffect(()=>{
        if(cashPerPointData)
        {
            console.log("cashPerPointData",cashPerPointData)
            if(cashPerPointData.success)
    
            {
              const temp = cashPerPointData?.body
              setRedemptionStartDate(temp?.redeem_start_date)
              setRedemptionEndDate(temp?.redeem_end_date)
              setMinRedemptionPoints(temp?.min_point_redeem)
            }
        }
        else if(cashPerPointError){
            console.log("cashPerPointError",cashPerPointError)
            
        }
      },[cashPerPointData,cashPerPointError])

    useEffect(()=>{
        if(cashPerPointData)
        {
            console.log("cashPerPointData",cashPerPointData)
            if(cashPerPointData.success)
    
            {
              const temp = cashPerPointData?.body
              setRedemptionStartDate(temp?.redeem_start_date)
              setRedemptionEndDate(temp?.redeem_end_date)
              setMinRedemptionPoints(temp?.min_point_redeem)
            }
        }
        else if(cashPerPointError){
            console.log("cashPerPointError",cashPerPointError)
            
        }
      },[cashPerPointData,cashPerPointError])

    useEffect(() => {
        (async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            const params = {
                token: token,
                id: String(userData.id),
                cause: "registration_bonus"
            }
            getPointSharingFunc(params)

        })();
    }, []);

    useEffect(() => {
        if (getKycStatusData) {
          console.log("getKycStatusData", getKycStatusData)
          if (getKycStatusData.success) {
            const tempStatus = Object.values(getKycStatusData.body)        
            setShowKyc(tempStatus.includes(false))
            if(getKycStatusData.body.gstin == true)
            {
              setShowKyc(false)
            }
            if(getKycStatusData.body.pan ==true && getKycStatusData.body.aadhar ==true)
            {
              setShowKyc(false)
    
            }
          }
        }
        else if (getKycStatusError) {
          console.log("getKycStatusError", getKycStatusError)
        }
      }, [getKycStatusData, getKycStatusError])
    useEffect(() => {
        if (getPointSharingData) {
            console.log("getPointSharingData", JSON.stringify(getPointSharingData))

        }
        else if (getPointSharingError) {
            console.log("getPointSharingError", getPointSharingError)
        }
    }, [getPointSharingData, getPointSharingError])

    const fetchPoints = async () => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const params = {
          userId: userData.id,
          token: token
        }
        userPointFunc(params)

    
      }
      const modalClose = () => {
        setError(false);
        setSuccess(false)
        
      };
    const checkForPointSharing = () => {
        if (pointSharingData.is_point_sharing_bw_user) {
            setPointSharing(Object.keys(pointSharingData.point_sharing_bw_user.user).includes(userData.user_type))
            console.log("pointSharingData list", pointSharingData.point_sharing_bw_user.user)
        }
    }
    const getMembership = async () => {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            console.log(
                'Credentials successfully loaded for user ' + credentials.username
            );
            const token = credentials.username
            getActiveMembershipFunc(token)
        }
    }

    const closePlatinumModal = () => {
        setPlatinumModal(false)
    }

    useEffect(() => {
        getOptionsAccordingToWorkflow()
        checkForPointSharing()
    }, [])

    useEffect(() => {
        if (userPointData) {
        //   console.log("userPointData", userPointData)
          if(userPointData.success)
          {
            console.log("userPointData dashboard",userPointData.body.point_balance)
          setPointBalance(userPointData.body.point_balance)
          }
        }
        else if (userPointError) {
          console.log("userPointError", userPointError)
        }
    
      }, [userPointData, userPointError])
    

    useEffect(() => {
        if (getActiveMembershipData) {
            console.log("getActiveMembershipData", JSON.stringify(getActiveMembershipData))
        }
        else if (getActiveMembershipError) {
            console.log("getActiveMembershipError", getActiveMembershipError)
        }
    }, [getActiveMembershipData, getActiveMembershipError])

    const handleRedeemButtonPress = () => {
      console.log("handleRedeemButtonPress",Number(pointBalance))
        if (Number(pointBalance) <= 0 ) {
          setError(true)
          setMessage("Sorry you don't have enough points.")
        //   setNavigateTo("RedeemedHistory")
        }
        else if(Number(minRedemptionPoints)>Number(pointBalance))
        {
          console.log("Minimum Point required to redeem is : ",minRedemptionPoints)
          setError(true)
          setMessage(`Minimum Point required to redeem is : ${minRedemptionPoints}`)
        //   setNavigateTo("RedeemedHistory")
        }
        else {
          if(redemptionEndDate && redemptionStartData)
          if((new Date(redemptionStartData).getTime() <= (new Date()).getTime())  &&  ( (new Date()).getTime()) <= (new Date(redemptionEndDate).getTime()))
          {
            console.log("show kyc status", showKyc)
            console.log("correct redemption date",new Date().getTime(),new Date(redemptionStartData).getTime(),new Date(redemptionEndDate).getTime())
          if(!showKyc)
          {
            setModalVisible(true)
          }
          else{
            setError(true)
            setMessage("Kyc not completed yet")
            // setNavigateTo("Verification")
          }
          }
          else{
            setError(true)
            setMessage("Redemption window starts from "+ moment(redemptionStartData).format("DD-MMM-YYYY") + " and ends on " +  moment(redemptionEndDate).format("DD-MMM-YYYY"))
            // setNavigateTo("RedeemedHistory")
  
          }
          else{
            alert("Redemption start and end date have not been set yet!!")
          }
        } 
      }

    const NavigateTO = (props) => {
        const title = props.title
        const visibleTitle = props.visibleTitle
        const discription = props.discription
        const image = props.image
        const navigateToPages = (data) => {

            console.log("navigateToPages", data)
            if (data === "Scanned History") {
                navigation.navigate('ScannedHistory')
            }
            else if (data === "Points History") {
                navigation.navigate('PointHistory')

            }
            else if (data === "Redeemed History") {
                navigation.navigate('RedeemedHistory')

            }
            else if (data === "Cashback History") {
                navigation.navigate('CashbackHistory')

            }
            else if (data === "Coupon History") {
                navigation.navigate('CouponHistory')

            }
            else if (data === "Order History") {
                navigation.navigate('OrderHistory')

            }
            else if (data === "Wheel History") {
                navigation.navigate('WheelHistory')

            }

            else if (data === "Warranty History") {
                navigation.navigate('WarrantyHistory')

            }
            else if (data === "Previous Transaction History") {
                console.log("PreviousTransactionHistory")
                navigation.navigate('PreviousTransactionHistory')

            }
            else if (data === "Shared Point History") {
                navigation.navigate('SharedPointsHistory')

            }
        }


        return (
            <TouchableOpacity onPress={() => {
                navigateToPages(title)
            }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", borderBottomWidth: 1, width: '100%', borderColor: '#EEEEEE', padding: 6, paddingTop: 8, paddingBottom: 8 }}>
                <View style={{ height: 44, width: 44, alignItems: "center", justifyContent: "center", borderRadius: 4, borderColor: ternaryThemeColor,  marginLeft: 10 }}>
                    <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={image}></Image>
                </View>
                <View style={{  width: 210, alignItems: "flex-start", justifyContent: "center", marginLeft: 14 }}>
                    <PoppinsText style={{ color: 'black', fontSize: 14 }} content={visibleTitle}></PoppinsText>
                    <PoppinsTextMedium style={{ color: 'grey', fontSize: 12, textAlign: 'left' }} content={discription}></PoppinsTextMedium>
                </View>
                <TouchableOpacity onPress={() => {
                    navigateToPages(title)
                }} style={{ marginLeft: 20 }}>
                    <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/goNext.png')}></Image>
                </TouchableOpacity>

            </TouchableOpacity>
        )
    }

    const GridVIew = (props) => {
        const title = props.title
        const discription = props.discription
        const image = props.image
        const navigateToPages = (data) => {

            console.log("navigateToPages",data)
            
            if (data === "Scanned History") {
                navigation.navigate('ScannedHistory')
            }
            else if (data === "Points History") {
                navigation.navigate('PointHistory')

            }
            else if (data === "Redeemed History") {
                navigation.navigate('RedeemedHistory')

            }
            else if (data === "Cashback History") {
                navigation.navigate('CashbackHistory')

            }
            else if (data === "Coupon History") {
                navigation.navigate('CouponHistory')

            }
            else if (data === "Order History") {
                navigation.navigate('OrderHistory')

            }
            else if (data === "Wheel History") {
                navigation.navigate('WheelHistory')

            }
            else if (data === "Warranty History") {
                navigation.navigate('WarrantyHistory')

            }
            else if (data === "Shared Point History") {
                navigation.navigate('SharedPointsHistory')

            }
            else if (data === "Previous Transaction History") {
                navigation.navigate('PreviousTransactionHistory')

            }
        }


        return (
            <View>
                <TouchableOpacity onPress={() => {
                    navigateToPages(title)
                }} style={{ flexDirection: "column",width: 70, height: 70, borderColor: ternaryThemeColor, padding: 6, marginTop: 15, marginHorizontal: 22, alignItems: 'center' }}>
                    <View style={{ height: 44, width: 44, alignItems: "center", justifyContent: "center", }}>
                        <Image style={{ height: 60, width: 60, resizeMode: "contain", }} source={image}></Image>
                    </View>
                </TouchableOpacity>

                <View style={{ width: 80, marginTop: 6, alignSelf: 'center' }}>
                    <PoppinsTextMedium style={{ color: 'black', fontWeight: '800', fontSize: 14, textAlign: 'center' }} content={title}></PoppinsTextMedium>
                </View>
            </View>

        )
    }



    return (
        <ScrollView style={{ height: '100%', width: '100%', flex: 1, backgroundColor: "white" }}>
            <View style={{ alignItems: "center", height: '100%', width: "100%", }}>
            <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <TouchableOpacity activeOpacity={1} onPress={()=>{setModalVisible(!modalVisible)}} style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image style={{ height: 80, width: 80, marginTop: 20 }} source={require('../../../assets/images/gift1.png')}></Image>
              <PoppinsTextMedium style={{ color: 'black', width: 300, marginTop: 20 }} content="Do you want redeem your point with amazing gift or cashback"></PoppinsTextMedium>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20,width:'100%'}}>
                <TouchableOpacity onPress={() => {
                  console.log("gift")
                  setModalVisible(false)
                  navigation.navigate('RedeemGifts',{schemeType : "yearly"})

                }} style={{ alignItems: "center", justifyContent: "center", backgroundColor: '#0E2659', flexDirection: "row", height: 40, width: 100, borderRadius: 10 }}>
                  <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/giftWhite.png')}></Image>
                  <PoppinsTextMedium style={{ color: 'white', marginLeft: 10 }} content="Gift"></PoppinsTextMedium>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => {
                  console.log("Coupons")
                  setModalVisible(false)
                  navigation.navigate('RedeemCoupons')

                }} style={{ alignItems: "center", justifyContent: "center", backgroundColor: ternaryThemeColor, flexDirection: "row", height: 40, width: 100, borderRadius: 10 }}>
                  <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/giftWhite.png')}></Image>
                  <PoppinsTextMedium style={{ color: 'white', marginLeft: 10 }} content="Coupons"></PoppinsTextMedium>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  console.log("cashback")
                  setModalVisible(false)
                  navigation.navigate('RedeemCashback')
                }} style={{ alignItems: "center", justifyContent: "center", backgroundColor: '#0E2659', flexDirection: "row", height: 40, width: 120, borderRadius: 10 }}>
                  <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/giftWhite.png')}></Image>
                  <PoppinsTextMedium style={{ color: 'white', marginLeft: 10 }} content="Cashback"></PoppinsTextMedium>
                </TouchableOpacity> */}
              </View>

            </View>
          </TouchableOpacity>
        </Modal>
                {/* coloured header */}
                <View style={{ width: '100%', backgroundColor: ternaryThemeColor, alignItems: "center", justifyContent: 'center',paddingBottom:16 }}>

                    <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/blackBack.png')}></Image>
                        </TouchableOpacity>
                        <PoppinsTextMedium content={t("Passbook" )}style={{ marginLeft: 10, fontSize: 18, fontWeight: '700', color: 'white' }}></PoppinsTextMedium>
                        {/* <TouchableOpacity style={{marginLeft:'50%'}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/notificationOn.png')}></Image>
            </TouchableOpacity> */}
                    </View>
                    {/* name and membership */}
                    {/* --------------------------- */}
                    <View style={{ flexDirection: "row", height: 50, width: '100%', alignItems: "center", justifyContent: "flex-start" }}>
                        <PoppinsText content={name} style={{ color: 'white', fontSize: 20, marginLeft: 20 }}></PoppinsText>
                        {/* <View style={{ height: 20, width: 2, backgroundColor: "white", marginLeft: 10 }}></View>

                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                            setPlatinumModal(true)
                        }}>
                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/reward.png')}></Image>
                            <PoppinsTextMedium style={{ color: "white" }} content={membership}></PoppinsTextMedium>
                        </TouchableOpacity> */}

                    </View>
                    <View style={{ alignItems: "center", justifyContent: "center", width: '90%',backgroundColor:'' }}>
                        <RewardBox ></RewardBox>

                    </View>
                    
                </View>

                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <View style={{ backgroundColor: 'white' }}>
                            {userData && <TouchableOpacity style={{ backgroundColor: ternaryThemeColor, padding: 10, borderRadius: 5, width: 120, alignItems: 'center', }} onPress={() => { handleRedeemButtonPress() }}>
                                <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '800' }} content={t("redeem")}  ></PoppinsTextLeftMedium>
                            </TouchableOpacity>}
                        </View>
                    </View>


                {/* options----------------------------- */}

                {
                    listView &&
                    <View style={{ width: '90%', alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 20, marginTop: 20 }}>

                        <View style={{ width: '100%', height: 50, flexDirection: "row", alignItems: "center", justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEEEEE' }}>
                            <View style={{width:'70%',height:'100%',alignItems:'flex-start',justifyContent:'center',margin:14}}>
                            {(getPointSharingData?.body?.total !== "0") ? <PoppinsTextMedium style={{ color: ternaryThemeColor, fontWeight: 'bold' }} content={`${t("registration bonus")}: ${getPointSharingData?.body?.data?.[0]?.points ? getPointSharingData?.body?.data?.[0]?.points + "Points" : "loading"} `}></PoppinsTextMedium >
                                : <PoppinsTextMedium style={{ fontWeight: 'bold' }} content={t("what do you want to do")}></PoppinsTextMedium>
                            }
                            </View>
                            
                            <View style={{ flexDirection: 'row',width:'20%'}}>

                                <TouchableOpacity style={{ backgroundColor: listView ? ternaryThemeColor : 'white', marginRight: 10, paddingHorizontal: 7, paddingVertical: 4 }} onPress={() => {
                                    setListView(true)
                                }}>
                                    <Image style={{ height: 15, width: 15, resizeMode: 'contain', }} source={require('../../../assets/images/listwhite.png')}></Image>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setListView(!listView)
                                }}>
                                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', }} source={require('../../../assets/images/grid.png')}></Image>

                                </TouchableOpacity>

                            </View>
                        </View>
                        <ScrollView>

                        {
                            pointsOptionEnabled && neededHistory.includes("points") &&
                            <NavigateTO visibleTitle={t("points history")} title={"Points History"} discription={t("list of points redeemed by you")} image={require('../../../assets/images/coinStack.png')}></NavigateTO>
                        }
                              {/* {
                            true &&
                            <NavigateTO visibleTitle={t("Ledger")} title={"Ledger"} discription={t("all list of ledger by you")} image={require('../../../assets/images/ledger.png')}></NavigateTO>
                        } */}

                        {/* ozone change */}
                        {userData.user_type !== "dealer" && neededHistory.includes("scanned") &&  <NavigateTO visibleTitle={t("scanned history")} title={"Scanned History"} discription={t('list of products scanned by you')} image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>}
                        {neededHistory.includes("order") &&   <NavigateTO visibleTitle={t("Order history")} title="Order History" discription={t("list of products ordered by you")} image={require('../../../assets/images/OrderHistory.png')}></NavigateTO>}
                       
                      {neededHistory.includes("redeemed") &&   <NavigateTO visibleTitle={t("redeemed history")} title="Redeemed History" discription={t("list of products redeemed by you")} image={require('../../../assets/images/giftOpen.png')}></NavigateTO>}
                        { neededHistory.includes("cashback") &&<NavigateTO visibleTitle={t("cashback history")} title="Cashback History" discription={t("list of cashback claimed by you")} image={require('../../../assets/images/cashbackBlack.png')}></NavigateTO>}
                        {
                            // couponOptionEnabled &&
                            neededHistory.includes("coupon") &&
                            <NavigateTO visibleTitle={t("coupon history")} title="Coupon History" discription={t("list of coupons redeemed by you")} image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>
                        }
                        {/* {
                warrantyOptionEnabled &&  */}
                       { neededHistory.includes("warranty") && <NavigateTO visibleTitle = {t("warranty history")} title={"Warranty History"} discription={t("list of warranty claimed by you")} image={require('../../../assets/images/warranty_icon.png')}></NavigateTO>}
                        {/* } */}
                       
                        {
                            cashbackOptionEnabled && neededHistory.includes("cashback") &&
                            <NavigateTO visibleTitle={t("cashback history")} title="Cashback History" discription={t("list of cashback claimed by you")}  image={require('../../../assets/images/cashbackBlack.png')}></NavigateTO>
                        }

                        {
                            wheelOptionEnabled && neededHistory.includes("wheel") &&
                            <NavigateTO visibleTitle={t("wheel history")} title="Wheel History" discription="" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>

                        }
                        {
                            neededHistory.includes("shared") &&
                            pointSharing && <NavigateTO visibleTitle={t("shared point history")} title="Shared Point History" discription=" list of shared points recieved by you" image={require('../../../assets/images/shared_point.png')}></NavigateTO>
                        }
                        {neededHistory.includes("previousTransactions") &&  <NavigateTO visibleTitle={t("previous transaction history")} title="Previous Transaction History" discription=" Previous transaction done by you" image={require('../../../assets/images/coinStack.png')}></NavigateTO>}
                        </ScrollView>
                    </View>
                }

                {/* GridVIew */}
                {
                    !listView &&

                    <View style={{ width: '90%', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 20, marginTop: 20, alignItems: 'center' }}>

                        <View style={{ width: '100%', height: 50, flexDirection: "row", alignItems: "center", justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEEEEE' }}>
                            {(getPointSharingData?.body?.total !== "0") ? <PoppinsTextMedium style={{ color: ternaryThemeColor, fontWeight: 'bold',marginLeft:14,width:'70%'}} content={`Registration Bonus : ${getPointSharingData?.body?.data?.[0]?.points ? getPointSharingData?.body?.data?.[0]?.points + "Points" : "loading"} `}></PoppinsTextMedium >
                                : <PoppinsTextMedium style={{ fontWeight: 'bold',marginLeft:14}} content="What do you want to do ?"></PoppinsTextMedium>
                            }
                            <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'center',width:'20%'}}>

                                <TouchableOpacity style={{ backgroundColor: listView ? ternaryThemeColor : 'white', marginRight: 10 }} onPress={() => {
                                    setListView(true)
                                }}>
                                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../../assets/images/list.png')}></Image>

                                </TouchableOpacity>

                                <TouchableOpacity style={{ backgroundColor: ternaryThemeColor, borderWidth: 1, borderColor: ternaryThemeColor }}>
                                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', }} source={listView ? require('../../../assets/images/grid.png') : require('../../../assets/images/gridwhite.png')}></Image>

                                </TouchableOpacity>



                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                            {/* {
                                pointsOptionEnabled &&
                                <GridVIew title={t("points history")} discription=" list of points redeemed by you" image={require('../../../assets/images/coinStack.png')}></GridVIew>

                            } */}
                            {/* ozone change */}

                     

                            {/* <GridVIew title={t("Ledger")}  discription="all list of ledger by you" image={require('../../../assets/images/ledger.png')}></GridVIew> */}

                            {/* {userData.user_type !== "dealer" && <GridVIew title={t("scanned history")} discription="" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>} */}
                            <GridVIew title={t("Order history")}  discription=" list of products ordered by you" image={require('../../../assets/images/OrderHistory.png')}></GridVIew>
                            
                            <GridVIew title={t("redeemed history")}  discription=" list of products redeemed by you" image={require('../../../assets/images/giftOpen.png')}></GridVIew>
                            {/* <GridVIew title={t("cashback history")} discription=" list of cashback redeemed by you" image={require('../../../assets/images/cashbackBlack.png')}></GridVIew> */}
                            {/* {
                                couponOptionEnabled &&
                                <GridVIew title={t("Coupon History")} discription=" list of coupons redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>
                            } */}
                            {/* {
                warrantyOptionEnabled &&  */}
                            {/* <GridVIew title={t("warranty history")} discription=" list of warranty redeemed by you" image={require('../../../assets/images/warranty_icon.png')}></GridVIew> */}
                            {/* } */}
                           
                            {/* {
                                cashbackOptionEnabled &&
                                <GridVIew title={t("cashback history")} discription=" list of cashback redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>

                            } */}
                            {/* {
                                // couponOptionEnabled &&
                                <GridVIew title={t("Coupon History")} discription=" list of coupons redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>
                            } */}
                            {/* {
                                wheelOptionEnabled &&
                                <GridVIew title="Wheel History" discription=" list of wheel spinned by you" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>

                            } */}
                            {/* {
                                pointSharing && <GridVIew title="Shared Point History" discription=" list of shared points recieved by you" image={require('../../../assets/images/shared_point.png')}></GridVIew>
                            }
                            {neededHistory.includes("previousTransactions") && <GridVIew title={t("Previous Transaction History")} discription=" list of previous transaction done by you" image={require('../../../assets/images/coinStack.png')}></GridVIew>} */}

                        </View>
                    </View>
                }

                {/* ----------------------------------- */}
            </View>
            {/* modals */}

            {PlatinumModalOpen && <PlatinumModal isVisible={PlatinumModalOpen} onClose={closePlatinumModal} getActiveMembershipData={getActiveMembershipData} />}
            {error  && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
          navigateTo={navigateTo}
          ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          message={message}
          openModal={success}></MessageModal>
      )}
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    modalView: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 240,
      backgroundColor: 'white',
      borderTopRightRadius: 40,
      borderTopLeftRadius: 40,
  
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

export default Passbook;