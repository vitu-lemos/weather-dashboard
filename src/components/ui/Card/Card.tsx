import type { HTMLAttributes } from "react";
import styles from "./Card.module.css";
import { joinClassNames } from "@/helpers/classnames";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={joinClassNames(styles.card, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...rest }: CardProps) {
  return (
    <div className={joinClassNames(styles.header, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...rest }: CardProps) {
  return (
    <div className={joinClassNames(styles.title, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...rest }: CardProps) {
  return (
    <div className={joinClassNames(styles.content, className)} {...rest}>
      {children}
    </div>
  );
}
