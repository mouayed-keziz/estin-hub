'use client'
import { Anchor, Autocomplete, Text, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export default function Hero() {
    return (
        <>
            <Title mb='md' align='center' order={1}>
                Welcome to Estin Hub - A Place for Non-Academic Communication, Blogs, and More
            </Title>
            <Text align='center' c='dimmed'>
                This is a place for students to communicate with each other, share their thoughts, and more.
                We are currently in the process of building this website, so please be patient with us.
                If you would like to contribute, please contact us at <Anchor href="mailto:m_keziz@estin.dz">mail</Anchor>
            </Text>
            <Autocomplete placeholder='Search for blogs' mt='xl' size='lg' icon={<IconSearch />} data={['1', '2', '3', '4']} />
        </>
    )
}