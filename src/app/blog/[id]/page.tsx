'use client'

import BadgeWithRole from "@/components/badge-with-role";
import Navbar from "@/components/navbar"
import { api } from "@/trpc/react";
import { ActionIcon, Anchor, AspectRatio, Avatar, Badge, Box, Button, Card, Container, Divider, Grid, Group, Image, Loader, Space, Stack, Text, Textarea, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks";
import { type Blog, type User } from "@prisma/client";
import { IconBookmark, IconMessageCircle, IconStar } from "@tabler/icons-react"
import { useSession } from "next-auth/react";
import { useForm } from "@mantine/form"
export default function BlogPage({ params }: { params: { id: string } }) {
    const { data, isLoading, refetch } = api.blog.get_blog_by_id.useQuery({ id: params.id });

    return (
        <>
            <Navbar />
            <Space h={100} />

            {isLoading && <Group position="center"><Loader size="xl" /></Group>}
            {data?.message === "failed" && <Title order={1} align="center">BLOG Not Found</Title>}
            {data?.message === "success" && (
                <Container size='xl'>
                    <Grid>
                        <Grid.Col sx={theme => ({
                            [theme.fn.smallerThan('md')]: { display: "none" }
                        })} span={0} md={1}>
                            <BlogActions />
                        </Grid.Col>
                        <Grid.Col span={12} md={7}>
                            <BlogContent blog={data.blog} author={data.author} />
                        </Grid.Col>
                        <Grid.Col sx={theme => ({
                            [theme.fn.smallerThan('md')]: { display: "none" }
                        })} span={0} md={4}>
                            <OwnerInfo author={data.author} />
                            <Space h={30} />
                            <MoreOwnerBlogs blogs={data.related_blogs} author={data.author} />
                        </Grid.Col>
                    </Grid>
                    <Divider my={50} />

                    <CommentsSection blogId={params.id} />
                </Container>
            )}
        </>
    )
}




function BlogContent({ blog, author }: { blog: Blog | null, author: User | null }) {
    return (
        <>
            <AspectRatio ratio={16 / 9}>
                <Image fit="cover" radius='lg' alt='blog name' src={blog?.image as string} />
            </AspectRatio>
            <Space h={20} />
            <Group position="left">
                <Avatar src={author?.image} color="primary" radius='xl' size='lg'>{author?.name?.charAt(0)}</Avatar>
                <Stack spacing={0} align="start" justify="flex-start">
                    <Text size='xl'>{author?.name}</Text>
                    <Text color='dimmed' size='md'>
                        Posted on {blog?.createdAt.toLocaleDateString()}
                        {blog?.updatedAt.toLocaleDateString() !== blog?.createdAt.toLocaleDateString() && " • Updated on " + blog?.updatedAt.toLocaleDateString()}
                    </Text>
                </Stack>
            </Group>
            <Space h={20} />
            <Group spacing='xl' position="left">
                <Text size='xl'>Views 127 (TODO)</Text>
                <Text size='xl'>Saves 50 (TODO)</Text>
                <Text size='xl'>Rating 3.5/5 (TODO)</Text>
            </Group>
            <Group sx={theme => ({
                [theme.fn.largerThan("md")]: { display: "none" }
            })} position="left" spacing='xl'>
                <ActionIcon color="dark" size="xl" radius="xl">
                    <IconStar size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="dark" size="xl" radius="xl">
                    <IconMessageCircle size="2.125rem" />
                </ActionIcon>
                <ActionIcon color="dark" size="xl" radius="xl">
                    <IconBookmark size="2.125rem" />
                </ActionIcon>
            </Group>
            <Space h={20} />
            <Title >{blog?.title}</Title>
            <Space h={20} />
            <Group spacing='md' position="left">


                {blog?.tags && (
                    (blog.tags as string).split(' ').map((tag: string, index: number) =>
                        <Badge key={index} variant="filled">{tag}</Badge>
                    )
                )}
            </Group>

            <Space h={20} />
            <Box dangerouslySetInnerHTML={{ __html: blog?.content ?? "" }} />
        </>
    )
}

function OwnerInfo({ author }: { author: User | null }) {
    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group position="left">
                    <Avatar src={author?.image} color="primary" radius='xl' size='lg'>{author?.name?.charAt(0)}</Avatar>
                    <Stack spacing='xs' align="start" justify="flex-start">
                        <Text size='xl'><Anchor href={`/user/${author?.id}`}>{author?.name}</Anchor></Text>
                        <BadgeWithRole role={author?.role ?? "STUDENT"} />
                    </Stack>
                </Group>
                <Space h={20} />
                <Text size='lg'>TODO</Text>
                <Space h={30} />
                <Stack>
                    <Text size='md'><b>email  :</b> {author?.email}</Text>
                    <Text size='md'><b>level  :</b> TODO</Text>
                    <Text size='md'><b>joined :</b> TODO</Text>
                </Stack>
            </Card>
        </>
    )
}

