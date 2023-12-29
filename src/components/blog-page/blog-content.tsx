"use client"

import { AspectRatio, Avatar, Box, Card, Divider, Group, Image, Space, Stack, Text, Title } from "@mantine/core"
import { type Blog, type User } from "@prisma/client"
import Link from "next/link"


export default function BlogContent({ blog, author }: { blog: Blog | null, author: User | null }) {
    if (!blog) return null
    if (!author) return null

    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <AspectRatio ratio={16 / 9}>
                    <Image fit="cover" radius='lg' alt='blog name' src={blog.image as string} />
                </AspectRatio>
                <Space h={20} />
                <Group position="left">
                    <Avatar src={author?.image} color="primary" radius='xl' size='lg'>{author?.name?.charAt(0)}</Avatar>
                    <Stack spacing={0} align="start" justify="flex-start">
                        <Text color="blue" component={Link} href={`/user/${author.id}`} size='xl'>{author?.name}</Text>
                        <Text color='dimmed' size='md'>
                            Posted on {blog?.createdAt.toLocaleDateString()}
                            {blog?.updatedAt.toLocaleDateString() !== blog?.createdAt.toLocaleDateString() && " • Updated on " + blog?.updatedAt.toLocaleDateString()}
                        </Text>
                    </Stack>
                </Group>
                <Space h={20} />
                <Box sx={theme => ({ [theme.fn.largerThan("md")]: { display: "none" } })}>
                    {/* <BlogActions blogId={blog.id} /> */}
                </Box>
                <Space h={20} />
                <Title >{blog?.title}</Title>
                <Space h={20} />
                <Group spacing='md' position="left">
                </Group>

                <Divider py={10} />
                <Box dangerouslySetInnerHTML={{ __html: blog?.content ?? "" }} />
            </Card>
        </>
    )
}