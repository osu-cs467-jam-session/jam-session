"use client";
import { useAuth } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { IPost } from "@/types/post";
import type { IComment } from "@/types/comment";
import Comment from "@/components/Comment";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";

export default function PostPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [post, setPost] = useState<IPost | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);
    const [commentText, setCommentText] = useState<string>("");
    const [refreshReviews, setRefreshReviews] = useState(0);
    const [editingReview, setEditingReview] = useState<{ _id: string; rating: number; comment?: string } | null>(null);
    const { userId } = useAuth();

    useEffect(() => {
        if (!id) return;

        let mounted = true;

        fetch(`/api/posts/?id=${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("API response was not ok");
                return res.json();
            })
            .then((data) => {
                if (!mounted) return;
                console.log("Fetched post data:", data);
                setPost(data.data);
            })
            .catch((err) => {
                console.error("Error fetching post:", err);
            });

        return () => {
            mounted = false;
        };
    }, [id]);

    useEffect(() => {
        if (!id) return;

        let mounted = true;
        fetch(`/api/comments?parentId=${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("API response was not ok");
                return res.json();
            })
            .then((data) => {
                if (!mounted) return;
                console.log("Fetched comments for post:", data);
                setComments(data.data);
            })
            .catch((err) => {
                console.error("Error fetching comments for post:", err);
            });
        return () => {
            mounted = false;
        };
    }, [id]);

    async function handleAddComment() {
        if (!id) return;
        console.log("Comment: ", commentText, "user:", userId, "parent:", id);

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parentId: id,
                    userClerkId: userId || undefined, // Clerk ID (optional for anonymous)
                    comment: commentText,
                    date: new Date().toISOString(),
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to add comment');
            }
            // Update comments list
            console.log('Added comment:', data);
            setComments((prevComments) => [...prevComments, data.data]);

            // Reset comment text
            setCommentText("");
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    async function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        e.preventDefault();
        setCommentText(e.target.value);
    }

    const handleReviewCreated = () => {
        setRefreshReviews(prev => prev + 1);
        setEditingReview(null);
    };

    const handleReviewEdit = (review: { _id: string; rating: number; comment?: string }) => {
        setEditingReview(review);
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
    };

    if (!id) {
        return <div>Missing post id</div>;
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <section className="max-w-3xl mx-auto p-4 space-y-6">
            <div className="flex flex-col items-center justify-between mb-4">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="text-sm text-gray-500 mb-4">
                    By {post.userName || post.userId} • {post.date ? (typeof post.date === 'string' ? new Date(post.date) : post.date).toLocaleDateString() : 'Unknown date'}
                </div>
                <div className="mb-4">{post.body}</div>
            </div>

            <div className="border-t pt-6">
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <ReviewList key={refreshReviews} postId={id} onReviewEdit={handleReviewEdit} />
            </div>

            <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">
                    {editingReview ? 'Edit Review' : 'Leave a Review'}
                </h2>
                <ReviewForm 
                    postId={id} 
                    onReviewCreated={handleReviewCreated}
                    onReviewUpdated={handleReviewCreated}
                    onCancel={handleCancelEdit}
                    existingReview={editingReview || undefined}
                />
            </div>

            <div className="flex flex-col items-center mt-8 border-t pt-6">
                <h3 className="py-4">Comments</h3>
                <div className="flex flex-col justify-between min-w-3/4">
                    <textarea placeholder="Add comment here" className="p-5" onChange={(e) => handleTextChange(e)} />
                    <button className="text-xs p-1 self-end border-3 m-2 rounded-xs bg-gray-400 hover:text-blue-500" onClick={() => handleAddComment()}>Submit</button>
                </div>
                {
                    comments.length > 0 ? (
                        comments.map((c) => (
                            <Comment comment={c} key={String(c._id)} />
                        ))) : (
                        "No comments yet.")
                }
            </div>
        </section>
    );
}
