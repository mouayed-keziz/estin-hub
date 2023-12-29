'use client'

import { Anchor, Container, Divider, Group, Text } from "@mantine/core"
import Link from "next/link"

export default function Footer() {
    return (
        <>
            <Divider size='xs' />
            <Container my='xl'>
                <Group position="apart">
                    <Text component={Link} href="/" fz="1.5rem" fw={'bold'}>ESTIN-HUB</Text>
                    <Group position="right">
                        <Anchor target="_blank" href='https://estin.dz'>ESTIN</Anchor>
                        <Anchor target="_blank" href='https://bib.gdsc-estin.com'>BIB</Anchor>
                    </Group>
                </Group>
            </Container>
        </>
    )
}