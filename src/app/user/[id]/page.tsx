"use client";

import { api } from "@/trpc/react";
import { Avatar, Box, Button, Card, Container, Grid, Group, Loader, SegmentedControl, Space, Stack, Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import BadgeWithRole from "@/components/badge-with-role";
import UserBlogs from "@/components/user-page.tsx/my-blogs";
import { useState } from "react";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";

dayjs.extend(relativeTime)

export default function UserPage({ params }: { params: { id: string } }) {
    const session = useSession();
    const { data, isLoading } = api.user.get_user_by_id.useQuery({ id: params.id })

    const [segment, setSegment] = useState<string>("published-blogs")
    return (
        <>
            {isLoading && <Group h="80vh" position="center"><Loader size="xl" /></Group>}
            {data?.message === "failed" && <Group h="80vh" position="center"><Title order={1} align="center">USER Not Found</Title></Group>}
            {data?.message === "success" && (
                <Container mt="xl" size={"lg"}>
                    <Card shadow="sm" withBorder h="100%">
                        <Stack w="100%" h="100%" justify="start" align="center">
                            <Group w="100%" noWrap position="center" align="center">
                                <Avatar src={data.user?.image} radius="100%" color="blue" size={100}>{data.user?.name?.charAt(0)}</Avatar>
                            </Group>
                            <BadgeWithRole role={data.user?.role ?? "STUDENT"} />
                            <Title order={2}>{data.user?.name}</Title>
                            {data.user?.bio && <Text>{data.user?.bio}</Text>}
                            <Text>joined {dayjs(data.user?.createdAt).toNow()}</Text>
                            {data.user?.id === session.data?.user.id && (
                                <Group w='100%' position="right" >
                                    <Button component={Link} href="/edit-my-profile" leftIcon={<IconPencil />} variant="outline">Edit My Profile</Button>
                                </Group>)}
                        </Stack>
                    </Card>
                    <Space h={"xl"} />
                    <Grid>
                        <Grid.Col span={12} md={4}>
                            <Card shadow="sm" withBorder padding={"md"}>
                                <Text size={"lg"} mb="sm"><b>Bio :</b> {data.user?.bio ? data.user?.bio : "no bio"}</Text>
                                <Text size={"lg"} mb="sm"><b>Level :</b> {data.user?.level ? data.user?.level : "no level"}</Text>
                                <Text size={"lg"} mb="sm"><b>joinded :</b> {data.user?.createdAt.toLocaleDateString()}</Text>
                            </Card>
                            <Space h={"xl"} />
                            <Card shadow="sm" withBorder padding={"md"}>
                                <Text size={"lg"} mb="sm">{data.user?.num_blogs} blogs published</Text>
                                <Text size={"lg"} mb="sm">{data.user?.num_saved_blogs} blogs saved</Text>
                                <Text size={"lg"}>{data.user?.num_comments} comments written</Text>
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={12} md={8}>
                            <Card shadow="sm" withBorder padding={"md"}>
                                <SegmentedControl onChange={setSegment} defaultValue={segment} w={"100%"} data={[
                                    { label: 'Published Blogs', value: 'published-blogs' },
                                    { label: 'Saved Blogs', value: 'saved_blogs', disabled: session.data?.user.id !== data.user?.id }]}
                                />
                                <Space h={"xl"} />
                                <Box>
                                    <Grid>
                                        {segment === "published-blogs" && <UserBlogs message="This user didnt publish any blog" blogs={data.user?.blogs} />}
                                        {segment === "saved_blogs" && <UserBlogs message="You didnt save any blog" blogs={data.user?.saved_blogs} />}
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid.Col>
                    </Grid>
                    <Space h={100} />
                </Container >
            )}

        </>
    );
}