import { Container, Group, Loader, Title } from "@mantine/core";
import { useSession } from "next-auth/react";

export default function CreateBlogPage() {
    const { status, data } = useSession();
    return (
        <>
            <Container size="lg" mt="xl">
                {status === "unauthenticated" && <UnauthenticatedState />}
                {status === "loading" && <LoadingState />}
                {status === "authenticated" && <AuthenticatedState />}
            </Container>
        </>
    );
}


function LoadingState() {
    return (
        <Group h="80vh" position="center">
            <Loader size="xl" />
        </Group>
    );
}

function UnauthenticatedState() {
    return (
        <Group h="80vh" position="center">
            <Title order={1} align="center">
                You are not logged in
            </Title>
        </Group>
    );
}

function AuthenticatedState() {
    const session = useSession();
    return (
        <>
            hello world
        </>
    );
}