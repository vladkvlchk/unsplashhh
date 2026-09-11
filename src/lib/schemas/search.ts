import { z } from "zod";

import { SEARCH_QUERY_MAX_LENGTH } from "@/constants/validation";

export const searchFormSchema = z.object({
  query: z.string().trim().min(1).max(SEARCH_QUERY_MAX_LENGTH),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
