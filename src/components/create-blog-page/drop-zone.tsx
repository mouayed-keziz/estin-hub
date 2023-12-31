"use client";

import { Group, Text, useMantineTheme, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, type DropzoneProps } from '@mantine/dropzone';

export default function DropZone(props: Partial<DropzoneProps>) {
    const theme = useMantineTheme();
    return (
        <Dropzone
            onDrop={props.onDrop ?? (() => { console.log("") })}
            onReject={props.onReject}
            maxSize={props.maxSize}
            accept={props.accept}
        >
            <Group position="center" spacing="xl" style={{ minHeight: rem(220), pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                        size="3.2rem"
                        stroke={1.5}
                        color={theme.colors.blue[theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        size="3.2rem"
                        stroke={1.5}
                        color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconPhoto size="3.2rem" stroke={1.5} />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Upload your Blog Cover Image
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                        Drag an image here or click to select it (max size 3mb)
                    </Text>
                </div>
            </Group>
        </Dropzone>
    );
}