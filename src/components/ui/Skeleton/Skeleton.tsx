import type { HTMLAttributes } from "react";
import { joinClassNames } from "@/helpers/classnames";
import styles from "./Skeleton.module.css";

type SkeletonProps = HTMLAttributes<HTMLSpanElement>;

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <span className={joinClassNames(styles.skeleton, className)} {...rest} />
  );
}
