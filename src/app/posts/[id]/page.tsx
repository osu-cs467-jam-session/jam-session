"use client";
import { useAuth } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { IPost } from "@/types/post";
import type { IComment } from "@/types/comment";
import Comment from "@/components/Comment";

import AudioPlayer from "@/components/AudioPlayer";       
import { fetchAudioUpload } from "@/lib/api/client";       

export default function PostPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [post, setPost] = useState<IPost | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);
    const [commentText, setCommentText] = useState<string>("");
    const [audioUrl, setAudioUrl] = useState<string | null>(null); 
    const [loadingAudio, setLoadingAudio] = useState(false);      

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

    useEffect(() => {
        if (!post?.audioUploadId) return;  

        const audioId = post.audioUploadId.toString(); 

        let mounted = true;

        async function loadAudio() {
        setLoadingAudio(true);

        try {
            const audio = await fetchAudioUpload(audioId);
            if (!mounted) return;

            setAudioUrl(audio.url || null);
        } catch (err) {
            console.error("Error loading audio:", err);
        } finally {
            if (mounted) setLoadingAudio(false);
        }
        }

        loadAudio();

        return () => {
        mounted = false;
        };
    }, [post?.audioUploadId]);
    // ========================================================================
    
  
  
  

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

                {loadingAudio && (
                <p className="text-sm text-gray-500 mb-3">Loading audio…</p> 
                )}

                {!loadingAudio && audioUrl && (
                <div className="mb-6">
                    <AudioPlayer url={audioUrl} /> 
                </div>
                )}

                <div className="mb-4">{post.body}</div>
            </div>
            <div className="flex flex-col items-center mt-8 border pt-4 p-8">
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
