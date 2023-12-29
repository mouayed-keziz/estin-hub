"use client"

import { Avatar, Card, Group, Space, Stack, Text } from "@mantine/core";
import { type User } from "@prisma/client";
import BadgeWithRole from "@/components/badge-with-role";
import Link from "next/link";

export default function OwnerInfo({ author }: { author: User | null }) {
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
                <Text size='lg'><b>BIO  :</b> TODO</Text>
                <Space h={30} />
                <Stack>
                    <Text size='md'><b>email  :</b> {author?.email}</Text>
                    <Text size='md'><b>level  :</b> TODO</Text>
                    <Text size='md'><b>joined :</b> TODO</Text>
                </Stack>
            </Card>
        </>
    )
}