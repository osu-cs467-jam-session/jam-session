// Home component for the main page
'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import Comments from '@/components/CommentsBtn';
import PostForm from '@/components/PostForm';
import PostList, { type PostListRef } from '@/components/PostList';
import type { IPost } from '@/types/post';

export default function Home() {
  const router = useRouter();
  const postListRef = useRef<PostListRef>(null);
  // Set state for posts
  const [posts, setPosts] = useState<Array<IPost>>([]);

  useEffect(() => {
    // Fetch posts
    const targetUrl = '/api/posts';
    fetch(targetUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error('API response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched posts:', data);
        setPosts(data.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handlePostCreated = async () => {
    // Refresh both the old posts list and the new PostList component
    await postListRef.current?.refresh();
    // Also refresh the old posts state
    const targetUrl = '/api/posts';
    fetch(targetUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error('API response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  };

  return (
    <section className="flex flex-col items-center justify-top text-center min-h-screen px-4 sm:px-20 gap-6">
      <header className="">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Jam Session</h1>
        <p className="text-lg">
          Connect with fellow musicians, share your audio clips, and find the perfect bandmates for your next jam session!
        </p>
      </header>

      {/* Post Creation Form */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-left">Create a Post</h2>
        <PostForm onPostCreated={handlePostCreated} />
      </div>

      {/* Posts List - Using PostList component */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-left">Recent Posts</h2>
        <PostList ref={postListRef} />
      </div>

      {/* Legacy posts display (keeping for compatibility)
      <div id='postsContainer' className="w-full max-w-2xl">
        {posts.map((post) => (
          <div key={post._id} className="border rounded-sm p-4 mb-4 w-full bg-primary-foreground">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-500">{new Date(post.date || '').toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">{post.userName || post.userId}</p>
            </div>
            <h2 onClick={() => handleClick(post._id)} className="text-2xl font-semibold mb-2 cursor-pointer hover:text-blue-200 transition-colors duration-100">{post.title}</h2>
            <div className="flex items-center justify-between gap-2">
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                  #{tag}
                </span>
              ))}
              <Comments parentId={post._id} clickFn={handleClick} />
            </div>
          </div>
        ))}
      </div>
       */}
    </section>
  );
}
