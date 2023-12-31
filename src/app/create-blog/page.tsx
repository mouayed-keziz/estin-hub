"use client";

import DropZone from "@/components/create-blog-page/drop-zone";
import TipTapEditor from "@/components/create-blog-page/editor";
import { Avatar, Button, Card, Container, Group, Image, Loader, Space, Stack, TextInput, Title } from "@mantine/core";
import { type FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { content } from "@/components/create-blog-page/default-content"

export default function CreateBlogPage() {
    const { status } = useSession();
    return (
        <>
            <Container size="lg" my="xl">
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

interface FormValues {
    title: string;
    content: string;
    image: FileWithPath | null;
}

function AuthenticatedState() {
    const { data } = useSession();
    const [preview, setPreview] = useState("")
    const form = useForm<FormValues>({
        initialValues: {
            title: "",
            content: content,
            image: null,
        },
        validate: {
            title: (val) => val.length > 0 ? null : "Title is required",
            content: (val) => val.length > 0 ? null : "Content is required",
            image: (val) => val ? null : "Image is required",
        }
    })

    const handeler = (files: FileWithPath[]) => {
        form.setFieldValue("image", files[0] ?? null)
    }
    return (
        <>
            <Card shadow="sm" withBorder padding="lg">
                <Title order={1}>
                    CREATE A NEW BLOG :
                </Title>
                <Space h="xl" />
                {data && (
                    <Group w="100%" noWrap position="left" align="center">
                        <Avatar src={data.user?.image} radius="100%" color="blue" size={100}>{data.user?.name?.charAt(0)}</Avatar>
                        <Stack spacing="xs" justify="start" align="start">
                            <Title order={3}>{data.user?.name}</Title>
                            <Title fw={"lighter"} color="dimmed" order={4}>{data.user?.email}</Title>
                        </Stack>
                    </Group>
                )}

                <Space h="lg" />
                <TextInput size="lg" placeholder="Title" {...form.getInputProps("title")} />
                <Space h="lg" />
                <DropZone
                    onDrop={(files) => handeler(files)}
                    onReject={() => notifications.show({ message: "Please upload a valid image", color: "red" })}
                    maxSize={3 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE} />
                <Space h="lg" />
                <TipTapEditor onChange={(content) => {
                    form.setFieldValue("content", content)
                }} />

                <Button mt="md" variant="light" size="lg" fullWidth>
                    Create Blog
                </Button>
            </Card>
        </>
    );
}