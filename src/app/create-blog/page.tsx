"use client";

import DropZone from "@/components/create-blog-page/drop-zone";
import TipTapEditor from "@/components/create-blog-page/editor";
import { AspectRatio, Avatar, Badge, Button, Card, Container, Group, Loader, Space, Stack, TextInput, Title } from "@mantine/core";
import Image from "next/image";
import { type FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { content } from "@/components/create-blog-page/default-content"
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

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
    tags: string;
    content: string;
    image: FileWithPath | null;
}

function AuthenticatedState() {
    const { data } = useSession();
    const { edgestore } = useEdgeStore();
    const create_blog = api.blog.create_new_blog.useMutation()
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const form = useForm<FormValues>({
        initialValues: {
            title: "",
            tags: "",
            content: content,
            image: null,
        },
        validate: {
            title: (val) => val.length > 0 ? null : "Title is required",
            content: (val) => val.length > 0 ? null : "Content is required",
            image: (val) => val ? null : "Image is required",
        }
    })

    const upload_picture_handeler = async (files: FileWithPath[]) => {
        form.setFieldValue("image", files.at(0) ?? null)
        if (form.values.image) {
            const imageUrl = URL.createObjectURL(form.values.image);
            setImage(imageUrl);
        } else {
            notifications.show({ message: "Please try again", color: "red" })
        }
    }

    const submitBlogHandeler = () => {
        form.validate();
        if (form.isValid() && form.values.image) {
            const { title, content, image, tags } = form.values;
            setUploading(true);
            edgestore.publicFiles.upload({
                file: image
            }).then(async (res) => {
                console.log(res.url)
                const new_blog = await create_blog.mutateAsync({
                    title,
                    content,
                    tags,
                    image: res.url
                })
                setUploading(false);
                notifications.show({ message: "Blog created successfully", title: "Success" })
                void router.push(`/blog/${new_blog.id}`)
            }).catch(() => {
                setUploading(false);
            })
        }
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

                <form onSubmit={form.onSubmit(() => submitBlogHandeler())}>
                    <Space h="lg" />
                    <TextInput disabled={uploading} size="lg" placeholder="Title" {...form.getInputProps("title")} />
                    <TextInput mt="md" disabled={uploading} size="lg" placeholder="tags" onChange={(e) => {
                        const value = e.target.value;
                        if (value.endsWith(" ")) {
                            console.log("last")
                            form.setFieldValue("tags", form.values.tags + value.slice(0, -1) + " ");
                            e.target.value = "";
                        }
                    }} />
                    <Group mt="md" spacing='md' position="left">
                        {form.values.tags.split(" ").filter((tag) => tag !== "").map((tag, index) => (
                            <Badge key={index} color="blue" variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </Group>
                    <Space h="lg" />
                    <Container size="sm">
                        {image ? (
                            <>
                                <AspectRatio ratio={16 / 9} style={{ width: "100%" }}>
                                    <Image
                                        fill
                                        style={{ objectFit: "cover" }}
                                        src={image}
                                        alt={form.values.title}
                                    />
                                </AspectRatio>
                                <Group position="right">
                                    <Button mt="md" variant="light" color="red" onClick={() => setImage(null)}>Remove Image and upload another</Button>
                                </Group>
                            </>
                        ) : (
                            <DropZone
                                disabled={uploading}
                                onDrop={(files) => upload_picture_handeler(files)}
                                onReject={() => notifications.show({ message: "Please upload a valid image", color: "red" })}
                                maxSize={3 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE} />
                        )}
                    </Container>
                    <Space h="lg" />
                    <TipTapEditor onChange={(content) => {
                        form.setFieldValue("content", content)
                    }} />

                    <Button loading={uploading} type="submit" mt="md" variant="light" size="lg" fullWidth>
                        Create Blog
                    </Button>
                </form>
            </Card>
        </>
    );
}