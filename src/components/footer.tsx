'use client'

import { Anchor, Container, Divider, Group, Title } from "@mantine/core"

export default function Footer() {
    return (
        <>
            <Divider size='xs' />
            <Container my='xl'>
                <Group position="apart">
                    <Title order={2}>ESTIN-HUB</Title>
                    <Group position="right">
                        <Anchor target="_blank" href='https://estin.dz'>ESTIN</Anchor>
                        <Anchor target="_blank" href='https://bib.gdsc-estin.com'>BIB</Anchor>
                    </Group>
                </Group>
            </Container>
        </>
    )
}