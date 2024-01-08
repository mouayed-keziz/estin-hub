"use client";

import BadgeWithRole from "@/components/badge-with-role";
import { api } from "@/trpc/react";
import { Avatar, Button, Card, Container, Grid, Group, Loader, NativeSelect, Space, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type ROLE } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    const router = useRouter();
    const { data, isSuccess, refetch, } = api.user.get_user_data_only.useQuery({ id: session.data?.user.id ?? "" });
    const editRole = api.user.change_user_role.useMutation();
    const [role, setRole] = useState<ROLE>(data?.user?.role ?? "STUDENT");

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

    const change_role_handeler = () => {
        editRole.mutateAsync({
            role: role
        }).then(() => {
            notifications.show({ message: "your role has been updated successfully", title: "Success" })
            void router.push(`/user/${data?.user?.id}`)
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
                            <Stack spacing={0} justify="start" align="start">
                                <Title order={3}>{data.user?.name}</Title>
                                <Title mb={5} fw={"lighter"} color="dimmed" order={4}>{data.user?.email}</Title>
                            </Stack>
                        </Group>
                        <Space h="xl" />
                        <Title order={2}>Edit My Profile</Title>
                        <Space h={30} />
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
                                <Button loading={update_mutation.isLoading} type="submit" disabled={
                                    !form.values.bio || !form.values.level ||
                                    (data.user?.bio === form.values.bio && data.user?.level === form.values.level)
                                }>
                                    Save
                                </Button>
                            </Group>
                        </form>
                    </Card>
                    <Card mt="lg" shadow="sm" padding="xl" withBorder>
                        <Group align="center" position="left">
                            <Title mb="xs">You Are Not A </Title>
                            <BadgeWithRole bigger role={data.user?.role ?? "TEACHER"} />
                            <Title mb="xs">?</Title>
                        </Group>
                        <Space h="xl" />
                        <NativeSelect
                            size="md"
                            label="Select Your Role"
                            placeholder="I am a ..."
                            value={role}
                            onChange={(e) => {
                                const value = e.target.value
                                if (value === "STUDENT") {
                                    setRole("STUDENT")
                                } else if (value === "CLUB") {
                                    setRole("CLUB")
                                } else if (value === "TEACHER") {
                                    setRole("TEACHER")
                                }
                            }}
                            data={[
                                { value: 'STUDENT', label: 'STUDENT' },
                                { value: 'CLUB', label: 'CLUB' },
                                { value: 'TEACHER', label: 'TEACHER' },
                            ]}
                        />
                        <Space h="md" />
                        <Group position="right">
                            <Button onClick={() => change_role_handeler()} loading={editRole.isLoading} disabled={data.user?.role === role}>
                                Save
                            </Button>
                        </Group>
                    </Card>
                    <Space h={350} />
                </>
            ) : ("")}
        </>
    );
}