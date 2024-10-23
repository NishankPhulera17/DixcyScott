import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const latestVersionForNonPlaystoreApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        checkLatestVersionForNonPlaystoreApi : builder.mutation({
            query(params){
                return {
                    url:`/api/tenant/in-app-update/check?user_type=${params.user_type}`,
                    method:'post',
                    headers:{
                        "slug":slug,
                        "Content-Type": "application/json"
                    },
                    
                    
                   
                }
            }
        })
    })
});


export const {useCheckLatestVersionForNonPlaystoreApiMutation} = latestVersionForNonPlaystoreApi

