# Projet Angular - Statistiques Olympiques

## Description
Ce projet est une application Angular permettant d'afficher des données sur la participation de différents pays aux Jeux Olympiques. Les utilisateurs peuvent visualiser des graphiques par pays, explorer les médailles remportées et accéder à des détails interactifs.

## Stack technique
- Angular
- RxJS
- ngx-charts (graphiques)
- SCSS pour le style
- Données mockées localement dans `/assets/mock/olympic.json`

## Installation et mise en route
1. Cloner le projet
```bash
git clone <url-du-repo>
cd <nom-du-projet>
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer le serveur de développement
```bash
ng serve
```

4. Accéder à l'application
Ouvrir un navigateur à l'adresse : `http://localhost:4200`

## Structure du projet
```
src/
├── app/
│   ├── app.component.ts        // Composant racine standalone
│   ├── app.routes.ts           // Routes de l'application
│   ├── core/                   // Services, modèles, logiques globales
│   ├── header/ footer/         // Composants structurels
│   └── pages/
│       ├── home/               // Page d'accueil (graphique global)
│       └── country-detail/     // Page de détail pour un pays
├── assets/
│   └── mock/olympic.json       // Données simulées
├── environments/               // Fichiers de config environnement
```

## Fonctionnalités principales
- Chargement des données via un service Angular (OlympicService)
- Utilisation de `BehaviorSubject` pour gérer un cache de données local
- Composants 100% standalone (sans NgModule)
- Routing défini dans `app.routes.ts`
- Responsive adaptatif (vue graphique et légende adaptées à la taille de l'écran)
- Utilisation de `async` pipe dans les templates pour gérer les observables
- Nettoyage manuel des subscriptions pour éviter les fuites mémoires (ex: dans `CountryDetailComponent`)

## Scripts utiles
```bash
ng lint       # Analyse du code
ng test       # Lancement des tests unitaires (si présents)
ng build      # Compilation pour la production
```

## Notes techniques
- Le projet repose sur des composants **standalone**, permettant une meilleure modularité.
- Le service `OlympicService` centralise les appels HTTP et met en cache les données avec un `BehaviorSubject`.
- La méthode `getOlympics()` filtre les `undefined` pour garantir un typage strict.
- Le graphique est géré avec `ngx-charts`, les données sont typées via une interface `OlympicChartData`.
- Le responsive est géré dynamiquement via `@HostListener` dans les composants.


