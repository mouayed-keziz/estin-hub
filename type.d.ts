


interface BlogCardProps {
    title: string;
    search_query: string;
    blogs: {
        author: {
            name: string | null;
            role: $Enums.ROLE;
        };
        id: string;
        title: string;
        image: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        tags: string;
        rating: number | null;
    }[]
}