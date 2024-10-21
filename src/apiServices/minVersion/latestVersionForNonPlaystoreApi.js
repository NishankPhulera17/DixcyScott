import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const latestVersionForNonPlaystoreApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        checkLatestVersionForNonPlaystoreApi : builder.mutation({
            query(){
                return {
                    url:`/api/tenant/in-app-update/check`,
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

