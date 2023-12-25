'use client'

import EventsTable from "@/components/events-table";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { Container, Space } from "@mantine/core";

export default function Page() {
  return (
    <>
      <Navbar />
      <Space h={100} />

      <Container>
        <Hero />
        <Space h={100} />
        <EventsTable />
      </Container>


    </>
  )
}