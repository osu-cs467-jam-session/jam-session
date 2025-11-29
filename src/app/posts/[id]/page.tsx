"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { IPost } from "@/types/post";

export default function PostPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [post, setPost] = useState<IPost | null>(null);

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

    if (!id) {
        return <div>Missing post id</div>;
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
                By {post.userName || post.userId} • {post.date ? (typeof post.date === 'string' ? new Date(post.date) : post.date).toLocaleDateString() : 'Unknown date'}
            </div>
            <div className="mb-4">{post.body}</div>
        </div>
    );
}
