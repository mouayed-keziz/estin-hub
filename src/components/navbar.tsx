"use client"

import { Button, Container, Divider, Group, Loader, Text, Menu, Avatar, Box, useMantineColorScheme, Autocomplete } from "@mantine/core";
import { IconSearch, IconTrash, IconUser, IconHeart, IconPlus, IconLogout, IconMoonStars, IconSun } from '@tabler/icons-react';


import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
    const { status } = useSession();

    return (
        <>
            <Container size='lg' py='xs'>
                <Group position="apart">

                    <Text component={Link} href="/" fz="1.5rem" fw={'bold'}>ESTIN-HUB</Text>

                    <Autocomplete sx={theme => ({
                        [theme.fn.smallerThan('md')]: {
                            display: 'none'
                        }
                    })} placeholder='Search for blogs' icon={<IconSearch />} data={['1', '2', '3', '4']} />
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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

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
                            <Text color="dimmed">{data?.user.role}</Text>
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
                    <Menu.Item onClick={() => toggleColorScheme()} icon={dark ? <IconSun size={14} /> : <IconMoonStars size={14} />}>Toggle Theme</Menu.Item>
                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item onClick={() => signOut()} icon={<IconLogout size={14} />}>Logout</Menu.Item>
                    <Menu.Item disabled color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
}
function LoginButton() {
    return (
        <>
            <Button variant="light" onClick={() => signIn('google')}>AUTHENTICATE</Button>
        </>
    );
}