
// This file is now just a re-export file to maintain backward compatibility
// All functionality has been moved to the auth/ directory
export {
  signIn,
  signInWithGoogle,
  signUp,
  signOut,
  getCurrentUser,
  resetPassword,
  updatePassword
} from './auth/index';
