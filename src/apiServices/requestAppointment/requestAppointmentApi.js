import {baseApi} from '../baseApi';
import { slug } from '../../utils/Slug';

export const requestAppointmentApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        requestAppointment: builder.mutation({
            query: (params) => {
                console.log(params)
                return {
                    method: "POST",
                    url: `/api/open/bookAp/add`,
                    headers: {
                        "Content-Type": "application/json",
                        
                        slug: slug,
                    },
                    body:params
                };
            },
        }),
    }),
});

export const {
    useRequestAppointmentMutation
} = requestAppointmentApi;