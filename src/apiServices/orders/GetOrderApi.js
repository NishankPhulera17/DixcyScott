import { baseApi } from '../baseApi';
import {slug} from '../../utils/Slug';

export const GetOrderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrderHistory: builder.mutation({
            query: (params) => {
                console.log("getProductSubCategoryById",params)
              return {
                method: "GET",
                url: `/api/tenant/modenik/app/${params.appUserId}`,
                headers: {
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                
              };
            },
          }),
          
          
        }),
        
   });
   
   export const {useGetOrderHistoryMutation} = GetOrderApi;