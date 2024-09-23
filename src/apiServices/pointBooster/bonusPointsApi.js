import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const GetBonusPointsApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getBonusPoints: builder.mutation({
            query: (body) => {
                console.log("getBasePoints",body)
              return {
                method: "GET",
                url: `/api/tenant/modenik/yearly_points?app_user_id=${body.appUserId}&month=${body.month}&year=${body.year}`,
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


export const {useGetBonusPointsMutation} = GetBonusPointsApi

