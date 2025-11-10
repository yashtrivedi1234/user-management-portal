import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.escuelajs.co/api/v1",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          avatar: data.avatar || "https://i.imgur.com/6VBx3io.png",
          role: "customer",
        },
      }),
    }),
    getUser: builder.query({
      query: () => "/users/1",
    }),
  }),
});

export const { useRegisterUserMutation, useGetUserQuery } = api;
