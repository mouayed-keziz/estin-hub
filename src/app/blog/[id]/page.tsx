'use client'

import Navbar from "@/components/navbar"
import { ActionIcon, Anchor, AspectRatio, Avatar, Badge, Box, Card, Container, Divider, Grid, Group, Image, Space, Stack, Text, Textarea, Title } from "@mantine/core"
import { IconBookmark, IconMessageCircle, IconStar } from "@tabler/icons-react"

export default function BlogPage({ params }: { params: { id: string } }) {
    const id = params.id;
    return (
        <>
            <Navbar />
            <Space h={100} />

            <Container size='xl'>
                <Grid>
                    <Grid.Col span={1}>
                        <BlogActions />
                    </Grid.Col>
                    <Grid.Col span={7}>
                        <BlogContent />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <OwnerInfo />
                        <Space h={30} />
                        <MoreOwnerBlogs />
                    </Grid.Col>
                </Grid>
                <Divider my={50} />
                <BlogComments />
            </Container>
        </>
    )
}




function BlogContent() {
    return (
        <>
            <AspectRatio ratio={16 / 9}>
                <Image radius='lg' alt='blog name' src='https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80' />
            </AspectRatio>
            <Space h={20} />
            <Group position="left">
                <Avatar color="primary" radius='xl' size='lg'>M</Avatar>
                <Stack spacing={0} align="start" justify="flex-start">
                    <Text size='xl'>@keziz_mouayed</Text>
                    <Text color='dimmed' size='md'>Posted on Jul 4, 2021 • Updated on Sep 29, 2021</Text>
                </Stack>
            </Group>
            <Space h={20} />
            <Group spacing='xl' position="left">
                <Text size='xl'>Views 127</Text>
                <Text size='xl'>Saves 50</Text>
                <Text size='xl'>Rating 3.5/5</Text>
            </Group>
            <Space h={20} />
            <Title >Blog title</Title>
            <Space h={20} />
            <Group spacing='md' position="left">
                <Badge variant="filled">#tag1</Badge>
                <Badge variant="filled">#tag2</Badge>
                <Badge variant="filled">#tag3</Badge>
                <Badge variant="filled">#tag4</Badge>
            </Group>

            <Space h={20} />
            <Box>
                content
            </Box>
        </>
    )
}

function OwnerInfo() {
    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group position="left">
                    <Avatar color="primary" radius='xl' size='lg'>M</Avatar>
                    <Stack spacing='xs' align="start" justify="flex-start">
                        <Text size='xl'>@keziz_mouayed</Text>
                        <Badge color="priary">STUDENT</Badge>
                    </Stack>
                </Group>
                <Space h={20} />
                <Text size='lg'>this is my bio or some sort of description for myself</Text>
                <Space h={30} />
                <Stack>
                    <Text size='md'><b>email  :</b> m_keziz@estin.dz</Text>
                    <Text size='md'><b>level  :</b> 2CS</Text>
                    <Text size='md'><b>joined :</b> Sep 30, 2019</Text>
                </Stack>
            </Card>
        </>
    )
}

function MoreOwnerBlogs() {
    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size='xl'>more from <Anchor href='/user'>@keziz_mouayed</Anchor></Text>
                <Space h={20} />
                <Text sx={{ cursor: 'pointer' }} size='lg'>Blog title 1</Text>
                <Text color='dimmed' size='sm'>#tag1 #tag2 #tag3</Text>
                <Divider my='sm' />
                <Text sx={{ cursor: 'pointer' }} size='lg'>Blog title 2</Text>
                <Text color='dimmed' size='sm'>#tag1 #tag2 #tag3</Text>
                <Divider mt='sm' />
                <Text sx={{ cursor: 'pointer' }} size='lg'>Blog title 3</Text>
                <Text color='dimmed' size='sm'>#tag1 #tag2 #tag3</Text>
            </Card>
        </>
    )
}

function BlogActions() {
    return (
        <>
            <Stack align="center" justify="flex-start">
                <ActionIcon color="dark" size="xl" radius="xl">
                    <IconStar size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="dark" size="xl" radius="xl">
                    <IconMessageCircle size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="dark" size="xl" radius="xl">
                    <IconBookmark size="2.125rem" />
                </ActionIcon>
            </Stack>
        </>
    )
}

function BlogComments() {

    const OneComment = () => (
        <Grid mb={20}>
            <Grid.Col span={1} >
                <Group position="right" align="center">
                    <Avatar radius='xl' size='lg' color="primary">M</Avatar>
                </Group>
            </Grid.Col>
            <Grid.Col span={11}>
                <Textarea
                    size="md"
                    disabled
                    value='this is a comment'
                />
            </Grid.Col>
        </Grid>
    )

    return (
        <>
            <Title order={2}>
                Comments
            </Title>
            <Space h={20} />
            <Grid mb={40}>
                <Grid.Col span={1} >
                    <Group position="right" align="center">
                        <Avatar radius='xl' size='lg' color="primary">M</Avatar>
                    </Group>
                </Grid.Col>
                <Grid.Col span={11}>
                    <Textarea
                        placeholder="Your comment"
                        label="Your comment"
                        size="lg"

                    />
                </Grid.Col>
            </Grid>

            <OneComment />
            <OneComment />
            <OneComment />
            <OneComment />

        </>
    )
}