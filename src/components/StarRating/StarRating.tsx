import React, { useState } from "react";
import { Star } from "lucide-react";
import styles from "./StarRating.module.css";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

export const StarRating = ({ value, onChange }: StarRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = hovered !== null ? star <= hovered : star <= value;
          const isHovered = hovered !== null && star <= hovered;

          return (
            <Star
              key={star}
              className={`${styles.star} ${isActive ? styles.active : ""} ${isHovered ? styles.hovered : ""}`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onChange(star)}
              strokeWidth={1}
            />
          );
        })}
      </div>
      <div className={styles.caption}>Оцените сотрудничество с репетитором</div>
    </div>
  );
};
