import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.escuelajs.co/api/v1",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => {
        const body = {
          name: data.name,
          email: data.email,
          password: data.password,
          avatar: data.avatar || "https://i.imgur.com/6VBx3io.png",
          role: "customer",
        };

        // Debug: log the outgoing request body to trace special-character issues
        console.log("[API] registerUser body:", body);

        return {
          url: "/users",
          method: "POST",
          body,
        };
      },
    }),
    getUser: builder.query({
      query: () => "/users/1",
    }),
  }),
});

export const { useRegisterUserMutation, useGetUserQuery } = api;
