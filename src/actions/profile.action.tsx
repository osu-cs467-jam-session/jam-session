"use server";

export async function getUserProfile(username: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/${username}`, {
      cache: "no-store", // ensures fresh data every request
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("getUserProfile error:", error);
    return null;
  }
}
