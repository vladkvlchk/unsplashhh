"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { registerUser } from "@/app/register/actions";
import {
  type RegisterFormValues,
  registerFormSchema,
} from "@/lib/schemas/register";

import styles from "./RegisterForm.module.scss";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    const result = await registerUser(values);

    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input
          {...register("name")}
          id="name"
          className={styles.input}
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && (
          <p className={styles.fieldError}>{errors.name.message}</p>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          className={styles.input}
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && (
          <p className={styles.fieldError}>{errors.email.message}</p>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          className={styles.input}
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && (
          <p className={styles.fieldError}>{errors.password.message}</p>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          {...register("confirmPassword")}
          id="confirmPassword"
          className={styles.input}
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
        />
        {errors.confirmPassword && (
          <p className={styles.fieldError}>{errors.confirmPassword.message}</p>
        )}
      </div>
      {serverError && (
        <p className={styles.serverError} role="alert">
          {serverError}
        </p>
      )}
      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Join"}
      </button>
    </form>
  );
}
