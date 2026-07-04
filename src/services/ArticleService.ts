import {collection, addDoc, getDocs, updateDoc, getDoc, deleteDoc, doc, query, orderBy, where, limit} from 'firebase/firestore';
import {db} from './firebase';
import {validateArticle, validateArticleUpdate, transform} from '../models/Article'
import type {ArticleProps} from '../models/Article'

const ref = collection(db, "articles");

export const createPost = async(data: Partial<ArticleProps>):Promise<void> => {
  const completeArticle = validateArticle({...data});

  try{
    await addDoc(ref, completeArticle);
  }catch(e){
    throw e;
  }
}

export const deletePost = async(id:string):Promise<void>=>{
  await deleteDoc(doc(db, "articles", id));
}

export const updatePostById = async(id: string, data: Partial<ArticleProps>):Promise<void> =>{
  const validate = validateArticleUpdate(data);
  await updateDoc(doc(db,"articles", id), validate);
}

export const getPostById = async(id: string):Promise<ArticleProps> => {
  const snapshot = await getDoc(doc(db, "articles", id));
  if (!snapshot.exists()) throw new Error(`Article with ID ${id} not found.`);
  return transform(snapshot.id, {...snapshot.data() as ArticleProps})
}

export const getAllPosts = async() => {
  const snapshot =  await getDocs(ref);
  return snapshot.docs.map(doc => transform(doc.id, {...doc.data() as ArticleProps}));
}

export const getLatestPosts = async(max = 5): Promise<ArticleProps[]> => {
  const q = query(
    ref,
    where("status", "==", "PUBLISHED"),
    orderBy("createdAt", "desc"),
    limit(max)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => transform(doc.id, {...doc.data() as ArticleProps}));
}
