
import { useEffect, useState } from "react";
// Types

interface CommentsProps {
    // Define any props needed for Comments component
    parentId: string;
}


export default function CommentsBtn({ parentId }: CommentsProps) {

    console.log("Comments component parentId:", parentId);
    const [numOfComments, setNumOfComments] = useState<number>(0);

    useEffect(() => {
        // Fetch number of comments for the post
        fetch('/api/comments?parentId=' + parentId)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('API response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                console.log('Fetched comments:', data);
                setNumOfComments(data.data.length);
            })
            .catch((error) => {
                console.error('Error fetching comments:', error);
            });
    }, [parentId]);

    return (
        <div className="text-md text-accent bg-secondary-foreground sidebar-border
        px-2 py-1 rounded-md hover:text-chart-1 hover:bg-sidebar-ring cursor-pointer transition-colors duration-100">
            Comments: {numOfComments}
        </div>
    );
}