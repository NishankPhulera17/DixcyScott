//import liraries
import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Image } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import RNApkInstaller from "@dominicvonk/react-native-apk-installer";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import VersionCheck from "react-native-version-check";
import { TouchableOpacity } from "react-native";
import { useCheckLatestVersionForNonPlaystoreApiMutation } from "../../apiServices/minVersion/latestVersionForNonPlaystoreApi";
import { useCheckVersionSupportMutation } from "../../apiServices/minVersion/minVersionApi";
import { setAppVersion } from "../../../redux/slices/appUserSlice";

// create a component
const CheckUpdate = () => {
  const [
    checkLatestVersionFunc,
    {
      data: checkLatestVersionData,
      error: checkLatestVersionError,
      isLoading: checkLatestVersionIsLoading,
      isError: checkLatestVersionIsError,
    },
  ] = useCheckLatestVersionForNonPlaystoreApiMutation();

  const [
    getMinVersionSupportFunc,
    {
      data: getMinVersionSupportData,
      error: getMinVersionSupportError,
      isLoading: getMinVersionSupportIsLoading,
      isError: getMinVersionSupportIsError,
    },
  ] = useCheckVersionSupportMutation();

  const userData = useSelector(state => state.appusersdata.userData)

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
    
    const dispatch = useDispatch()

  const isConnected = useSelector((state) => state.internet.isConnected);

  let currentVersion = undefined;

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [startDownload, setStartDownload] = useState(false);
  const [message, setMessage] = useState("");
  const [minVersionSupport, setMinVersionSupport] = useState(false);
  const [currtVersion, setCurrVersion] = useState(false);


  const navigation = useNavigation();

  

  

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("lastFetchedOn");
        if (value !== null) {
          // value previously stored
          console.log("lastFetchedOn", value);
          lastFetchedApiOn = value;
        }
      } catch (e) {
        // error reading value
      }
    };
    getData();

    //uncoment this to start check for new update

    // getPermission()

    if (isConnected?.isConnected) {
      currentVersion = VersionCheck.getCurrentVersion();
      console.log("current version check", currentVersion);
      dispatch(setAppVersion(currentVersion));
      setCurrVersion(currentVersion)
    }


  }, []);

  useEffect(() => {
    if (getMinVersionSupportData) {
      console.log("getMinVersionSupportData", getMinVersionSupportData);
      if (getMinVersionSupportData.success) {
        setMinVersionSupport(getMinVersionSupportData?.body?.data);
        if (!getMinVersionSupportData?.body?.data) {
          // Alert.alert(
          //   "Kindly update the app to the latest version",
          //   "Your version of app is not supported anymore, kindly update",
          //   [
          //     {
          //       text: "Update",
          //       onPress: () =>
          //         Linking.openURL(
          //           "https://play.google.com/store/apps/details?id=com.genefied.modenik"
          //         ),
          //     },
          //   ]
          // );
        }
      } else {
        if (Object.keys(getMinVersionSupportData?.body)?.length == 0) {
          // Alert.alert(
          //   "Kindly update the app to the latest version",
          //   "Your version of app is not supported anymore, kindly update",
          //   [
          //     {
          //       text: "Update",
          //       onPress: () =>
          //         Linking.openURL(
          //           "https://play.google.com/store/apps/details?id=com.genefied.modenik"
          //         ),
          //     },
          //   ]
          // );
        }
      }
    } else if (getMinVersionSupportError) {
      // console.log("getMinVersionSupportError", getMinVersionSupportError)
    }
  }, [getMinVersionSupportData, getMinVersionSupportError]);

  useEffect(() => {
    if (checkLatestVersionData) {
      console.log(
        "checkLatestVersionData",
        checkLatestVersionData,
        currtVersion
      );
      setMessage("Checking....");
      const latestVersion = checkLatestVersionData?.body?.version;
      const uri = checkLatestVersionData?.body?.url;
      if (latestVersion > currtVersion) {
        getPermission(uri);  //uncommment this
      }
      else{
        setMessage("Your app is up to date")
      }
    } else if (checkLatestVersionError) {
      console.log("checkLatestVersionError", checkLatestVersionError);
      setMessage(""+checkLatestVersionError?.data.message);
    }
  }, [checkLatestVersionData, checkLatestVersionError]);

  const getPermission = async (uri) => {
    if (Platform.OS === "ios") {
    } else {
      try {
        setStartDownload(true);
        setMessage("Downloading.. Plese wait!");
        actualDownload(uri);
      } catch (err) {
        setMessage("Error!");

        console.log("display error", err);
      }
    }
  };

  useEffect(() => {
    if (currentVersion) {
      // console.log("currentVersion", currentVersion, userData/user_type);
      let params = { 
        user_type : userData?.user_type ? userData?.user_type  : "retailer"
      }
      currentVersion && getMinVersionSupportFunc(currentVersion);
      currentVersion && checkLatestVersionFunc(params);
    }
  }, [currentVersion]);

  const ShowDownloadProgress = ({ downloadProgress }) => {
    return (
      <View style={{}}>
        {/* <Text style={styles.header}>Updating Application</Text> */}
        <Text style={styles.text}>
           Progress: {(downloadProgress * 100).toFixed(2)}%
        </Text>
        {Platform.OS === "android" ? (
          <Progress.Bar
            color={ternaryThemeColor}
            progress={downloadProgress}
            width={300}
          />
        ) : (
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressFill, { width: `${downloadProgress}%` }]}
            />
          </View>
        )}
        {downloadProgress === 100 && (
          <Text style={styles.completeText}>Download Complete!</Text>
        )}
      </View>
    );
  };

  const actualDownload = (url) => {
    const { dirs } = ReactNativeBlobUtil.fs;
    const dirToSave =
      Platform.OS === "ios" ? dirs.DocumentDir : dirs.DownloadDir;


    const configfb = {
      
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: "app-release.apk",
        // path: `${dirToSave}/app-release.apk`,
      },
      // path: `${dirToSave}/app-release.apk`,
    };

    const configOptions = Platform.select({
      ios: configfb,
      android: configfb,
    });

    console.log("Saving file to directory", dirToSave,configOptions);

    try{
      ReactNativeBlobUtil.config(configOptions)
      .fetch(
        "GET",
        url,
       
        
      )
      .progress((received, total) => {
        console.log("progress", received / total);
        setDownloadProgress(received / total);
      })
        .then(res => {
            if (Platform.OS === 'ios') {
                ReactNativeBlobUtil.fs.writeFile(configfb.path, res.data, 'base64');
                ReactNativeBlobUtil.ios.previewDocument(configfb.path);
            }
            if (Platform.OS === 'android') {
                console.log("Response from file download", JSON.stringify(res));
                console.log("File downloaded");
                const filePath = res.path(); // Use res.path() to get the actual path
                console.log("path of response", filePath) 
                setStartDownload(false)
                RNApkInstaller.install(filePath);
            }
        })
        .catch(e => {
            console.log('Invoice Download Error==>', e);
        });
    }
    catch(e)
    {
      console.log("big problem in downloading the file from the internet",e)
    }
    
};
  return (
    <View style={styles.container}>
      <View
        style={{
          height: 60,
          width: "100%",
          backgroundColor: ternaryThemeColor,
          justifyContent: "center",
          position: "absolute",
          top: 0,
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            navigation.goBack(); // Navigate back when back button is pressed
          }}
        >
          <Image
            style={{ height: 25, width: 25, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
      </View>
      <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>
        {""+ message}
      </Text>
      <View style={{}}>
      {startDownload  && (
        <ShowDownloadProgress downloadProgress={downloadProgress} />
      )}
      </View>
    
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
    color:'black',
    alignSelf:'center'
  },
  progressBar: {
    width: "100%",
    height: 20,
    marginVertical: 10,
  },
  progressContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "#e0e0df",
    borderRadius: 5,
    marginVertical: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b5998", // Change to desired color
    borderRadius: 5,
  },
  completeText: {
    marginTop: 10,
    fontSize: 16,
    color: "#28a745", // Green color for success message
  },
});

//make this component available to the app
export default CheckUpdate;
