'use client'

import { api } from "@/trpc/react";
import BlogContent from "@/components/blog-page/blog-content";
import BlogActions from "@/components/blog-page/blog-actions";
import OwnerInfo from "@/components/blog-page/owner-info";
import MoreOwnerBlogs from "@/components/blog-page/more-owner-blogs";
import CommentsSection from "@/components/blog-page/comments-section";
import { Container, Divider, Grid, Group, Loader, Space, Title } from "@mantine/core";


export default function BlogPage({ params }: { params: { id: string } }) {
    const { data, isLoading } = api.blog.get_blog_by_id.useQuery({ id: params.id });
    return (
        <>


            {isLoading && <Group h="80vh" position="center"><Loader size="xl" /></Group>}
            {data?.message === "failed" && <Group h="80vh" position="center"><Title order={1} align="center">BLOG Not Found</Title></Group>}
            {data?.message === "success" && (
                <Container size='xl'>
                    <Space h={100} />
                    <Grid>
                        <Grid.Col sx={theme => ({
                            [theme.fn.smallerThan('md')]: { display: "none" }
                        })} span={0} md={1}>
                            <BlogActions blogId={params.id} />
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
            <Space h={100} />
        </>
    )
}












