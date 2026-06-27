import {Timestamp} from "firebase/firestore";

export interface ArticleProps {
  id: string,
  creatorId:string,
  title: string,
  content: string,
  tags: string[],
  status: 'PUBLISHED' | 'DRAFT',
  imageURL?: string,
  createdAt: Timestamp

}

export const transform = (id: string, data:Omit<ArticleProps, "id">):ArticleProps => {
  if(!id) throw new Error(`REQUIRED: Missing id`);
  if(!data.createdAt) throw new Error(`REQUIRED: missing createdAt`);

  return {
    id: id,
    ...data
  }
}

export const createArticle = (data:Partial<ArticleProps>): Partial<ArticleProps> => {
  if(!data.creatorId) throw new Error(`REQUIRED: creatorId`);
  if(!data.title?.trim()) throw new Error(`REQUIRED: Missing title`);
  if(!data.content?.trim()) throw new Error(`REQUIRED: Missing content`);

  return{
    title: data.title,
    content: data.content,
    tags: data.tags,
    status: data.status || 'DRAFT',
    imageURL: data.imageURL || "",
  }
}
