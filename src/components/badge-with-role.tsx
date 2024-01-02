import { Badge } from "@mantine/core";
import { type ROLE } from "@prisma/client";

export default function BadgeWithRole({ role, bigger = false }: { role: ROLE, bigger?: boolean }) {

    return (
        <Badge size={bigger ? "xl" : "md"} color={
            role === "CLUB" ? "teal" :
                role === "STUDENT" ? "blue" :
                    role === "TEACHER" ? "red" : "gray"
        } variant="light">
            {role}
        </Badge>
    );
}