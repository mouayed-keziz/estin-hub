'use client'

import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';


interface BlogCardProps {
    title: string;
    description: string;
    image: string;
    owner_role: string;
}

export default function BlogCard({ title, description, image, owner_role }: BlogCardProps) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={image}
                    height={160}
                    alt="Norway"
                />
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

            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                Read more
            </Button>
        </Card>
    );
}