import {Timestamp, FieldValue, serverTimestamp} from "firebase/firestore";

const TITLE_MAX = 50;
const CONTENT_MAX = 1000;

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

export const validateArticle = (data:Partial<ArticleProps>): Partial<ArticleProps> => {
  if(!data.creatorDisplayName) throw new Error(`REQUIRED: creatorDisplayName`);
  if(!data.title?.trim()) throw new Error(`REQUIRED: Missing title`);
  if(!data.content?.trim()) throw new Error(`REQUIRED: Missing content`);

  if(data.title.length <= TITLE_MAX) throw new Error(`Title too long please limit to ${TITLE_MAX} characters`)
  if(data.content.length <= CONTENT_MAX) throw new Error(`Title too long please limit to ${CONTENT_MAX} characters`)

  return{
    creatorId: data.creatorId,
    creatorDisplayName: data.creatorDisplayName,
    title: data.title,
    content: data.content,
    tags: data.tags,
    status: data.status || 'DRAFT',
    imageURL: data.imageURL,
    createdAt: data.createdAt || serverTimestamp(),
    modifiedAt: serverTimestamp()
  }
}
