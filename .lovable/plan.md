# Capital Grid — Jeu quotidien des capitales

Un jeu de réflexion 3x3 où le joueur doit trouver des capitales correspondant à l'intersection de deux conditions (ligne × colonne). Une grille unique par jour, identique pour tous.

## Stack technique

- **React + Vite + TypeScript** (déjà en place)
- **Tailwind CSS + shadcn/ui** pour l'interface (déjà en place)
- **LocalStorage** pour sauvegarder la progression du jour
- Pas de backend nécessaire

## Données — `src/data/capitals.json`

Échantillon de 30 capitales mondiales avec la structure suivante :

```json
[
  {
    "name": "Tokyo",
    "country": "Japon",
    "continent": "Asie",
    "religion": "Bouddhiste",
    "foundedYear": 1457,
    "hasMetro": true,
    "population": 13960000
  }
]
```

Sélection variée pour que toutes les conditions aient des réponses : capitales européennes, asiatiques, africaines, américaines, avec/sans métro, religions diverses, anciennes/récentes, populations très variables (de Reykjavik ~135k à Tokyo ~14M).

## Conditions de grille

Quatre familles de conditions, mélangées aléatoirement (mais déterministes par date) :

- **Continent** : « En Europe », « En Asie », « En Afrique », « En Amérique », « En Océanie »
- **Métro** : « Possède un métro », « Sans métro »
- **Religion majoritaire** : « Pays chrétien », « Pays musulman », « Pays bouddhiste », « Pays hindou »
- **Fondation** : « Fondée avant 1000 », « Fondée après 1500 », « Fondée avant 1500 »

Le générateur garantit qu'aucune ligne/colonne ne soit en doublon et que chaque intersection ait au moins une réponse valide.

## Gameplay

- **Grille 3×3** : 3 conditions en colonnes (haut), 3 en lignes (gauche)
- **Clic sur une case vide** → ouvre un champ de recherche avec autocomplétion (liste filtrée des capitales par lettres tapées)
- **Validation** :
  - Si la capitale satisfait les deux conditions ET n'a pas déjà été utilisée → case validée, affichage du nom + score
  - Sinon → -1 vie, secousse de la case, message d'erreur
- **3 vies** affichées en cœurs en haut de l'écran
- **Fin de partie** : 9 cases remplies (victoire) OU 0 vie (défaite)

## Score de rareté

Formule **pourcentage inverse strict** :

```
score_case = round((1 - population_ville / population_max_du_jeu) × 100)
```

- Population max calculée sur l'ensemble du dataset
- Reykjavik (135k) ≈ 99 pts ; Tokyo (14M) ≈ 0 pt
- Score total = somme des scores des 9 cases (max ~900)

## Mode quotidien

- Génération **déterministe** basée sur la date (YYYY-MM-DD) → même grille pour tous les joueurs un jour donné
- **LocalStorage** stocke : date de la grille jouée, cases remplies, vies restantes, score, statut (en cours / gagné / perdu)
- Au rechargement : la partie reprend là où elle s'est arrêtée
- À minuit : nouvelle grille, ancien résultat archivé localement (historique simple)

## Interface

```text
┌─────────────────────────────────────┐
│  Capital Grid       ❤️❤️❤️   245 pts │
├─────────────────────────────────────┤
│             │ Europe │ Métro │ <1500│
│  Chrétien   │   ?    │   ?   │   ?  │
│  Asie       │   ?    │   ?   │   ?  │
│  >1M hab.   │   ?    │   ?   │   ?  │
└─────────────────────────────────────┘
        [ Nouvelle partie demain ]
```

- Design épuré, cartes shadcn, responsive (mobile-first vu le viewport)
- Animations légères : flip de carte à la validation, shake en cas d'erreur
- Modale de fin de partie : récap score + partage texte (style Wordle)

## Étapes de construction

1. Créer `src/data/capitals.json` (30 capitales) et les types TypeScript associés
2. Créer le générateur de grille déterministe (`src/lib/dailyGrid.ts`) avec seed basé sur la date
3. Construire la logique de validation et de score (`src/lib/gameLogic.ts`)
4. Créer le hook `useDailyGame` qui gère état + persistance localStorage
5. Construire les composants : `GameHeader` (titre, vies, score), `Grid`, `Cell`, `CapitalSearch` (autocomplétion via Command shadcn), `EndGameDialog`
6. Assembler dans `src/pages/Index.tsx` et appliquer le design system

## Détails techniques

- **Seed quotidien** : hash simple de la date (ex: somme des codes char de YYYY-MM-DD) utilisée par un PRNG mulberry32 pour piocher conditions + ordre
- **Autocomplétion** : composant `Command` de shadcn (déjà disponible), filtre insensible à la casse/accents
- **Validation des intersections** : précalcul à la génération pour garantir qu'aucune case n'est impossible à résoudre
- **Persistance** : clé `capital-grid-YYYY-MM-DD` dans localStorage, JSON stringifié