function MoreOwnerBlogs({ author, blogs }: { author: User | null, blogs: Blog[] | undefined }) {
    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size='xl'>More from <Anchor href={`/user/${author?.id}`}>{author?.name}</Anchor></Text>
                <Space h={20} />

                {blogs?.length === 0 && (
                    <Text size='lg'>No other blogs</Text>
                )}

                {blogs?.map((blog, index) => (
                    <>
                        <Text key={blog.id} sx={{ cursor: 'pointer' }} size='lg'>Blog title 1</Text>
                        <Text color='dimmed' size='sm'>#tag1 #tag2 #tag3</Text>
                        {index !== 3 && <Divider my='sm' />}
                    </>
                ))}
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



function CommentsSection({ blogId }: { blogId: string }) {
    const { data, isSuccess, refetch } = api.blog.get_blog_comments.useQuery({ id: blogId })
    const { mutate } = api.blog.create_comment.useMutation({
        onSuccess() {
            void refetch();
        },
    });
    const session = useSession();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const form = useForm({
        initialValues: {
            comment: "",
        },

        validate: {
            comment: (value) => (value.length >= 10 ? null : 'Comment should have atleast 10 characters'),
        },
    });

    const submit_comment_handeler = () => {
        mutate({ comment: form.values.comment, blogId });
        form.reset();
    }
    return (
        <Box px="sm">
            <Title order={2}>
                Comments
            </Title>
            <Space h={20} />
            {session.status === "authenticated" && (
                <Grid mb={40}>
                    <Grid.Col span={1} >
                        <Group position="right" align="center">
                            <Avatar src={session.data?.user.image} radius='xl' size={isMobile ? "lg" : "xl"} color="primary">{session.data?.user.name?.charAt(0)}</Avatar>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={11}>
                        <form onSubmit={form.onSubmit(() => submit_comment_handeler())}>
                            <Textarea
                                placeholder="Your comment"
                                label="Your comment"
                                size="lg"
                                {...form.getInputProps('comment')}
                            />
                            <Group position="right">
                                <Button type="submit" mt="xs" variant="outline">SUBMIT COMMENT</Button>
                            </Group>
                        </form>
                    </Grid.Col>
                </Grid>
            )}

            {session.status !== "authenticated" && (
                <Text align="center" size="xl">Login to comment</Text>
            )}


            {data?.map((comment, index) => (
                <Grid key={index} mb={20}>
                    <Grid.Col span={1} >
                        <Group position="right" align="center">
                            <Avatar src={comment.createdBy.image} radius='xl' size={isMobile ? "md" : "lg"} color="primary">{comment.createdBy.name?.charAt(0)}</Avatar>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={11}>
                        <Textarea
                            size="md"
                            disabled
                            value={comment.content}
                        />
                    </Grid.Col>
                </Grid>
            ))}
            {data?.length === 0 && (
                <Text align="center" size="xl">No comments yet</Text>
            )}
        </Box>
    );
}