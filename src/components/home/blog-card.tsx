'use client'

import { Card, Image, Text, Button, Group, AspectRatio, Stack, Box } from '@mantine/core';
import BadgeWithRole from '@/components/badge-with-role';


interface BlogCardProps {
    title: string;
    author: string;
    image: string;
    owner_role: "STUDENT" | "TEACHER" | "CLUB";
}

export default function BlogCard({ title, author, image, owner_role }: BlogCardProps) {
    return (
        <Card sx={{ height: '100%' }} shadow="sm" padding="lg" radius="md" withBorder>

            <Stack justify="space-between" h='100%'>
                <Box>
                    <Card.Section>
                        <AspectRatio ratio={16 / 9} >
                            <Image
                                src={image}
                                alt="Norway"
                            />
                        </AspectRatio>
                    </Card.Section>

                    <Group position="apart" mt="md">
                        <Text weight={500}>{title}</Text>
                        <BadgeWithRole role={owner_role} />
                    </Group>

                    <Text size="sm" color="dimmed">
                        {author}
                    </Text>
                </Box>
                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                    Read more
                </Button>
            </Stack>
        </Card>
    );
}


