"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { IPost } from "@/types/post";
import type { IComment } from "@/types/comment";
import Comment from "@/components/Comment";

export default function PostPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [post, setPost] = useState<IPost | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);

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

    async function handleAddComment(text: string) {
        if (!id) return;

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parentId: id,
                    text,
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to add comment');
            }
            // Update comments list
            setComments((prevComments) => [...prevComments, data.data]);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    if (!id) {
        return <div>Missing post id</div>;
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <section className="max-w-3xl mx-auto p-4 ">
            <div className="flex flex-col items-center justify-between mb-4">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="text-sm text-gray-500 mb-4">
                    By {post.userName || post.userId} • {post.date ? (typeof post.date === 'string' ? new Date(post.date) : post.date).toLocaleDateString() : 'Unknown date'}
                </div>
                <div className="mb-4">{post.body}</div>
            </div>
            <div className="flex flex-col items-center mt-8 border pt-4 p-8">
                <button className="text-xs p-1 self-end border-3 rounded-xs bg-gray-400 hover:shadow-cyan hover:shadow-2xs"
                    onClick={() => {
                        const text = prompt("Enter your comment:");
                        if (text) {
                            // Here you would typically send the new comment to the server
                            console.log("New comment submitted:", text);
                            handleAddComment(text);
                        }
                    }}
                >Add Comment +</button>
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
