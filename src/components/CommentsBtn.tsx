 'use client'

import { useEffect, useState } from "react";

interface CommentsProps {
  parentId: string;
}

export default function CommentsBtn({ parentId }: CommentsProps) {
  const [numOfComments, setNumOfComments] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    // use reviews api for now since reviews are the visible feedback on posts
    fetch("/api/reviews?postId=" + parentId)
      .then((res) => {
        if (!res.ok) throw new Error("API response was not ok");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setNumOfComments(Array.isArray(data.data) ? data.data.length : 0);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
        if (!cancelled) setNumOfComments(0);
      });

    return () => {
      cancelled = true;
    };
  }, [parentId]);

  const label =
    numOfComments === null ? "Comments: …" : `Comments: ${numOfComments}`;

  return (
    <div
      className="text-md text-accent bg-secondary-foreground sidebar-border
        px-2 py-1 rounded-md hover:text-chart-1 hover:bg-sidebar-ring cursor-pointer transition-colors duration-100"
    >
      {label}
    </div>
  );
}