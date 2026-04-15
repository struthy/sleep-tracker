import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import { updateChildProfile } from '../services/auth'

const AuthContext = createContext(null)

function calcAge(birthYear) {
  if (!birthYear) return null
  return new Date().getFullYear() - birthYear
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [familyId, setFamilyId] = useState(null)
  const [childName, setChildName] = useState('')
  const [childBirthYear, setChildBirthYear] = useState(null)
  const [childSex, setChildSex] = useState(null)
  const [childPhotoDataURL, setChildPhotoDataURL] = useState(null)
  const [childNotes, setChildNotes] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userSnap.exists()) {
            const fid = userSnap.data().familyId
            setFamilyId(fid)
            const familySnap = await getDoc(doc(db, 'families', fid))
            if (familySnap.exists()) {
              const d = familySnap.data()
              setChildName(d.childName ?? '')
              setChildBirthYear(d.childBirthYear ?? null)
              setChildSex(d.childSex ?? null)
              setChildPhotoDataURL(d.childPhotoDataURL ?? null)
              setChildNotes(d.childNotes ?? '')
            }
          }
        } catch {
          // User doc doesn't exist yet — handled in LoginPage after sign-in
        }
      } else {
        setUser(null)
        setFamilyId(null)
        setChildName('')
        setChildBirthYear(null)
        setChildSex(null)
        setChildPhotoDataURL(null)
        setChildNotes('')
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function saveChildProfile(fields) {
    if (!familyId) return
    await updateChildProfile(familyId, fields)
    if ('childName' in fields) setChildName(fields.childName ?? '')
    if ('childBirthYear' in fields) setChildBirthYear(fields.childBirthYear ?? null)
    if ('childSex' in fields) setChildSex(fields.childSex ?? null)
    if ('childPhotoDataURL' in fields) setChildPhotoDataURL(fields.childPhotoDataURL ?? null)
    if ('childNotes' in fields) setChildNotes(fields.childNotes ?? '')
  }

  const childAge = calcAge(childBirthYear)
  const isProfileComplete = !!childName

  return (
    <AuthContext.Provider value={{
      user, familyId, setFamilyId, loading,
      childName, childBirthYear, childSex, childPhotoDataURL, childNotes,
      childAge, isProfileComplete, saveChildProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
