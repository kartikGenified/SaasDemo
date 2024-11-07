
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { BaseUrl } from '../utils/BaseUrl'
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: BaseUrl }),
    endpoints: () => ({
      
      }),
    })
  
    
    
    
    // https://saas.genefied.in/
    // http://saas-api-dev.genefied.in/