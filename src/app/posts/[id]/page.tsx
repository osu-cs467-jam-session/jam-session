"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { IPost } from "@/types/post";

export default function PostPage() {
    const params = useParams();
    const Id = params?.Id as string | undefined;
    const [post, setPost] = useState<IPost | null>(null);

    useEffect(() => {
        if (!Id) return;

        let mounted = true;

        fetch(`/api/posts/?id=${Id}`)
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
    }, [Id]);

    if (!Id) {
        return <div>Missing post id</div>;
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
                By {post.userName || post.userId} • {post.date ? new Date(post.date).toLocaleDateString() : 'Unknown date'}
            </div>
            <div className="mb-4">{post.body}</div>
        </div>
    );
}
