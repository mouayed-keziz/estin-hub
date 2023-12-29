"use client"

import { api } from "@/trpc/react";
import { ActionIcon, Flex, Popover, Rating, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBookmark, IconMessageCircle, IconStar } from "@tabler/icons-react";

export default function BlogActions({ blogId }: { blogId: string }) {
    const { data } = api.blog.number_of_comments.useQuery({ id: blogId })

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
                    <Popover.Target>
                        <Stack spacing={0}>
                            <ActionIcon color="dark" size="xl" radius="xl">
                                <IconStar size="2.125rem" />
                            </ActionIcon>
                            <Text align="center">TODO</Text>
                        </Stack>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Rating defaultValue={2} size="xl" />
                    </Popover.Dropdown>
                </Popover>

                <Stack spacing={0}>
                    <ActionIcon onClick={() => scrollToId("comment-section")} color="dark" size="xl" radius="xl">
                        <IconMessageCircle size="2.125rem" />
                    </ActionIcon>
                    <Text align="center">{data}</Text>
                </Stack>

                <Stack spacing={0}>
                    <ActionIcon color="dark" size="xl" radius="xl">
                        <IconBookmark size="2.125rem" />
                    </ActionIcon>
                    <Text align="center">TODO</Text>
                </Stack>
            </Flex>
        </>
    )
}