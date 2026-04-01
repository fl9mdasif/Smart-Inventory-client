import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.orders],
    }),

    getAllOrders: build.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: [tagTypes.orders],
    }),

    updateOrder: build.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.orders],
    }),

    deleteOrder: build.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.orders],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
