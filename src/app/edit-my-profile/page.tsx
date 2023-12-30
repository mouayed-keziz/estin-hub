"use client";

import { api } from "@/trpc/react";
import { Avatar, Button, Card, Container, Divider, Grid, Group, Loader, Space, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function EditMyProfilePage() {
    const { status } = useSession()
    return (
        <>
            <Container my="xl" size="lg">
                {status === "unauthenticated" && <UnauthenticatedState />}
                {status === "loading" && <LoadingState />}
                {status === "authenticated" && <AuthenticatedState />}
            </Container>
        </>
    );
}


function LoadingState() {
    return (
        <Group h="80vh" position="center">
            <Loader size="xl" />
        </Group>
    );
}

function UnauthenticatedState() {
    return (
        <Group h="80vh" position="center">
            <Title order={1} align="center">
                You are not logged in
            </Title>
        </Group>
    );
}

function AuthenticatedState() {
    const session = useSession();
    const { data, isSuccess, refetch } = api.user.get_user_data_only.useQuery({ id: session.data?.user.id ?? "" });

    const update_mutation = api.user.update_bio_and_level.useMutation({
        onSuccess: () => {
            void refetch()
        }
    })
    const form = useForm({
        initialValues: {
            bio: data?.user?.bio,
            level: data?.user?.level
        },
    })

    useEffect(() => {
        if (isSuccess) {
            form.setValues({
                bio: data?.user?.bio,
                level: data?.user?.level
            })
        }
    }, [isSuccess])

    const submit_handeler = (values: { bio: string | null | undefined, level: string | null | undefined }) => {
        if (!values.bio || !values.level) return
        update_mutation.mutateAsync({
            bio: values.bio,
            level: values.level
        }).then(() => {
            notifications.show({ message: "your profile has been updated successfully", title: "Success" })
        }).catch(() => {
            notifications.show({ message: "something went wrong", title: "Error", color: "red" })
        })
    }
    return (
        <>
            {data ? (
                <>
                    <Card shadow="sm" padding="xl" withBorder>
                        <Group w="100%" noWrap position="left" align="center">
                            <Avatar src={data.user?.image} radius="100%" color="blue" size={100}>{data.user?.name?.charAt(0)}</Avatar>
                            <Stack spacing="xs" justify="start" align="start">
                                <Title order={3}>{data.user?.name}</Title>
                                <Title fw={"lighter"} color="dimmed" order={4}>{data.user?.email}</Title>
                            </Stack>
                        </Group>
                        <Space h="xl" />
                        <Title order={2}>Edit My Profile</Title>
                        <Divider my='lg' />
                        <form onSubmit={form.onSubmit((values) => submit_handeler(values))}>
                            <Grid>
                                <Grid.Col span={12} md={6}>
                                    <TextInput
                                        label="Bio"
                                        size="md"
                                        {...form.getInputProps('bio')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={12} md={6}>
                                    <TextInput
                                        label="Level"
                                        size="md"
                                        {...form.getInputProps('level')}
                                    />
                                </Grid.Col>
                            </Grid>
                            <Group mt="lg" position="right">
                                <Button type="submit" disabled={
                                    !form.values.bio || !form.values.level ||
                                    (data.user?.bio === form.values.bio && data.user?.level === form.values.level)
                                }>
                                    Save
                                </Button>
                            </Group>
                        </form>
                    </Card>
                    <Space h={350} />
                </>
            ) : ("")}
        </>
    );
}