"use client";

import { type ROLE } from "@prisma/client";
import BlogCard from "@/components/home/blog-card";
import { Grid, Title } from "@mantine/core";

interface UserBlogProps {
    message: string,
    blogs: {
        id: string;
        title: string;
        image: string;
        author: string | null;
        author_img: string | null;
        role: ROLE;
        author_id: string
    }[] | undefined
}
export default function UserBlogs({ blogs, message }: UserBlogProps) {
    return (
        <>
            {blogs?.length === 0 && <Title w="100%" my="xl" order={1} align="center">{message}</Title>}
            {blogs?.map((blog) => (
                <Grid.Col key={blog.id} span={12} md={6}>
                    <BlogCard author_img={blog.author_img} author_id={blog.author_id} id={blog.id} author={blog.author ?? ""} image={blog.image} owner_role={blog.role} title={blog.title} />
                </Grid.Col>
            ))}
        </>
    );
}