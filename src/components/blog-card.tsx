'use client'

import { Card, Image, Text, Badge, Button, Group, AspectRatio, Stack, Box } from '@mantine/core';


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


function BadgeWithRole({ role }: { role: "STUDENT" | "TEACHER" | "CLUB" }) {

    const color = {
        "STUDENT": "blue",
        "TEACHER": "pink",
        "CLUB": "green"
    }
    return (
        <>
            <Badge color={color[role]} variant="light">
                {role}
            </Badge>
        </>
    );
}