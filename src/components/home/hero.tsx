'use client'
import { Anchor, Button, Grid, Text, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
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
            <form onSubmit={(e) => {
                e.preventDefault();
                if (search === '') return;
                setLoading(true);
                router.push(`/search?text=${search}`)
            }}>
                <Grid mt='xl' >
                    <Grid.Col span={9} xs={10}>
                        <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search for blogs' size='lg' icon={<IconSearch />} />
                    </Grid.Col>
                    <Grid.Col span={3} xs={2}>
                        <Button fullWidth sx={theme => ({ [theme.fn.smallerThan("sm")]: { display: "none" } })} loading={loading} type="submit" variant="outline" size='lg'>Search</Button>
                        <Button fullWidth sx={theme => ({ [theme.fn.largerThan("sm")]: { display: "none" } })} loading={loading} type="submit" variant="outline" size='lg'><IconSearch /></Button>
                    </Grid.Col>
                </Grid>
            </form>
        </>
    )
}