import {collection, addDoc, getDocs, updateDoc, getDoc, deleteDoc, doc} from 'firebase/firestore';
import {db} from './firebase';
import {validateArticle, transform} from '../models/Article'
import type {ArticleProps} from '../models/Article'

const ref = collection(db, "articles");

export const createPost = async(data: Partial<ArticleProps>):Promise<void> => {
  const completeArticle = validateArticle({...data});

  try{
    await addDoc(ref, completeArticle);
  }catch(e){
    throw new Error(`Error ${e}`);
  }
}

export const deletePost = async(id:string):Promise<void>=>{
  await deleteDoc(doc(db, "articles", id));
}

export const updatePostById = async(id: string, data: Partial<ArticleProps>):Promise<void> =>{
  const validate = validateArticle(data);
  await updateDoc(doc(db,"articles", id), {...validate});
}

export const getPostById = async(id: string):Promise<ArticleProps> => {
  const snapshot = await getDoc(doc(db, "articles", id));
  return transform(snapshot.id, {...snapshot.data() as ArticleProps})
}

export const getAllPosts = async() => {
  const snapshot =  await getDocs(ref);
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
}
