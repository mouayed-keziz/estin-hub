import { Badge } from "@mantine/core";
import { ROLE } from "@prisma/client";

export default function BadgeWithRole({ role }: { role: ROLE }) {

    return (
        <Badge color={
            role === "CLUB" ? "teal" :
                role === "STUDENT" ? "blue" :
                    role === "TEACHER" ? "red" : "gray"
        } variant="light">
            {role}
        </Badge>
    );
}