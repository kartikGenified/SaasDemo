import {baseApi} from '../baseApi';
import { slug } from '../../utils/Slug';

export const fetchAllPushNotificationDumpListByAppUserId = baseApi.injectEndpoints({
    endpoints: builder => ({
        fetchAllPushNotificationDumpListByAppUserId: builder.mutation({
            query: (params) => {
                return {
                    method: "GET",
                    url: `/api/tenant/push-notification/app-user/${params.app_user_id}?limit=${params.limit}&offset=${params.offset}`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + params.token,
                        slug: slug,
                    },
                };
            },
        }),
    }),
});

export const {
    useFetchAllPushNotificationDumpListByAppUserIdMutation
} = fetchAllPushNotificationDumpListByAppUserId;