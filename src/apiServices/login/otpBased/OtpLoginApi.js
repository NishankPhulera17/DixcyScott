import { baseApi } from "../../baseApi";
import { slug } from "../../../utils/Slug";

export const OtpLoginApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppLogin : builder.mutation({
            query({mobile,name,user_type_id,user_type,otp,fcm_token,app_version}){
                console.log("verifyOtpMutation", app_version)
                
                return {
                    url:`/api/app/userOtp/add`,
                    method:'post',
                    headers:{
                        "slug":slug,
                        "Content-Type": "application/json"
                    },
                    body:{
                        "mobile" : mobile,
                        "name":name,
                        "otp" : otp,
                        "user_type_id" : user_type_id,
                        "user_type" : user_type,
                        "fcm_token":fcm_token,
                        "app_version": app_version
                        
                    }
                    
                   
                }
            }
        }),
        getMPINLogin : builder.mutation({
            query({user_id,mpin}){
                
                return {
                    url:`/api/app/mpin/login`,
                    method:'post',
                    headers:{
                        "slug":slug,
                        "Content-Type": "application/json"
                    },
                    body:{
                        "user_id" : user_id,
                        "mpin":mpin,
                        
                        
                    }
                    
                   
                }
            }
        }),
        updateMpin : builder.mutation({
            query({mobile,mpin,token}){
                console.log("param pinnn", mobile, mpin)
                return {
                    url:`/api/app/mpin/forget`,
                    method:'post',
                    headers:{
                        "slug":slug,
                        Authorization: 'Bearer ' + token,
                        "Content-Type": "application/json"
                    },
                    body:{
                        "mobile" : mobile,
                        "mpin":mpin,
                        
                        
                    }
                    
                   
                }
            }
        })
    })
});


export const {useGetAppLoginMutation, useGetMPINLoginMutation, useUpdateMpinMutation} = OtpLoginApi

