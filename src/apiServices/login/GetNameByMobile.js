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

          getUserExistance: builder.mutation({
            query: (body) => {
              // console.log("GETUSERDATA",body,`api/app/appUsersName${body.mobile ? ("?mobile="+body.mobile) : ""}${body.uid ? ("?uid="+body.uid) : ""}`)
              return {
                method: "POST",
                url: `api/tenant/modenik/app-user-check`,
                headers: {
                  "Content-Type": "application/json",
                  slug: slug,
                },
                body:{
                  user_id :body.user_id,
                  mobile :body.mobile
                }
              };
            },
          }),
          
    })
});

// POST api/tenant/modenik/app-user-check
// body {
//     user_id :
//     mobile :
// }


export const {useGetNameMutation, useGetUserExistanceMutation} = GetNameByMobile

