import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

const provider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function signOutUser() {
  await signOut(auth)
}

// Called after Google sign-in to set up user doc + family doc if first time
export async function initializeUserData(user) {
  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data().familyId
  }

  // New user — create a family for them
  const familyRef = doc(db, 'families', user.uid) // use uid as familyId for simplicity
  await setDoc(familyRef, {
    members: [user.uid],
    displayName: `${user.displayName?.split(' ')[0]}'s Family`,
    createdAt: serverTimestamp(),
  })

  await setDoc(userRef, {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    familyId: user.uid,
    createdAt: serverTimestamp(),
  })

  return user.uid
}

// Join an existing family by entering its familyId
export async function joinFamily(uid, familyId) {
  const familyRef = doc(db, 'families', familyId)
  const familySnap = await getDoc(familyRef)
  if (!familySnap.exists()) throw new Error('Family not found. Check the ID and try again.')

  await updateDoc(familyRef, { members: arrayUnion(uid) })
  await updateDoc(doc(db, 'users', uid), { familyId })
  return familyId
}
