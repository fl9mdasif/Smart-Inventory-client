import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const ProductApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProduct: build.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.products],
    }),

    getAllProducts: build.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: [tagTypes.products],
    }),

    getSingleProduct: build.query({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "GET",
      }),
    }),

    updateProduct: build.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.products],
    }),

    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.products],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductApi;
