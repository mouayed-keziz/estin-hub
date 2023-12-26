'use client'

import { Card, Image, Text, Badge, Button, Group, AspectRatio, Stack, Box } from '@mantine/core';


interface BlogCardProps {
    title: string;
    description: string;
    image: string;
    owner_role: string;
}

export default function BlogCard({ title, description, image, owner_role }: BlogCardProps) {
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

                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>{title}</Text>
                        <Badge color="pink" variant="light">
                            {owner_role}
                        </Badge>
                    </Group>

                    <Text size="sm" color="dimmed">
                        {description}
                    </Text>
                </Box>
                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                    Read more
                </Button>
            </Stack>
        </Card>
    );
}