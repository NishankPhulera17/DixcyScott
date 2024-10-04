import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const salesBoosterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getSalesBoosterOrder:builder.mutation({
            query: (params) => {
                return {
                method: "POST",
                url: `/api/tenant/modenik/app/scheme-info?app_user_id=${params.appUserID}&sb_id=${params.sb_id}&month=${params.month}&year=${params.year}`,
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + params.token,
                slug: slug,
                },
                };
                },
        }),

        getSalesBoosterFocusPoint:builder.mutation({
            query: (params) => {
                console.log("papappapappa", params)
                return {
                method: "GET",
                url: `/api/tenant/modenik/focus_brand?app_user_id=${params.appUserID}&sb_id=${params.sb_id}&month=${params.month}&year=${params.year}`,
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + params.token,
                slug: slug,
                },
                };
                },
        }),

        getAllSalesBooster: builder.mutation({
            query: (params) => {
                console.log("params of sales booster", params)
            return {
            method: "GET",
            url: `/api/tenant/modenik/scheme/${params.appUserID}?type=${params.type}&month=${params.month}&year=${params.year}`,
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + params.token,
            slug: slug,
            },
            };
            },
            }),
        checkSalesBooster: builder.mutation({
        query: (token) => {
        return {
        method: "GET",
        url: `/api/app/salesBooster/check`,
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        slug: slug,
        },
        };
        },
        })
        ,
        checkSalesBoosterOnEachScan: builder.mutation({
            query: (token) => {
                return {
                method: "GET",
                url: `/api/app/salesBooster/eachScan`,
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
                slug: slug,
                },
                };
                },
        }),
        claimSalesBooster : builder.mutation({
            
            query: (token) => {
                return {
                method: "POST",
                url: `/api/app/salesBooster/claim`,
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
                slug: slug,
                },
                };
                },
        })
    })
});

export const {useGetAllSalesBoosterMutation,useCheckSalesBoosterMutation,useCheckSalesBoosterOnEachScanMutation,useClaimSalesBoosterMutation,useGetSalesBoosterOrderMutation, useGetSalesBoosterFocusPointMutation} = salesBoosterApi;
