import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IProducts} from "../../models/Interfaces";
import {LIMIT} from '../../constants'

type FetchBaseQueryMeta = { request: Request; response?: Response }

export const productsApi = createApi({

    reducerPath: 'products/Api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3002',
    }),

    endpoints: build => ({

        getProducts: build.query({
            query: () => ({
                url: '/products',
            })
        }),
        getDetailProduct: build.query<IProducts, string>({
            query: (id: string) => ({
                url: `/products/${id}`,
            })
        }),
        getCategories: build.query({
            query: () => ({
                url: '/categories',
            })
        }),
        filterProductsByCategory: build.query({
            query: ({catName, pageNumber}) => ({
                url: `/products?${catName ? `category=${catName}` : ''}&_limit=${LIMIT}&_page=${pageNumber}`
            }),

            transformResponse(response: IProducts[], meta: FetchBaseQueryMeta) {
                return {data: response, totalCount: (meta.response?.headers.get('X-Total-Count'))}
            }
        }),

        getUser: build.query({
            query: ({email, password}) => ({
                // url: `/users?email=${email}${password ? '&password='+password : ''}`,
                url: `/users?email=${email}${password ? `&password=${password}` : ''}`,
            })
        }),

        addUser: build.mutation({
            query: (body) => ({
                url: `/users`,
                method: 'POST',
                body,
            })
        }),

        editBasket: build.mutation({
            query: (body) => ({
                url: `/users/${body.id}`,
                method: 'PATCH',
                body
            })
        }),

        addNewProduct: build.mutation({
            query: (body) => ({
                url: `/products`,
                method: 'POST',
                body
            })
        }),

        addNewCategory: build.mutation({
            query: (body) => ({
                url: `/categories`,
                method: 'POST',
                body
            })
        }),

        editProduct: build.mutation({
            query: (body) => ({
                url: `/products/${body.id}`,
                method: 'PATCH',
                body
            })
        }),

        editCategory: build.mutation({
            query: (body) => ({
                url: `/categories/${body.id}`,
                method: 'PATCH',
                body
            })
        }),

        searchTitle: build.query({
            query: ({title}) => ({
                url: `/products?title_like=${title}`,
            }),
        }),
    })
})
export const {
    useGetProductsQuery,
    useGetDetailProductQuery,
    useLazyGetDetailProductQuery,
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
    useFilterProductsByCategoryQuery,
    useLazyGetUserQuery,
    useAddUserMutation,
    useEditBasketMutation,
    useAddNewProductMutation,
    useAddNewCategoryMutation,
    useEditProductMutation,
    useEditCategoryMutation,
    useSearchTitleQuery,
} = productsApi