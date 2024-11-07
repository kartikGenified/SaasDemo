import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const AddQrApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        addQr : builder.mutation({
            query({token,requestData}){
                console.log(token,"and",requestData)
                return {
                    url:`api/tenant/qrScanHistory/add`,
                    method:'post',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${token}`,
                    },
                    body:JSON.stringify(requestData)
                    
                   
                }
            }
        }),
        fetchAllQrScanedList: builder.mutation({
            query: (body) => {
              return {
                method: "GET",
                url: `api/app/qrScanHistory/${body.query_params}`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + body.token,
                  slug: slug,
                },
              };
            },
          }),
    })
});


export const {useAddQrMutation,useFetchAllQrScanedListMutation} = AddQrApi

