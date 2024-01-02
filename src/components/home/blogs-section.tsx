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
    id: string;
    title: string;
    author: string;
    image: string;
    owner_role: "STUDENT" | "TEACHER" | "CLUB";
    author_id: string;
}

const blogs: Blog[] = [
    {
        id: "1",
        title: 'Norway Fjord Adventures',
        author: '@mouayed_keziz',
        image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        owner_role: 'STUDENT',
        "author_id": "1"
    },
    {
        id: "2",
        title: 'Norway Fjord Adventures',
        author: '@mouayed_keziz',
        image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        owner_role: 'TEACHER',
        "author_id": "2"
    },
    {
        id: "3",
        title: 'Norway Fjord Adventures',
        author: '@mouayed_keziz',
        image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        owner_role: 'CLUB',
        "author_id": "3"
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

            <Grid justify="center" >
                {blogs.map((blog) => (
                    <Grid.Col key={blog.title} span={12} xs={6} sm={6} md={4} lg={4}>
                        <BlogCard title={blog.title} author={blog.author} image={blog.image} owner_role={blog.owner_role} author_id={blog.author_id} id={blog.id} />
                    </Grid.Col>
                ))}
            </Grid>
        </>
    )
}