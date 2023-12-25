'use client'

import { Anchor, Table } from "@mantine/core";

const events = [
    {
        name: 'Event 1',
        club: 'Club 1',
        date: '12/12/2021',
        link: 'https://www.google.com'
    },
    {
        name: 'Event 1',
        club: 'Club 1',
        date: '12/12/2021',
        link: 'https://www.google.com'
    },
    {
        name: 'Event 1',
        club: 'Club 1',
        date: '12/12/2021',
        link: 'https://www.google.com'
    },
    {
        name: 'Event 1',
        club: 'Club 1',
        date: '12/12/2021',
        link: 'https://www.google.com'
    },
    {
        name: 'Event 1',
        club: 'Club 1',
        date: '12/12/2021',
        link: 'https://www.google.com'
    },
];

export default function EventsTable() {
    const rows = events.map((event) => (
        <tr key={event.name}>
            <td>{event.name}</td>
            <td>{event.club}</td>
            <td>{event.date}</td>
            <td><Anchor href={event.link}>Visit website</Anchor></td>
        </tr>
    ));
    return (
        <>
            <Table horizontalSpacing="xl" verticalSpacing="lg" fontSize="lg">
                <thead>
                    <tr>
                        <th>Event name</th>
                        <th>Club name</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}