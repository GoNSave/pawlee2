import { fireDb } from "../fireConfig";
import { userDocName, chatDocName, questionsDocName } from "./../constants";

import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";

export const saveMessage = async (message, answer) => {
  const user = await getUser({
    telegramId: message.from.id,
    firstName: message.from.first_name,
    lastName: message.from.last_name,
    language: message.from.language_code,
  });

  const chatRef = doc(
    fireDb,
    `${userDocName}/${user.id}/${chatDocName}`,
    `${message.date}`
  );
  await setDoc(chatRef, {
    question: message.text,
    answer,
  });
};

export const getUser = async (user) => {
  const q = query(
    collection(fireDb, userDocName),
    where("telegramId", "==", user.telegramId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return addUser(user);
  }
  return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
};

export const updateUser = async (user) => {
  console.log("Updating user", user);
  const q = query(
    collection(fireDb, userDocName),
    where("telegramId", "==", user.telegramId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return addUser(user);
  }

  const docRef = querySnapshot.docs[0].ref;
  await updateDoc(docRef, user);
  const docSnapshot = await getDoc(docRef);
  return { id: docSnapshot.id, ...docSnapshot.data() };
};

export const addUser = async (user) => {
  const docRef = await addDoc(collection(fireDb, userDocName), user);
  const docSnapshot = await getDoc(docRef);
  return { id: docSnapshot.id, ...docSnapshot.data() };
};

export const getQuestions = async () => {
  const q = query(collection(fireDb, questionsDocName));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getAnswers = async (questionId) => {
  // /questions/P0XSEF3PUUeJ8Vf8G7z2/answers
  const q = query(
    collection(fireDb, questionsDocName + "/" + questionId + "/" + "answers")
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getUsers = async () => {
  const q = query(collection(fireDb, userDocName));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/*
{
  message_id: 426,
  from: {
    id: 1863422087,
    is_bot: false,
    first_name: 'Ashok',
    last_name: 'Jaiswal',
    language_code: 'en'
  },
  chat: {
    id: 1863422087,
    first_name: 'Ashok',
    last_name: 'Jaiswal',
    type: 'private'
  },
  date: 1676972840,
  text: 'hi'
}
*/
