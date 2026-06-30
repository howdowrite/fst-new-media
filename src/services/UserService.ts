import {collection, setDoc, getDocs, getDoc, doc} from 'firebase/firestore';
import {db, auth} from './firebase';
import {createUser, transform} from '../models/User';
import type {UserProps} from '../models/User'
import {createUserWithEmailAndPassword} from 'firebase/auth'

const ref = collection(db, "users");

export async function setUser(data: Partial<UserProps>, password: string): Promise<string>{
  const validated = createUser({...data});

  try{
    const credentials = await createUserWithEmailAndPassword(auth, validated.email!, password);
    const id = credentials.user.uid;
    await setDoc(doc(ref, id), validated);
    return id;

  }catch(e){
    throw new Error(`Error ${e}, inserting ${JSON.stringify(validated)}`)
  }
}

export async function getUserById(id:string):Promise<UserProps> {
  const snapshot = await getDoc(doc(db, "users", id));
  return transform(snapshot.id, {...snapshot.data() as UserProps})
}

export async function getAllUsers(){
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => transform(doc.id, {...doc.data() as UserProps}));

}
