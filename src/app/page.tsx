// Home component for the main page
'use client';
import { set } from 'mongoose';
import React, { useState, useEffect } from 'react';
import Comments from '@/components/ui/Comments/comments';

interface IPost {
  _id: string; // MongoDB ObjectId
  userId: string; // Reference to User's ObjectId
  userName: string;
  title: string;
  body: string;
  date?: Date;
  tags?: string[];
}

export default function Home() {

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
  return (
    <section className="flex flex-col items-center justify-top text-center min-h-screen px-4 sm:px-20 gap-6">
      <header className="">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Jam Session</h1>
        <p className="text-lg">
          Connect with fellow musicians, share your audio clips, and find the perfect bandmates for your next jam session!
        </p>
      </header>
      <div id='postsContainer'>
        {posts.map((post) => (
          <div key={post._id} className="border rounded-sm p-4 mb-4 w-full max-w-2xl bg-primary-foreground">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-500">{new Date(post.date || '').toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">{post.userName}</p>
            </div>
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="mb-2">{post.body}</p>
            <div className="flex items-center justify-between gap-2">
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                  #{tag}
                </span>
              ))}
              <Comments parentId={post._id} />
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
