
import React, { createContext, useContext, ReactNode } from 'react';

type TranslationContextType = {
  t: (key: string) => string;
};

const translations: Record<string, string> = {
  // Auth
  "Sign in": "Se connecter",
  "Sign up": "S'inscrire",
  "Email": "Email",
  "Password": "Mot de passe",
  "Forgot password?": "Mot de passe oublié ?",
  "Don't have an account?": "Vous n'avez pas de compte ?",
  "Already have an account?": "Vous avez déjà un compte ?",
  "Confirm Password": "Confirmer le mot de passe",
  "Create account": "Créer un compte",
  "Creating account...": "Création du compte...",
  "Enter your details below to create your account": "Entrez vos informations ci-dessous pour créer votre compte",
  "Enter your credentials to access your account": "Entrez vos identifiants pour accéder à votre compte",
  "Signing in...": "Connexion en cours...",
  "Registration Successful": "Inscription réussie",
  "Please check your email to verify your account.": "Veuillez vérifier votre email pour confirmer votre compte.",
  "Back to Sign In": "Retour à la connexion",
  
  // Dashboard
  "Dashboard": "Tableau de bord",
  "Your medical education, simplified": "Votre formation médicale, simplifiée",
  "MedEd Navigator": "MedEd Navigator",
  "Your medical education platform": "Votre plateforme de formation médicale",
  
  // Navigation
  "Back to Dashboard": "Retour au tableau de bord",
  "Admin Panel": "Panneau d'administration",
  "Profile": "Profil",
  "Settings": "Paramètres",
  "Log out": "Déconnexion",
  "Administrator": "Administrateur",
  "Student": "Étudiant",
  
  // Specialties
  "Add Specialty": "Ajouter une spécialité",
  "Add New Specialty": "Ajouter une nouvelle spécialité",
  "Name": "Nom",
  "Description": "Description",
  "Image URL (optional)": "URL de l'image (optionnel)",
  "Specialty name": "Nom de la spécialité",
  "Brief description": "Brève description",
  "Creating...": "Création en cours...",
  "Create Specialty": "Créer une spécialité",
  "Delete Specialty": "Supprimer la spécialité",
  "Are you sure you want to delete": "Êtes-vous sûr de vouloir supprimer",
  "This action cannot be undone.": "Cette action ne peut pas être annulée.",
  "Cancel": "Annuler",
  "Delete": "Supprimer",
  "Manage": "Gérer",
  "No specialties available": "Aucune spécialité disponible",
  "Click \"Add Specialty\" to create your first specialty.": "Cliquez sur \"Ajouter une spécialité\" pour créer votre première spécialité.",
  "Admin only": "Administrateur uniquement",
  "Select a lecture to view questions and start learning": "Sélectionnez un cours pour voir les questions et commencer à apprendre",
  
  // Lectures
  "Add Lecture": "Ajouter un cours",
  "Add New Lecture": "Ajouter un nouveau cours",
  "Lecture title": "Titre du cours",
  "Creating Lecture...": "Création du cours...",
  "Create Lecture": "Créer un cours",
  "Back to Specialty": "Retour à la spécialité",
  "Add Question": "Ajouter une question",
  "Start Lecture": "Commencer le cours",
  "No description available": "Aucune description disponible",
  "of": "sur",
  "Complete": "Terminé",
  
  // Questions
  "Edit Question": "Modifier la question",
  "Add New Question": "Ajouter une nouvelle question",
  "Question Text": "Texte de la question",
  "Question Number": "Numéro de la question",
  "Session": "Session",
  "Course Reminder": "Rappel du cours",
  "Reference Answer": "Réponse de référence",
  "Enter question text...": "Entrez le texte de la question...",
  "Enter question number": "Entrez le numéro de la question",
  "e.g., Session 2022": "ex., Session 2022",
  "Enter educational reminder or background information...": "Entrez un rappel éducatif ou des informations contextuelles...",
  "Enter reference answer...": "Entrez la réponse de référence...",
  "Answers & Explanations": "Réponses & Explications",
  "Question Content": "Contenu de la question",
  "Answer Text": "Texte de la réponse",
  "Explanation": "Explication",
  "Option": "Option",
  "Mark as Correct": "Marquer comme correcte",
  "Correct": "Correcte",
  "Submit Answer": "Soumettre la réponse",
  "Next Question": "Question suivante",
  "Correct!": "Correct !",
  "Incorrect": "Incorrect",
  "Show explanation": "Afficher l'explication",
  "Hide explanation": "Masquer l'explication",
  "Multiple Choice": "Choix multiple",
  "Open Question": "Question ouverte",
  "Select all correct answers:": "Sélectionnez toutes les réponses correctes :",
  "Review your answers below:": "Revoyez vos réponses ci-dessous :",
  "Additional Information:": "Informations supplémentaires :",
  "Reference Answer:": "Réponse de référence :",
  "Rappel du cours:": "Rappel du cours :",
  
  // Question Management
  "Create Question": "Créer une question",
  "Update Question": "Mettre à jour la question",
  "Edit": "Modifier",
  "Saving...": "Enregistrement...",
  "Question Type": "Type de question",
  "Select question type": "Sélectionnez le type de question",
  
  // Completion
  "Lecture Complete!": "Cours terminé !",
  "You've completed all questions in this lecture.": "Vous avez terminé toutes les questions de ce cours.",
  "Restart Lecture": "Recommencer le cours",
  
  // Empty States
  "No questions available": "Aucune question disponible",
  "This lecture doesn't have any questions yet. Be the first to add one!": "Ce cours n'a pas encore de questions. Soyez le premier à en ajouter une !",
  "Add First Question": "Ajouter la première question",
  "No questions yet": "Pas encore de questions",
  "Add your first question to this lecture to help students learn.": "Ajoutez votre première question à ce cours pour aider les étudiants à apprendre.",
  "Add Your First Question": "Ajoutez votre première question",
  "Specialty not found": "Spécialité non trouvée",
  "The specialty you're looking for doesn't exist or has been removed.": "La spécialité que vous recherchez n'existe pas ou a été supprimée.",
  
  // Admin
  "Manage Specialties": "Gérer les spécialités",
  "Back to Admin": "Retour à l'administration",
  "Manage:": "Gérer :",
  "Add or edit questions for this lecture": "Ajouter ou modifier des questions pour ce cours",
  "Create a new question": "Créer une nouvelle question",
  "Are you sure you want to delete this question?": "Êtes-vous sûr de vouloir supprimer cette question ?",
  "Why is this answer correct/incorrect?": "Pourquoi cette réponse est-elle correcte/incorrecte ?",
  
  // Errors
  "An unexpected error occurred": "Une erreur inattendue s'est produite",
  "Error": "Erreur",
  "Failed to delete specialty. Please try again.": "Échec de la suppression de la spécialité. Veuillez réessayer.",
  "Validation Error": "Erreur de validation",
  "Specialty name is required.": "Le nom de la spécialité est obligatoire.",
  "Lecture title is required.": "Le titre du cours est obligatoire.",
  "Authentication required": "Authentification requise",
  "Permission denied": "Permission refusée",
  "Cannot delete specialty": "Impossible de supprimer la spécialité",
  "This specialty has lectures associated with it. Delete those first.": "Cette spécialité a des cours associés. Supprimez-les d'abord.",
  
  // Success messages
  "Success": "Succès",
  "Specialty has been created successfully.": "La spécialité a été créée avec succès.",
  "Lecture has been created successfully.": "Le cours a été créé avec succès.",
  "Specialty deleted": "Spécialité supprimée",
  "The specialty has been successfully removed": "La spécialité a été supprimée avec succès",
};

// Fallback to the original text if no translation is found
const translate = (key: string): string => {
  return translations[key] || key;
};

const TranslationContext = createContext<TranslationContextType>({
  t: translate,
});

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TranslationContext.Provider value={{ t: translate }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
