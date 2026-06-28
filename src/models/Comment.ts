import {serverTimestamp, Timestamp} from "firebase/firestore";
import type { FieldValue } from "firebase/firestore/lite";

export interface CommentProps {
  id: string,
  articleId: string,
  userId: string,
  creatorDisplayName:string,
  replyTargetId?: string,
  content: string
  createdAt: Timestamp | FieldValue,
  modifiedAt: Timestamp | FieldValue
}

export const transform = (id: string, data:Omit<CommentProps, "id">):CommentProps => {
  if(!id) throw new Error(`REQUIRED: Missing id`);
  if(!data.createdAt) throw new Error(`REQUIRED: missing createdAt`);

  return {
    id: id,
    ...data
  }
}

export const createComment = (data:Partial<CommentProps>): Partial<CommentProps> => {
  if(!data.articleId) throw new Error(`REQUIRED: Missing articleId`);
  if(!data.userId) throw new Error(`REQUIRED: Missing UserId`);
  if(!data.creatorDisplayName) throw new Error(`REQUIRED: creatorDisplayName`);
  if(!data.content?.trim()) throw new Error(`REQUIRED: Missing content`);

  return{
    articleId: data.articleId,
    userId: data.userId,
    creatorDisplayName: data.creatorDisplayName || "",
    replyTargetId: data.replyTargetId || "", 
    content: data.content,
    modifiedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  }
}
