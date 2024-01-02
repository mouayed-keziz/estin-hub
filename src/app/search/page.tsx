"use client";

import { AspectRatio, Button, Container, Grid, List, Skeleton, Space, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedValue } from "@mantine/hooks";
import { api } from "@/trpc/react";
import BlogCard from "@/components/home/blog-card";

export default function SearchPage() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [params] = useSearchParams();
    const [debouncedUrl] = useDebouncedValue(search, 200);
    const { data, isLoading, mutate } = api.blog.search_blogs.useMutation();


    useEffect(() => {
        if (params) {
            setSearch(params[1]);
        }
    }, []);

    useEffect(() => {
        void router.push(`/search?text=${search}`);
    }, [debouncedUrl]);

    useEffect(() => {
        mutate({ query: search });
    }, [debouncedUrl]);



    return (
        <>
            <Space h={100} />
            <Container size="lg">
                <Title mb='md' align='center' order={1}>
                    Search for blogs
                </Title>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (search === '') return;
                    setLoading(true);
                    void router.push(`/search?text=${search}`)
                }}>
                    <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search for blogs' size='lg' icon={<IconSearch />} />
                </form>

                {debouncedUrl === "" ? (
                    <>
                        <Space h={600} />
                    </>
                ) : (
                    <>
                        {isLoading ? (
                            <Grid my="xl" >
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <Grid.Col span={12} md={6} lg={4}>
                                        <AspectRatio key={index} ratio={6 / 7}>
                                            <Skeleton w='100%' h="100%" />
                                        </AspectRatio>
                                    </Grid.Col>
                                ))}
                            </Grid>
                        ) : <>
                            {data && (
                                <>
                                    {data.length === 0 && (
                                        <>
                                            <Title my={50} align='center' order={1}>
                                                No results found
                                            </Title>
                                            <Space h={400} />
                                        </>
                                    )}

                                    <Grid my="xl">
                                        {data.map((blog) => (
                                            <Grid.Col key={blog.title} span={12} md={6} lg={4}>
                                                <BlogCard title={blog.title} author={blog.author.name ?? ""} image={blog.image} owner_role={blog.author.role} author_id={blog.createdById} id={blog.id} />
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                </>
                            )}
                        </>}
                    </>
                )}


            </Container>
        </>
    );
}