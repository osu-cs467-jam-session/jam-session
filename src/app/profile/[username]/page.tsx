// import everything from React library
import React from 'react'

/*
Define asynchronous React Server Component named ProfilePage.
Receives 'params' object as a prop from Next.js routing,
where 'params.username' comes from dynamic route [username]
*/
async function ProfilePage({ params }: { params: { username: string } }) {
    // log route parameters to console for debugging purposes
    console.log("params:", params);
    // Test for loading.tsx; Can remove
    await new Promise((resolve) => setTimeout(resolve, 3000))
    // render placeholder for profile page
    return <div>Profile</div>;
}
export default ProfilePage;