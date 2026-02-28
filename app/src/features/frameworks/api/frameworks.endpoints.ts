import { baseApi } from '@/shared/store/api/baseApi';
import type { FrameworkKey } from '../types';

export const frameworksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserFramework: builder.mutation<void, FrameworkKey>({
      query: (framework) => ({
        url: '/me',
        method: 'PATCH',
        body: { selected_framework: framework },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useUpdateUserFrameworkMutation,
} = frameworksApi;
