import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebaseService';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  unitId: string;
  role: 'admin' | 'manager' | 'employee' | 'member';
  employeeId?: string;
  memberId?: string;
  isActive: boolean;
  createdAt: any;
}

export class AuthService {
  // Login
  static async login(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar perfil do usuário no Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('Perfil do usuário não encontrado');
      }

      return userDoc.data() as UserProfile;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Observar mudanças de autenticação
  static onAuthStateChange(callback: (user: UserProfile | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            callback(userDoc.data() as UserProfile);
          } else {
            callback(null);
          }
        } catch (error) {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Atualizar perfil
  static async updateProfile(data: Partial<UserProfile>): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      // Atualizar no Authentication
      if (data.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }

      // Atualizar no Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Resetar senha
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Verificar se usuário é admin
  static isAdmin(user: UserProfile): boolean {
    return user.role === 'admin';
  }

  // Verificar permissão de unidade
  static hasUnitAccess(user: UserProfile, unitId: string): boolean {
    return user.unitId === unitId || user.role === 'admin';
  }

  // Obter usuário atual
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Verificar se está autenticado
  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
}

export default AuthService;
