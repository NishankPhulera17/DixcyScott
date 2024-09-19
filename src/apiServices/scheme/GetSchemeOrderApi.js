import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const GetSchemeOrderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSchemeOrder: builder.mutation({
        query: (params) => {
        return {
        method: "GET",
        url: `/api/tenant/modenik/app/scheme-info?app_user_id=${params.appUserId}&sb_id=${params.salesBoosterId}&month=${params.month}&year=${params.year}`,
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + params.token,
        slug: slug,
        },
        };
        },
        }),
        
    })
});

export const {useGetSchemeOrderMutation} = GetSchemeOrderApi;
