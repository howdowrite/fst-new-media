import { collection, doc, addDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore'
import { db } from './firebase'
import { transform, validateComment } from '../models/Comment'
import type {CommentProps} from '../models/Comment'

const ref = collection(db, "comments")

export const addComment = async (data: Partial<CommentProps>) => {
  const complete = validateComment(data);
  await addDoc(ref, complete);
}

export const deleteComment = async (id: string) => {
  await deleteDoc(doc(db, "comments", id));
}

export const getCommentsByArticleId = async (articleId: string) => {
  const q = query(ref, where("articleId", "==", articleId))
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => transform(doc.id, {...doc.data() as CommentProps}));
}
