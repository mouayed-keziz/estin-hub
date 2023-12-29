"use client"

import { api } from "@/trpc/react";
import { Avatar, Button, Card, Grid, Group, Space, Text, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useSession } from "next-auth/react";

export default function CommentsSection({ blogId }: { blogId: string }) {
    const { data, refetch } = api.blog.get_blog_comments.useQuery({ id: blogId })
    const create_comment = api.blog.create_comment.useMutation({
        onSuccess() {
            void refetch();
        },
    });
    const session = useSession();
    const isMobile = useMediaQuery('(max-width: 64em)');

    const form = useForm({
        initialValues: {
            comment: "",
        },

        validate: {
            comment: (value) => (value.length >= 10 ? null : 'Comment should have atleast 10 characters'),
        },
    });

    const submit_comment_handeler = () => {
        create_comment.mutate({ comment: form.values.comment, blogId });
        form.reset();
    }

    return (
        <Card id="comment-section" shadow="sm" padding="lg" radius="md" withBorder>
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
                                disabled={create_comment.isLoading}
                                {...form.getInputProps('comment')}
                            />
                            <Group position="right">
                                <Button loading={create_comment.isLoading} type="submit" mt="xs" variant="light">SUBMIT COMMENT</Button>
                            </Group>
                        </form>
                    </Grid.Col>
                </Grid>
            )}

            {session.status !== "authenticated" && (
                <>
                    <Title order={3} mb="xl" >Login to comment</Title>
                </>
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
        </Card>
    );
}