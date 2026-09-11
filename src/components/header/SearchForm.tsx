"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { SearchIcon } from "@/components/icons/icons";
import { ROUTES } from "@/constants/routes";
import { QUERY_PARAM } from "@/constants/search-params";
import { type SearchFormValues, searchFormSchema } from "@/lib/schemas/search";

import styles from "./SearchForm.module.scss";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get(QUERY_PARAM) ?? "";

  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: currentQuery },
  });

  useEffect(() => {
    reset({ query: currentQuery });
  }, [currentQuery, reset]);

  const onSubmit = ({ query }: SearchFormValues) => {
    const params = new URLSearchParams({ [QUERY_PARAM]: query });
    router.push(`${ROUTES.search}?${params.toString()}`);
  };

  return (
    <form
      className={styles.form}
      action={ROUTES.search}
      method="get"
      role="search"
      onSubmit={handleSubmit(onSubmit)}
    >
      <SearchIcon className={styles.icon} />
      <input
        {...register("query")}
        className={styles.input}
        type="search"
        placeholder="Search photos"
        autoComplete="off"
        aria-label="Search photos"
      />
    </form>
  );
}
