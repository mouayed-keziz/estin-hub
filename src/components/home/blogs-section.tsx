'use client'

import { Button, Grid, Group, Title } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import Link from "next/link";
import BlogCard from "@/components/home/blog-card";



export default function BlogsSection({ title, search_query, blogs }: BlogCardProps) {
    return (
        <>
            <Group position='apart' align='center'>
                <Title mb='md' order={1}>
                    {title} :
                </Title>
                {/* <Button radius="md" component={Link} href={search_query} leftIcon={<IconDots />} variant="light">
                    View all
                </Button> */}
            </Group>

            <Grid>
                {blogs.map((blog) => (
                    <Grid.Col key={blog.title} span={12} xs={6} sm={6} md={4} lg={4}>
                        <BlogCard title={blog.title} author={blog.author.name ?? ""} image={blog.image} owner_role={blog.author.role} author_id={blog.createdById} id={blog.id} />
                    </Grid.Col>
                ))}
            </Grid>
        </>
    )
}