import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const skillApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSkill: build.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.orders],
    }),

    getAllSkills: build.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: [tagTypes.orders],
    }),

    updateSkill: build.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.orders],
    }),

    deleteSkill: build.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.orders],
    }),
  }),
});

export const {
  useCreateSkillMutation,
  useGetAllSkillsQuery,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillApi;
