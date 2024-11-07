import { baseApi } from "../baseApi";

export const AppThemeApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppThemeData : builder.mutation({
            query(clientName){
                console.log("client name". clientName)
                return {
                    url:`/api/admin/vendorTheme/${clientName}`,
                    method:'get',
                    headers:{"Content-Type": "application/json"},
                    
                   
                }
            }
        })
    })
});


export const {useGetAppThemeDataMutation} = AppThemeApi

