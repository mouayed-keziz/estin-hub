'use client'

import BlogsSection from "@/components/home/blogs-section";
import EventsTable from "@/components/home/events-table";
import Footer from "@/components/footer";
import Hero from "@/components/home/hero";
import Navbar from "@/components/navbar";
import { Container, Space } from "@mantine/core";

export default function Page() {
  return (
    <>
      <Space h={100} />

      <Container size='lg'>
        <Hero />
        {/* <Space h={100} />
        <EventsTable /> */}
        <Space h={100} />
        <BlogsSection title="Recent Blogs" search_query="/search?recent" />
        <Space h={100} />
        <BlogsSection title="Students Blogs" search_query="/search?student" />
        <Space h={100} />
        <BlogsSection title="Teachers Blogs" search_query="/search?teacher" />
      </Container>
      <Space h={100} />


    </>
  )
}