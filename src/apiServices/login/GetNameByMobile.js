import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const GetNameByMobile = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getName: builder.mutation({
            query: (body) => {
              console.log("GETUSERDATA",body,`api/app/appUsersName${body.mobile ? ("?mobile="+body.mobile) : ""}${body.uid ? ("?uid="+body.uid) : ""}`)
              return {
                method: "GET",
                url: `api/app/appUsersName${body.mobile ? ("?mobile="+body.mobile) : ""}${body.uid ? ("?uid="+body.uid) : ""}`,
                headers: {
                  "Content-Type": "application/json",
                  slug: slug,
                },
              };
            },
          }),
    })
});


export const {useGetNameMutation} = GetNameByMobile

