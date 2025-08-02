import React from "react";
import { Star } from "lucide-react";
import styles from "./ReviewItem.module.css";
import { Review } from "@/types/types";

type ReviewItemProps = {
  review: Review;
};

export const ReviewItem = ({ review }: ReviewItemProps) => {
  const name = review.name || "Неизвестный пользователь";
  const createdAt = new Date(review.createdAt).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.reviewItem}>
      <div className={styles.header}>
        <div className={styles.name}>{name}</div>
        <div className={styles.date}>{createdAt}</div>
      </div>

      <div className={styles.rating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${styles.star} ${star <= review.rating ? styles.active : ""}`}
            strokeWidth={1}
          />
        ))}
      </div>

      {review.message && <div className={styles.message}>{review.message}</div>}
    </div>
  );
};
