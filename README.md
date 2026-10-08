# Capital Quest Grid

Sujet : Création d'un jeu de grille "Capital Grid" (Style Metrodoku / Tiki Taka Toe)

"Bonjour ! Je souhaite créer une application web de jeu de réflexion basée sur les capitales du monde, inspirée du concept de metrodoku.fr ou tiki-taka-toe. Je ne sais pas coder, nous allons donc utiliser une approche 'Vibe Coding'. Aide-moi étape par étape.

1. Le Concept du Jeu

Une grille de 3x3 cases.

En haut de chaque colonne et à gauche de chaque ligne, il y a une condition (ex: 'En Europe', 'Ville avec métro', 'Fondée après 1500', 'Pays majoritairement musulman').

Le joueur doit trouver une capitale qui remplit les deux conditions (intersection ligne/colonne).

2. Fonctionnalités clés

Barre de recherche prédictive : Quand l'utilisateur tape des lettres dans une case, une liste déroulante propose les capitales correspondantes pour éviter les erreurs d'orthographe.

Système de vies : Le joueur commence avec 3 vies. Une mauvaise réponse = une vie en moins. À 0 vie, la partie s'arrête.

Score de rareté : Le score est calculé selon l'inverse de la population de la ville (plus une ville est petite/méconnue, plus elle rapporte de points).

Grille Quotidienne : La grille doit être la même pour tous les utilisateurs chaque jour (génération basée sur la date).

3. Données

J'ai un fichier Excel avec les colonnes : [Nom de la capitale], [Pays], [Continent], [Religion majoritaire], [Année de fondation], [Présence d'un métro (Oui/Non)], [Population].

Explique-moi comment transformer ce fichier en format JSON utilisable par l'application.

4. Ta mission immédiate

Propose-moi une stack technique simple (ex: React + Tailwind + Vite) que je peux lancer en un clic sur une plateforme comme Lovable.dev, Bolt.new ou Cursor.

Donne-moi la structure du fichier de données capitales.json.

Génère le code pour la structure de base de la grille et la logique de vérification des réponses.

Peux-tu commencer par me poser les questions nécessaires sur mes données avant de générer le code ?

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e247aa04-ee8e-4566-9d42-b32f3c16bcb2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
