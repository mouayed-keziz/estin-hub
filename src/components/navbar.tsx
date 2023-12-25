"use client"

import { Button, Container, Divider, Group, Loader, Text, Menu, Avatar, Box, Title } from "@mantine/core";
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconUser, IconHeart, IconPlus, IconLogout } from '@tabler/icons-react';


import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
    const { status } = useSession();

    return (
        <>
            <Container size='lg' py='md'>
                <Group position="apart">
                    <Title order={3} fw={'bold'}>ESTIN-HUB</Title>
                    {status === 'loading' && <Loading />}
                    {status === 'authenticated' && <UserDropDown />}
                    {status === 'unauthenticated' && <LoginButton />}
                </Group>
            </Container>
            <Divider />
        </>
    );
}


function Loading() {
    return (
        <>
            <Loader />
        </>
    );
}
function UserDropDown() {
    const { data } = useSession();
    return (
        <>
            <Menu trigger="hover" shadow="md" width={200}>
                <Menu.Target>
                    <Group sx={{ cursor: 'pointer' }} position='left'>
                        <Avatar size='lg' src={data?.user.image ?? ''} alt={data?.user.name ?? ''} radius='xl'>{data?.user.name?.charAt(0)}</Avatar>
                        <Box sx={theme => ({
                            [theme.fn.smallerThan('md')]: {
                                display: 'none'
                            }
                        })}>
                            <Text>{data?.user.name}</Text>
                            <Text color="dimmed">{data?.user.email}</Text>
                        </Box>
                    </Group>

                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item component={Link} href='/profile' icon={<IconUser size={14} />}>My profile</Menu.Item>
                    <Menu.Item component={Link} href='/liked' icon={<IconHeart size={14} />}>Liked blogs</Menu.Item>
                    <Menu.Item component={Link} href='/create' icon={<IconPlus size={14} />}>Create new blog</Menu.Item>
                    <Menu.Item component={Link} href='/search' icon={<IconSearch size={14} />}>Search</Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item icon={<IconLogout size={14} />}>Logout</Menu.Item>
                    <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
}
function LoginButton() {
    return (
        <>
            <Button onClick={() => signIn('google')}>AUTHENTICATE</Button>
        </>
    );
}