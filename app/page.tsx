// this is app/page.tsx
// I'm making a placeholder home page:

import React from "react";
import ProfileHeader from "@/components/ProfileHeader";
import Stories from "@/components/Stories";
import getPosts from "./getPosts";

export default async function Home() {
  const posts = await getPosts();
  return (
    <>
      <ProfileHeader
        name="Tim Connors"
        description="Software Entrepreneur and Engineer"
      />

      <h2 className="mb-3">About</h2>
      <p>{"I've built two small businesses and two venture-backed startups. I like cerebral movies, EDM festivals, and cute dogs. Recently moved to New York City."}</p>

      <h2 className="mb-3">Projects</h2>

      <Stories stories={posts || []} />
    </>
  );
}
