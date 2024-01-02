"use client"

import { Box, Card, Divider, Space, Text } from "@mantine/core"
import { type Blog, type User } from "@prisma/client"
import Link from "next/link"

export default function MoreOwnerBlogs({ author, blogs }: { author: User | null, blogs: Blog[] | null }) {
    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size='xl'>More from <Text color="blue" component={Link} href={`/user/${author?.id}`}>{author?.name}</Text></Text>
                <Space h={20} />

                {blogs?.length === 0 && (
                    <Text size='lg'>No other blogs</Text>
                )}

                {blogs?.map((blog, index) => (
                    <>
                        <Box key={index}>
                            <Text component={Link} href={`/blog/${blog.id}`} sx={{ cursor: 'pointer' }} size='lg'>• {blog.title}</Text>
                            {index !== blogs.length - 1 && <Divider my='sm' />}
                        </Box>
                    </>
                ))}
            </Card>
        </>
    )
}