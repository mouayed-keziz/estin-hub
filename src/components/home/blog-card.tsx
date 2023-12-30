'use client'

import { Card, Text, Button, Group, AspectRatio, Stack, Box, Avatar } from '@mantine/core';
import BadgeWithRole from '@/components/badge-with-role';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface BlogCardProps {
    id: string,
    title: string;
    author: string;
    image: string;
    author_id: string;
    owner_role: "STUDENT" | "TEACHER" | "CLUB";
}

export default function BlogCard({ id, title, author, image, owner_role, author_id }: BlogCardProps) {
    return (
        <Card sx={{ height: '100%' }} shadow="sm" padding="lg" radius="md" withBorder>

            <Stack justify="space-between" h='100%'>
                <Box>
                    <Card.Section mb="md" component={Link} href={`/blog/${id}`}>
                        <AspectRatio ratio={16 / 9} >
                            <Image
                                fill
                                style={{ objectFit: "cover" }}
                                src={image}
                                alt={title}
                            />
                        </AspectRatio>
                    </Card.Section>

                    <Text component={Link} href={`/blog/${id}`} weight={500}>{title}</Text>
                </Box>
                <Box>
                    <Group position="apart" mt="md" align='center'>
                        <Group spacing="xs" position="left" align='center'>
                            <Avatar color='blue' radius={"xl"} >{author.charAt(0)}</Avatar>
                            <Text size="sm" color="dimmed">
                                {author}
                            </Text>
                        </Group>

                        <BadgeWithRole role={owner_role} />
                    </Group>
                    <Button component={Link} href={`/blog/${id}`} variant="light" color="blue" fullWidth mt="md" radius="md">
                        Read more
                    </Button>
                </Box>
            </Stack>
        </Card>
    );
}


