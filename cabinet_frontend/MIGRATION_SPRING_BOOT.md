# Migration de Firebase vers Spring Boot

## ✅ Fichiers modifiés (Firebase supprimé)

### Hooks
- **`src/hooks/useAuth.tsx`** : Utilise maintenant le token JWT stocké dans localStorage au lieu de Firebase Auth
- **`src/hooks/useUserProfile.tsx`** : Récupère le profil depuis l'API Spring Boot (patients/médecins/assistants)
- **`src/hooks/useDashboardData.tsx`** : Utilise l'API Spring Boot pour récupérer les données du dashboard

### Pages
- **`src/app/login/page.tsx`** : Utilise `authApi.login()` au lieu de Firebase Auth
- **`src/app/dashboard/layout.tsx`** : Supprimé les références Firebase, utilise maintenant Spring Boot
- **`src/components/logout-button.tsx`** : Utilise `authApi.logout()` au lieu de Firebase

### API
- **`src/lib/api/auth.ts`** : Ajout de la méthode `getCurrentUser()` (nécessite un endpoint `/api/users/me` dans le backend)

## ⚠️ Fichiers encore à adapter (utilisent encore Firebase/Firestore)

Ces fichiers utilisent encore Firestore pour stocker des données. Vous devrez les adapter pour utiliser l'API Spring Boot :

1. **`src/app/register/page.tsx`** : Utilise Firebase Auth et Firestore
   - À adapter pour utiliser `authApi.registerPatient/Medecin/Assistant()`

2. **`src/app/dashboard/dossiers/page.tsx`** : Utilise Firestore
   - À adapter pour utiliser `dossiersApi` (déjà créé)

3. **`src/app/dashboard/dossiers/nouveau/page.tsx`** : Utilise Firestore
   - À adapter pour utiliser `dossiersApi.create()`

4. **`src/app/dashboard/dossiers/[id]/page.tsx`** : Utilise Firestore
   - À adapter pour utiliser `dossiersApi.get()`

5. **`src/app/dashboard/clients/nouveau/page.tsx`** : Utilise Firestore
   - À adapter pour utiliser l'API patients (ou créer une API clients si nécessaire)

## 📝 Notes importantes

### Authentification
- Le token JWT est stocké dans `localStorage` avec la clé `authToken`
- Le hook `useAuth` décode le token JWT pour obtenir les informations de base
- Pour un meilleur fonctionnement, ajoutez un endpoint `/api/users/me` dans votre backend Spring Boot

### Endpoint recommandé dans le backend

Ajoutez cet endpoint dans `UserController.java` :

```java
@GetMapping("/me")
public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
    String username = authentication.getName();
    Optional<user> userOpt = userRepo.findByUsername(username);
    if (userOpt.isPresent()) {
        user user = userOpt.get();
        UserDTO dto = UserDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .nom(user.getNom())
            .prenom(user.getPrenom())
            .telephone(user.getTelephone())
            .build();
        return ResponseEntity.ok(dto);
    }
    return ResponseEntity.notFound().build();
}
```

Puis modifiez `useUserProfile.tsx` pour utiliser :

```typescript
const userData = await authApi.getCurrentUser();
```

### Fichier firebase.ts

Le fichier `src/lib/firebase.ts` peut être supprimé si vous n'utilisez plus Firebase du tout. Sinon, vous pouvez le garder pour une migration progressive.

## 🚀 Prochaines étapes

1. Adapter les pages de dossiers pour utiliser `dossiersApi`
2. Adapter la page d'inscription pour utiliser `authApi.register*()`
3. Adapter la page clients pour utiliser l'API patients
4. Ajouter l'endpoint `/api/users/me` dans le backend
5. Tester l'authentification complète
6. Supprimer le fichier `firebase.ts` si plus utilisé

