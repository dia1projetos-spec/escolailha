/**
 * Firebase Configuration
 * Colégio Ilha Brasil
 * Desenvolvido por: Henrique Siqueira
 * 
 * INSTRUÇÕES DE CONFIGURAÇÃO:
 * 
 * 1. Acesse o Firebase Console: https://console.firebase.google.com/
 * 2. Crie um novo projeto ou selecione um existente
 * 3. Adicione um app Web ao seu projeto
 * 4. Copie as credenciais fornecidas pelo Firebase
 * 5. Cole as credenciais na seção firebaseConfig abaixo
 * 6. Ative os seguintes serviços no Firebase:
 *    - Authentication (Email/Password e Google)
 *    - Firestore Database
 *    - Storage (opcional, para upload de imagens)
 * 7. Configure as regras de segurança do Firestore e Storage
 */

// ==========================================
// FIREBASE SDK IMPORTS
// ==========================================

// Import the functions you need from the Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore,
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

// TODO: Substitua com suas credenciais do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-XXXXXXXXXX" // Opcional
};

// ==========================================
// INITIALIZE FIREBASE
// ==========================================

let app;
let auth;
let db;
let storage;

try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase Authentication
    auth = getAuth(app);
    
    // Initialize Cloud Firestore
    db = getFirestore(app);
    
    // Initialize Cloud Storage
    storage = getStorage(app);
    
    console.log('✅ Firebase inicializado com sucesso');
} catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
}

// ==========================================
// AUTHENTICATION HELPER FUNCTIONS
// ==========================================

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

/**
 * Sign in with Google
 */
export const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        throw error;
    }
};

/**
 * Sign out current user
 */
export const logout = async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
    }
};

/**
 * Register new user with email and password
 */
export const registerWithEmail = async (email, password, displayName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile with display name
        if (displayName) {
            await updateProfile(userCredential.user, {
                displayName: displayName
            });
        }
        
        // Create user document in Firestore
        await createUserDocument(userCredential.user.uid, {
            email,
            displayName: displayName || '',
            createdAt: serverTimestamp(),
            role: 'student' // Default role
        });
        
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        throw error;
    }
};

/**
 * Check authentication state
 */
export const checkAuthState = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// ==========================================
// FIRESTORE HELPER FUNCTIONS
// ==========================================

/**
 * Create user document in Firestore
 */
export const createUserDocument = async (userId, userData) => {
    try {
        await setDoc(doc(db, 'users', userId), userData);
        return true;
    } catch (error) {
        console.error('Erro ao criar documento de usuário:', error);
        throw error;
    }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            throw new Error('Usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        throw error;
    }
};

/**
 * Update user data in Firestore
 */
export const updateUserData = async (userId, data) => {
    try {
        await updateDoc(doc(db, 'users', userId), {
            ...data,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        throw error;
    }
};

/**
 * Create a new document in a collection
 */
export const createDocument = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar documento:', error);
        throw error;
    }
};

/**
 * Get documents from a collection with optional filters
 */
export const getDocuments = async (collectionName, filters = []) => {
    try {
        let q = collection(db, collectionName);
        
        if (filters.length > 0) {
            q = query(q, ...filters);
        }
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar documentos:', error);
        throw error;
    }
};

/**
 * Delete a document
 */
export const deleteDocument = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return true;
    } catch (error) {
        console.error('Erro ao deletar documento:', error);
        throw error;
    }
};

// ==========================================
// STORAGE HELPER FUNCTIONS
// ==========================================

/**
 * Upload file to Firebase Storage
 */
export const uploadFile = async (file, path) => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw error;
    }
};

/**
 * Delete file from Firebase Storage
 */
export const deleteFile = async (path) => {
    try {
        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
        return true;
    } catch (error) {
        console.error('Erro ao deletar arquivo:', error);
        throw error;
    }
};

// ==========================================
// EXPORTS
// ==========================================

export {
    auth,
    db,
    storage,
    GoogleAuthProvider,
    where,
    orderBy,
    limit,
    serverTimestamp
};

// ==========================================
// USAGE EXAMPLES
// ==========================================

/*

// Example 1: Login with email and password
try {
    const user = await loginWithEmail('user@example.com', 'password123');
    console.log('Logged in:', user);
} catch (error) {
    console.error('Login failed:', error);
}

// Example 2: Login with Google
try {
    const user = await loginWithGoogle();
    console.log('Logged in with Google:', user);
} catch (error) {
    console.error('Google login failed:', error);
}

// Example 3: Check auth state
checkAuthState((user) => {
    if (user) {
        console.log('User is logged in:', user);
    } else {
        console.log('User is logged out');
    }
});

// Example 4: Get user data
try {
    const userData = await getUserData('userId123');
    console.log('User data:', userData);
} catch (error) {
    console.error('Failed to get user data:', error);
}

// Example 5: Create a news post
try {
    const postId = await createDocument('news', {
        title: 'Nova Notícia',
        content: 'Conteúdo da notícia...',
        author: 'Admin',
        category: 'Educação'
    });
    console.log('Post created with ID:', postId);
} catch (error) {
    console.error('Failed to create post:', error);
}

// Example 6: Get news posts with filters
try {
    const posts = await getDocuments('news', [
        where('category', '==', 'Educação'),
        orderBy('createdAt', 'desc'),
        limit(10)
    ]);
    console.log('News posts:', posts);
} catch (error) {
    console.error('Failed to get posts:', error);
}

// Example 7: Upload image
try {
    const file = document.getElementById('fileInput').files[0];
    const imageUrl = await uploadFile(file, `images/${Date.now()}_${file.name}`);
    console.log('Image uploaded:', imageUrl);
} catch (error) {
    console.error('Upload failed:', error);
}

*/
