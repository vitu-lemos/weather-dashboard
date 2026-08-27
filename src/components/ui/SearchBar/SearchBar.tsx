"use client";

import { useCallback, useId, type ReactNode } from "react";
import AsyncSelect from "react-select/async";
import { components as rsComponents, type ControlProps } from "react-select";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./SearchBar.module.css";

function Control<T>({ children, ...props }: ControlProps<T, false>) {
  return (
    <rsComponents.Control {...props}>
      <Search
        size={18}
        className={styles.searchIcon}
        aria-hidden="true"
        data-testid="search-bar-icon"
      />
      {children}
    </rsComponents.Control>
  );
}

const DEFAULT_DEBOUNCE_MS = 300;

interface SearchBarProps<T> {
  value: T | null;
  onChange: (value: T | null) => void;
  onSearch: (term: string) => Promise<T[]>;
  onSelect: (value: T) => void;
  renderOptionLabel: (option: T) => ReactNode;
  getOptionValue: (option: T) => string;
  getOptionLabel: (option: T) => string;
  placeholder?: string;
  "aria-label"?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  autoFocus?: boolean;
  debounceMs?: number;
}

export function SearchBar<T>({
  value,
  onChange,
  onSearch,
  onSelect,
  renderOptionLabel,
  getOptionValue,
  getOptionLabel,
  placeholder,
  "aria-label": ariaLabel,
  isLoading,
  isDisabled,
  autoFocus,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: SearchBarProps<T>) {
  const instanceId = useId();

  const search = useCallback(
    (inputValue: string): Promise<T[]> => {
      const query = inputValue.trim();
      return query ? onSearch(query) : Promise.resolve([]);
    },
    [onSearch],
  );
  const loadOptions = useDebounce(search, debounceMs);

  return (
    <AsyncSelect<T>
      instanceId={instanceId}
      classNamePrefix="rs"
      className={styles.search}
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
      aria-live="polite"
      autoFocus={autoFocus}
      loadOptions={loadOptions}
      formatOptionLabel={renderOptionLabel}
      getOptionValue={getOptionValue}
      getOptionLabel={getOptionLabel}
      value={value}
      onChange={(option) => {
        onChange(option);
        if (option) onSelect(option);
      }}
      components={{ Control, DropdownIndicator: () => null, IndicatorSeparator: () => null }}
      isLoading={isLoading}
      isDisabled={isDisabled}
      isClearable={false}
    />
  );
}
