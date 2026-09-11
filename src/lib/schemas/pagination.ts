import { z } from "zod";

import { DEFAULT_PAGE } from "@/constants/api";

export const pageParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .catch(DEFAULT_PAGE);

export function parsePageParam(value: unknown): number {
  return pageParamSchema.parse(value ?? DEFAULT_PAGE);
}
