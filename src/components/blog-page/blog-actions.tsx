"use client"

import { api } from "@/trpc/react";
import { ActionIcon, Flex, Popover, Rating, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconBookmark, IconBookmarkFilled, IconMessageCircle, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BlogActions({ blogId }: { blogId: string }) {
    const router = useRouter();
    const { data, refetch } = api.blog.get_blog_stats.useQuery({ id: blogId })
    const my_rating = api.blog.get_my_rating_for_blog.useQuery({ id: blogId })
    const my_like = api.blog.get_my_like_for_blog.useQuery({ id: blogId })
    const rate_blog = api.blog.rate_blog.useMutation();
    const like_blog = api.blog.like_blog.useMutation();
    const unlike_blog = api.blog.unlike_blog.useMutation();
    const delete_blog = api.blog.delete_blog.useMutation();
    const session = useSession();
    const [rating, setRating] = useState(my_rating.data ?? 0);

    const scrollToId = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = element.offsetTop;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    }

    const rate_blog_handeler = (value: number) => {
        setRating(value);
        void rate_blog.mutateAsync({ blogId: blogId, rating: value }).then(async () => {
            notifications.show({ message: `blog rated successfully (${value})`, title: "Success" })
            await refetch();
        });
    }

    const like_blog_handeler = () => {
        if (my_like.data) {
            void unlike_blog.mutateAsync({ blogId: blogId }).then(async () => {
                notifications.show({ message: "blog unsaved successfully", title: "Success" })
                await refetch();
                await my_like.refetch();
            }).catch(() => {
                notifications.show({ message: "something went wrong", title: "Error", color: "red" })
            });
        } else {
            void like_blog.mutateAsync({ blogId: blogId }).then(async () => {
                notifications.show({ message: "blog saved successfully", title: "Success" })
                await refetch();
                await my_like.refetch();
            }).catch(() => {
                notifications.show({ message: "something went wrong", title: "Error", color: "red" })
            });
        }
    }


    const delete_blog_handeler = () => {
        delete_blog.mutateAsync({ id: blogId }).then(async () => {
            notifications.show({ message: "blog deleted successfully", title: "Success" })
            router.push("/")
        }).catch(() => {
            notifications.show({ message: "something went wrong", title: "Error", color: "red" })
        })
    }

    const isMobile = useMediaQuery('(max-width: 64em)');
    return (
        <>
            <Flex
                gap="md"
                justify="flex-start"
                align={isMobile ? "flex-start" : "center"}
                direction={isMobile ? "row" : "column"}
                wrap="nowrap"
            >
                <Popover width={200} position="top" withArrow shadow="md">
                    {session.status === "unauthenticated" && (
                        <Stack spacing={0}>
                            <ActionIcon disabled color="dark" size="xl" radius="xl">
                                {my_rating.data ? (<IconStarFilled size="2.125rem" />) : (<IconStar size="2.125rem" />)}
                            </ActionIcon>
                            <Text align="center">{data?.avg_rating.toFixed(2)}</Text>
                        </Stack>
                    )}

                    {session.status === "authenticated" && (
                        <Popover.Target>
                            <Stack spacing={0}>
                                <ActionIcon color="dark" size="xl" radius="xl">
                                    {my_rating.data ? (<IconStarFilled size="2.125rem" />) : (<IconStar size="2.125rem" />)}
                                </ActionIcon>
                                <Text align="center">
                                    {data?.avg_rating.toFixed(2)}
                                </Text>
                            </Stack>
                        </Popover.Target>
                    )}

                    <Popover.Dropdown>
                        <Rating value={rating} onChange={(value: number) => rate_blog_handeler(value)} size="xl" />
                    </Popover.Dropdown>
                </Popover>

                <Stack spacing={0}>
                    <ActionIcon onClick={() => scrollToId("comment-section")} color="dark" size="xl" radius="xl">
                        <IconMessageCircle size="2.125rem" />
                    </ActionIcon>
                    <Text align="center">{data?.comments}</Text>
                </Stack>

                <Stack spacing={0}>
                    <ActionIcon onClick={like_blog_handeler} disabled={session.status === "unauthenticated"} color="dark" size="xl" radius="xl">
                        {my_like.data ? (
                            <IconBookmarkFilled size="2.125rem" />
                        ) : (
                            <IconBookmark size="2.125rem" />
                        )}

                    </ActionIcon>
                    <Text align="center">{data?.saves}</Text>
                </Stack>


                {session.data?.user.id === data?.authorId && (
                    <Stack spacing={0}>
                        <ActionIcon onClick={() => delete_blog_handeler()} color="dark" size="xl" radius="xl">
                            <IconTrash color="red" size="2.125rem" />
                        </ActionIcon>
                    </Stack>
                )}

            </Flex>
        </>
    )
}