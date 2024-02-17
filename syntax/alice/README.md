# RSCRIPT Syntaxe pour Matra ALICE 32/90

Plus d'informations sur l'ordinateur <a href="https://fr.wikipedia.org/wiki/Alice_(ordinateur)" target="_new"><b>Matra ALICE</b></a>.</br>
Applications autour de la machine <a href="http://alice32.free.fr/" target="_new"><b>ici</b></a>.

## Liste des commandes supplémentaires
- ### COLOR stylo, papier : Définition de la couleur du prochain caractère
    - "stylo" est un entier compris entre 0 et 8 qui défini la couleur du caractère
    - "papier" est un entier compris entre 0 et 9 qui défini le fond du caractère

- ### LOCATE colonne, ligne : Positionne le curseur texte à l'écran pour le prochain caractère
    - "colonne" est un entier compris entre 0 et 31 (pour l'affichage 32) ou 0 et 39 (pour l'affichage 40)
    - "ligne" en un entier compris erntre 0 et 24.

- ### USERCHAR$ caractère : Affiche à l'écran un caractère redéfinit par l'utilisateur
    - "caractère" est un entier compris entre 0 et 100.