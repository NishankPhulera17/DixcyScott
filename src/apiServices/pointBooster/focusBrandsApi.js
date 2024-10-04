import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const GetFocusBrandsApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getFocusBrands: builder.mutation({
            query: (body) => {
                console.log("getFocusBrands",body)
              return {
                method: "GET",
                url: `/api/tenant/modenik/focus_brands?app_user_id=${body.appUserId}&month=${body.month}&year=${body.year}`,
                headers: {
                  "Content-Type": "application/json",
                  slug: slug,
                  Authorization: 'Bearer ' + body.token,

                },
              };
            },
          }),
    })
});


export const {useGetFocusBrandsMutation} = GetFocusBrandsApi

