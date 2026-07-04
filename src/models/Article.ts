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
  if(!id) throw new Error(`Article ID is missing.`);
  if(!data.createdAt) throw new Error(`Article creation date is missing.`);

  return {
    id: id,
    ...data
  }
}

export const validateArticleUpdate = (data:Partial<ArticleProps>): Partial<ArticleProps> => {
  const update: Partial<ArticleProps> = {};

  if (data.title !== undefined) {
    if (!data.title.trim()) throw new Error(`Please enter a title for your article.`);
    if (data.title.length >= TITLE_MAX) throw new Error(`Title must be ${TITLE_MAX} characters or fewer.`);
    update.title = data.title;
  }

  if (data.content !== undefined) {
    if (!data.content.trim()) throw new Error(`Please enter the article content.`);
    if (data.content.length >= CONTENT_MAX) throw new Error(`Content must be ${CONTENT_MAX} characters or fewer.`);
    update.content = data.content;
  }

  if (data.tags !== undefined) {
    update.tags = data.tags;
  }

  if (data.status !== undefined) {
    update.status = data.status;
  }

  if (data.imageURL !== undefined) {
    update.imageURL = data.imageURL;
  }

  update.modifiedAt = serverTimestamp();
  return update;
}

export const validateArticle = (data:Partial<ArticleProps>): Partial<ArticleProps> => {
  if(!data.creatorId) throw new Error(`Creator reference is missing.`);
  if(!data.creatorDisplayName) throw new Error(`Your display name is required.`);
  if(!data.title?.trim()) throw new Error(`Please enter a title for your article.`);
  if(!data.content?.trim()) throw new Error(`Please enter the article content.`);

  if(data.title.length >= TITLE_MAX) throw new Error(`Title must be ${TITLE_MAX} characters or fewer.`);
  if(data.content.length >= CONTENT_MAX) throw new Error(`Content must be ${CONTENT_MAX} characters or fewer.`);

  return{
    creatorId: data.creatorId,
    creatorDisplayName: data.creatorDisplayName,
    title: data.title,
    content: data.content,
    tags: data.tags || [],
    status: data.status || 'DRAFT',
    ...(data.imageURL ? { imageURL: data.imageURL } : {}),
    createdAt: data.createdAt || serverTimestamp(),
    modifiedAt: serverTimestamp()
  }
}
