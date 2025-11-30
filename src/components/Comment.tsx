import type { IComment } from '@/types/comment';

interface CommentProps {
    comment: IComment;
    key?: string;
}

export default function Comment({ comment, key }: CommentProps) {
    return (
        <div key={String(comment._id)} className="border-t pt-2 mt-2">
            <div className="flex items-center justify-between mb-1">
                {comment.userId ? (<span>{String(comment.userId)}</span>) : (<span>Anonymous</span>)}
                <span>{comment.date ? (typeof comment.date === 'string' ? new Date(comment.date) : comment.date).toLocaleDateString() : 'Unknown date'}</span>
            </div>
            <div>{comment.comment}</div>
        </div>
    );
}
