/*
A component that renders a filterable list of stories.
Filters appear at the top of the list, as tappable pills.
*/
"use client"

import React, { useState } from "react";
import Story, { StoryProps } from "./Story";
import { StoryTag } from "@/lib/types";
import FilterPill from "./FilterPill";

interface StoriesProps {
  stories: StoryProps[];
}


export default function Stories({ stories }: StoriesProps) {
  const [selectedTag, setSelectedTag] = useState<StoryTag | "All">("All");

  const sortedStories = [...stories].sort((a, b) => b.date.localeCompare(a.date));

  const filteredStories = selectedTag === "All"
    ? sortedStories
    : sortedStories.filter(story => story.tag === selectedTag);

  return (
    <div className="">
      <div className="pill-container overflow-x-scroll flex flex-row gap-2 mt-0 mb-8">
        <FilterPill
          active={selectedTag === "All"}
          onClick={() => setSelectedTag("All")}
        >
          All
        </FilterPill>
        {Object.values(StoryTag).map(tag => (
          <FilterPill
            key={tag}
            active={selectedTag === tag}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </FilterPill>
        ))}
      </div>
      {filteredStories.map(story => (
        <Story key={story.link} {...story} />
      ))}
    </div>
  );
}