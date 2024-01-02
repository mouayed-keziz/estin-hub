'use client'

import BlogsSection from "@/components/home/blogs-section";
import Hero from "@/components/home/hero";
import { Container, Group, Loader, Space } from "@mantine/core";
import { api } from "@/trpc/react";

export default function Page() {
  const { data, isLoading, isSuccess } = api.blog.home_page_blogs.useQuery();
  return (
    <>
      <Space h={100} />
      <Container size='lg'>
        <Hero />
        {/* <Space h={100} />
        <EventsTable /> */}
        <Space h={100} />
        {isLoading && <Group position="center"><Loader size="xl" /></Group>}
        {isSuccess && (
          <>
            {data.recent_blogs.length !== 0 && <BlogsSection blogs={data.recent_blogs} title="Recent Blogs" search_query="/search?recent" />}
            <Space h={100} />
            {data.student_blogs.length !== 0 && <BlogsSection blogs={data.student_blogs} title="Students Blogs" search_query="/search?student" />}
            <Space h={100} />
            {data.teacher_blogs.length !== 0 && <BlogsSection blogs={data.teacher_blogs} title="Teachers Blogs" search_query="/search?teacher" />}
            <Space h={100} />
            {data.club_blogs.length !== 0 && <BlogsSection blogs={data.club_blogs} title="Club Blogs" search_query="/search?teacher" />}
          </>
        )}
      </Container>
      <Space h={100} />
    </>
  )
}