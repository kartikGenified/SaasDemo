import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const GetForms = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getForm : builder.mutation({
            query({form_type,token}){
                console.log(token,"and formId is",form_type)
                return {
                    method: "GET",
                    url: `/api/app/formTemplate/tenant/?form_type=${form_type}`,
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token,
                      slug: slug,
                    },
            }
        }
        }),
        getFormAccordingToAppUserType :builder.mutation({
            query: (params) => {
                return {
                    method: 'GET',
                    url: `api/admin/vendorTheme/form/${slug}/${params.AppUserType}`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }}
        }),
        getFormAccordingToAppUserTypeFormId :builder.mutation({
            query: (params) => {
                console.log("getFormAccordingToAppUserTypeFormId",params)
                return {
                    method: 'GET',
                    url: `api/admin/vendorTheme/form/${slug}/${params.AppUserType}/${params.formId}`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }}
        }),
    })
});


export const {useGetFormMutation,useGetFormAccordingToAppUserTypeMutation,useGetFormAccordingToAppUserTypeFormIdMutation} = GetForms

