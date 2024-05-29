### Code explication

Dans ce test, j'utilise une approche récursive pour attribuer les gamemasters à chaque salle.
Dans chaque récursive, je attribué tous d'abord des gamemasters qui a une salle.
Puis je trouve des concurrences des salles de tous les gamemasters:

- Si il y a une salle qui a concurrence égale 1 => attribuer
- Sinon, je fais un boucle sur les salles de la première gamemaster et refaire la récursive
