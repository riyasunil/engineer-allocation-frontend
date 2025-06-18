import baseApi from "../api";

interface ChatbotQueryRequest {
  query: string;
}

interface ChatbotQueryResponse {
  query: string;
  parsedIntent: {
    skill: string | null;
    designation: string | null;
  };
  results: {
    id: string;
    name: string;
    email: string;
    experience: number;
    // optionally include skills / designation if returned
  }[];
}

export const chatbotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendChatbotQuery: builder.mutation<ChatbotQueryResponse, ChatbotQueryRequest>({
      query: (data) => ({
        url: "/chatbot",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSendChatbotQueryMutation } = chatbotApi;
