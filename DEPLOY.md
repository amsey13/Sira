# 🚀 GUIDE DE DÉPLOIEMENT - Frise Mecquoise

## ⚡ CHOIX RECOMMANDÉ : **VERCEL** (La Plus Facile)

---

## **OPTION 1 : Déployer sur Vercel** ✨ (2 minutes)

### ✅ Étape 1 : Créer un Repository GitHub

1. Va sur https://github.com/new
2. Remplis :
   - **Repository name** : `frise-mecquoise`
   - **Description** : `Interactive Timeline - Islamic History`
   - **Public** (cochée)
3. Clique **"Create repository"**

### ✅ Étape 2 : Push ton code sur GitHub

Ouvre **PowerShell** dans le dossier du projet et lance :

```powershell
git init
git add .
git commit -m "Initial commit - Frise Mecquoise"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/frise-mecquoise.git
git push -u origin main
```

**Remplace `TON_USERNAME` par ton pseudo GitHub !**

### ✅ Étape 3 : Déployer sur Vercel

1. Va sur https://vercel.com
2. Clique **"Sign Up"** → **"Continue with GitHub"**
3. Connecte ton compte GitHub
4. Une fois connecté, clique **"New Project"**
5. Cherche et clique sur **`frise-mecquoise`**
6. Clique **"Import"**
7. Laisse les réglages par défaut (Vercel détecte Vue automatiquement)
8. Clique **"Deploy"**

**🎉 C'est FINI ! Ton site sera live en 1-2 minutesà l'URL : `frise-mecquoise.vercel.app`**

---

## **OPTION 2 : GitHub Pages** (Alternative)

### ✅ Étape 1-2 : Même processus que Vercel (créer repo et push)

### ✅ Étape 3 : Build et Déployer

```powershell
# Build le projet
npm run build

# Installe le déployeur de GitHub Pages
npm install --save-dev gh-pages

# Déploie  gh-pages -d dist
```

**🎉 Accessible à : `https://TON_USERNAME.github.io/frise-mecquoise`**

---

## 📊 COMPARAISON

| Critère | Vercel | GitHub Pages |
|---------|--------|-------------|
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Vitesse** | ⚡ Super rapide | ✅ Rapide |
| **Domaine gratuit** | `*.vercel.app` | `*.github.io` |
| **Custom domain** | Oui, gratuit | Oui, gratuit |
| **Auto-deploy** | ✅ Oui (push = deploy) | ❌ Manuel |
| **Support Student** | ✅ Inclus | ✅ Inclus |

---

## 💡 **MES RECOMMANDATIONS**

### 🥇 **VERCEL** = Meilleur choix !
- Deploy automatiquesplus rapides
- Meilleure UX
- Mise à jour instantanée à chaque push

### 🥈 **GitHub Pages** = Plus simple statiquement
- Tout sur GitHub
- Pas de compte externe
- Parfait si tu veux rester 100% GitHub

---

## ✨ **CE QUE TU PEUX FAIRE APRÈS**

Une fois déployé :
- 📱 Partager le lien partout
- 🔗 Custom domain : tutoriel sur Vercel/GitHub Pages settings
- 📊 Analytics gratuits (Vercel)
- 🔐 SSL automatique (gratuit sur Vercel & GitHub Pages)

---

## 🎯 **PROCHAINES ÉTAPES RECOMMANDÉES**

1. **Setup Vercel** (5 min)
2. **Ajoute un custom domain** si tu en as un (optionnel)
3. **Partage l'URL** ! 🎉

---

**Questions ?** Relance-moi si tu es bloqué ! 🚀

