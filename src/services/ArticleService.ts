import {collection, addDoc, getDocs } from 'firebase/firestore';
import {db} from './firebase';
import {createArticle} from '../models/Article'
import type {ArticleProps} from '../models/Article'

const ref = collection(db, "articles");

export const createPost = async(data: Partial<ArticleProps>):Promise<void> => {
  const completeArticle = createArticle({...data});

  try{
    await addDoc(ref, completeArticle);
  }catch(e){
    throw new Error(`Error ${e}, inserting ${JSON.stringify(completeArticle)}`)
  }
}

export const getAllPosts = async() => {
  const snapshot =  await getDocs(ref);
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
}
