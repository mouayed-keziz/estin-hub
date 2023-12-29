'use client'

import { Button, Grid, Group, Title } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import Link from "next/link";
import BlogCard from "@/components/home/blog-card";


interface BlogCardProps {
    title: string;
    search_query: string;
}

interface Blog {
    title: string;
    author: string;
    image: string;
    owner_role: "STUDENT" | "TEACHER" | "CLUB";
}

const blogs: Blog[] = [
    {
        title: 'Norway Fjord Adventures',
        author: '@mouayed_keziz',
        image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        owner_role: 'STUDENT'
    },
    {
        title: 'Norway Fjord Adventures',
        author: '@mouayed_keziz',
        image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        owner_role: 'TEACHER'
    },
    {
        title: 'Norway Fjord Adventures',
        author: '@mouayed_keziz',
        image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        owner_role: 'CLUB'
    }
]

export default function BlogsSection({ title, search_query }: BlogCardProps) {
    return (
        <>
            <Group position='apart' align='center'>
                <Title mb='md' order={1}>
                    {title} :
                </Title>
                <Button radius="md" component={Link} href={search_query} leftIcon={<IconDots />} variant="light">
                    View all
                </Button>
            </Group>

            <Grid justify="center" grow>
                {blogs.map((blog) => (
                    <Grid.Col key={blog.title} span={12} md={6} lg={4}>
                        <BlogCard title={blog.title} author={blog.author} image={blog.image} owner_role={blog.owner_role} />
                    </Grid.Col>
                ))}
            </Grid>
        </>
    )
}