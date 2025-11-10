// import everything from React library
import React from 'react'

/*
Represents loading state for profile page.
Next.js uses this file when page is in loading state
*/
function loading() {
  return (
    // display message while profile page is being fetched or rendered
    <div>Loading profile...</div>
  )
}

export default loading