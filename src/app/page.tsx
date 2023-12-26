'use client'

import BlogsSection from "@/components/blogs-section";
import EventsTable from "@/components/events-table";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { Container, Space } from "@mantine/core";

export default function Page() {
  return (
    <>
      <Navbar />
      <Space h={100} />

      <Container size='lg'>
        <Hero />
        <Space h={100} />
        <EventsTable />
        <Space h={100} />
        <BlogsSection title="Recent Blogs" search_query="/search?recent" />
        <Space h={100} />
        <BlogsSection title="Students Blogs" search_query="/search?student" />
        <Space h={100} />
        <BlogsSection title="Prof Blogs" search_query="/search?prof" />
      </Container>


    </>
  )
}