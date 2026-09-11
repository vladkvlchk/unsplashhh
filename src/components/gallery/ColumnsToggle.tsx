"use client";

import clsx from "clsx";

import { ColumnsIcon } from "@/components/icons/icons";
import { COLUMN_OPTIONS, type ColumnCount } from "@/constants/layout";

import styles from "./ColumnsToggle.module.scss";

interface ColumnsToggleProps {
  value: ColumnCount;
  onChange: (columns: ColumnCount) => void;
}

export function ColumnsToggle({ value, onChange }: ColumnsToggleProps) {
  return (
    <div className={styles.toggle} role="group" aria-label="Gallery columns">
      {COLUMN_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={clsx(styles.option, option === value && styles.active)}
          aria-pressed={option === value}
          aria-label={`${option} columns`}
          onClick={() => onChange(option)}
        >
          <ColumnsIcon count={option} />
        </button>
      ))}
    </div>
  );
}
