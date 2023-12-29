"use client"

import { Avatar, Card, Group, Space, Stack, Text } from "@mantine/core";
import { type User } from "@prisma/client";
import BadgeWithRole from "@/components/badge-with-role";
import Link from "next/link";

export default function OwnerInfo({ author }: { author: User | null }) {
    if (!author) return (null)
    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group position="left">
                    <Avatar src={author?.image} color="primary" radius='xl' size='lg'>{author?.name?.charAt(0)}</Avatar>
                    <Stack spacing='xs' align="start" justify="flex-start">
                        <Text size='xl' color="blue" component={Link} href={`/user/${author?.id}`}>{author?.name}</Text>
                        <BadgeWithRole role={author?.role ?? "STUDENT"} />
                    </Stack>
                </Group>
                <Space h={20} />
                {author.bio && <Text size='lg'><b> BIO  :</b>{author.bio}</Text>}
                <Space h={30} />
                <Stack>
                    {author.email && <Text size='md'><b> email  :</b> {author.email}</Text>}
                    {author.level && <Text size='md'><b> level  :</b> {author.level}</Text>}
                    <Text size='md'><b>joined :</b> TODO</Text>
                    {/* {author.createdAt && <Text size='md'><b>joined :</b> {author.createdAt.toLocaleString()}</Text>} */}
                </Stack>
            </Card>
        </>
    )
}