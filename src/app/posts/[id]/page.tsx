"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { IPost } from "@/types/post";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";

import AudioPlayer from "@/components/AudioPlayer";
import { fetchAudioUpload } from "@/lib/api/client";

export default function PostPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [post, setPost] = useState<IPost | null>(null);
    const [refreshReviews, setRefreshReviews] = useState(0);
    const [editingReview, setEditingReview] = useState<{ _id: string; rating: number; comment?: string } | null>(null);

    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loadingAudio, setLoadingAudio] = useState(false);

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
                setPost(data.data);
            })
            .catch(() => {});

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
            } catch {}
            finally {
                if (mounted) setLoadingAudio(false);
            }
        }

        loadAudio();

        return () => {
            mounted = false;
        };
    }, [post?.audioUploadId]);

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

            <div className="border-t pt-6">
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <ReviewList 
                    key={refreshReviews}
                    postId={id}
                    onReviewEdit={handleReviewEdit}
                />
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
        </section>
    );
}
