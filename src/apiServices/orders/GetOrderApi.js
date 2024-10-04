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

          getOrderHistoryDateWise: builder.mutation({
            query: (params) => {
                console.log("getProductSubCategoryById",params)
              return {
                method: "POST",
                url: `/api/tenant/modenik/orders`,
                headers: {
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                body: params.body,    
              };
            },
          }),
          
          
          
        }),
        
   });
   
   export const {useGetOrderHistoryMutation, useGetOrderHistoryDateWiseMutation} = GetOrderApi;