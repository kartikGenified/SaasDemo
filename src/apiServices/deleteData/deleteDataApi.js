import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const deleteDataApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        deleteData : builder.mutation({
            query({token,id}){
                console.log(token,"and",id)
                return {
                    url:`api/app/delete/${id}`,
                    method:'delete',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${token}`,
                    },
                    
                    
                   
                }
            }
        }),
    })
})

export const {useDeleteDataMutation} = deleteDataApi
