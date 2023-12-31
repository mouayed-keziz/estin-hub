"use client"

import { AspectRatio, Avatar, Badge, Box, Card, Divider, Group, Space, Stack, Text, Title } from "@mantine/core"
import Image from "next/image"
import { type Blog, type User } from "@prisma/client"
import Link from "next/link"
import BlogActions from "@/components/blog-page/blog-actions"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export default function BlogContent({ blog, author }: { blog: Blog | null, author: User | null }) {
    if (!blog) return null
    if (!author) return null

    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <AspectRatio ratio={16 / 9}>
                    <Image
                        fill
                        style={{ objectFit: "cover" }}
                        src={blog.image}
                        alt={blog.title}
                    />
                </AspectRatio>
                <Space h={20} />
                <Title >{blog?.title}</Title>
                <Space h={20} />
                <Group noWrap position="left">
                    <Avatar src={author?.image} color="primary" radius='xl' size='lg'>{author?.name?.charAt(0)}</Avatar>
                    <Stack spacing={0} align="start" justify="flex-start">
                        <Text color="blue" component={Link} href={`/user/${author.id}`} size='xl'>{author?.name}</Text>
                        <Text color='dimmed' size='md'>
                            • Posted on {blog?.createdAt.toLocaleDateString()} ({dayjs(blog?.createdAt).fromNow()})
                            <br />
                            {blog?.updatedAt.toLocaleDateString() !== blog?.createdAt.toLocaleDateString() && "• Updated on " + blog?.updatedAt.toLocaleDateString() + " (" + dayjs(blog?.updatedAt).fromNow() + ")"}
                        </Text>
                    </Stack>
                </Group>
                <Space h={20} />
                <Box sx={theme => ({ [theme.fn.largerThan("md")]: { display: "none" } })}>
                    <BlogActions blogId={blog.id} />
                </Box>
                <Group spacing='md' position="left">
                    {blog.tags.split(" ").filter((tag) => tag !== "").map((tag, index) => (
                        <Badge key={index} color="blue" variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </Group>
                <Space h={20} />

                <Divider py={10} />
                <Box dangerouslySetInnerHTML={{ __html: blog?.content ?? "" }} />
            </Card>
        </>
    )
}