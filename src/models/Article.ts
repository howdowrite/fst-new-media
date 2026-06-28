import {Timestamp, FieldValue, serverTimestamp} from "firebase/firestore";

export interface ArticleProps {
  id: string,
  creatorId:string,
  creatorDisplayName: string,
  title: string,
  content: string,
  tags: string[],
  status: 'PUBLISHED' | 'DRAFT',
  imageURL?: string,
  createdAt: Timestamp | FieldValue
  modifiedAt: Timestamp | FieldValue

}

export const transform = (id: string, data:Omit<ArticleProps, "id">):ArticleProps => {
  if(!id) throw new Error(`REQUIRED: Missing id`);
  if(!data.createdAt) throw new Error(`REQUIRED: missing createdAt`);

  return {
    id: id,
    ...data
  }
}

export const updateArticle = (data: Partial<ArticleProps>): Partial<ArticleProps> => {
  if(!data.title?.trim()) throw new Error(`REQUIRED: Missing title`);
  if(!data.content?.trim()) throw new Error(`REQUIRED: Missing content`);

  return{
    title: data.title,
    content: data.content,
    tags: data.tags,
    status: data.status || 'DRAFT',
    imageURL: data.imageURL || "",
    modifiedAt: serverTimestamp()
  }
}

export const createArticle = (data:Partial<ArticleProps>): Partial<ArticleProps> => {
  if(!data.creatorId) throw new Error(`REQUIRED: creatorId`);
  if(!data.creatorDisplayName) throw new Error(`REQUIRED: creatorDisplayName`);
  if(!data.title?.trim()) throw new Error(`REQUIRED: Missing title`);
  if(!data.content?.trim()) throw new Error(`REQUIRED: Missing content`);

  return{
    creatorId: data.creatorId,
    creatorDisplayName: data.creatorDisplayName,
    title: data.title,
    content: data.content,
    tags: data.tags,
    status: data.status || 'DRAFT',
    imageURL: data.imageURL || "",
    createdAt: serverTimestamp(),
    modifiedAt: data?.modifiedAt || serverTimestamp()
  }
}
