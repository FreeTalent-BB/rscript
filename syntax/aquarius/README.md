# RSCRIPT Syntaxe pour Mattel Aquarius

Plus d'informations sur l'ordinateur <a href="https://en.wikipedia.org/wiki/Mattel_Aquarius" target="_new"><b>Mattel Aquarius</b></a>.</br>
Emulateur de la machine <a href="https://aquarius.je/aqualite/" target="_new"><b>Aqualite</b></a>.</br>
Aquarius Draw (outil de dessin online) <a href="https://aquarius.mattpilz.com/draw/" target="_new"><b>Aquarius Draw</b></a>

## Liste des commandes supplémentaires
- ### BORDER couleur : Définition de la couleur de la bordure d'écran
    - "couleur" est un entier compris entre 0 et 15 qui défini la couleur

- ### CHAR$ caractère : Affiche à l'écran un caractère redéfinit par l'utilisateur
    - "caractère" est un entier compris entre 48 et 160.

- ### CLS couleur : Efface l'écran avec une couleur
    - "couleur" est un entier compris entre 0 et 15 qui défini la couleur.

- ### COLOR stylo, papier : Définition de la couleur du prochain caractère
    - "stylo" est un entier compris entre 0 et 15 qui défini la couleur du caractère
    - "papier" est un entier compris entre 0 et 15 qui défini le fond du caractère

- ### IMAGE données : Affiche une image créée avec <a href="https://aquarius.mattpilz.com/draw/" target="_new"><b>Aquarius Draw</b></a>
    - "données" est le numéro de la première ligne des DATA de l'image.

- ### LOCATE colonne, ligne : Positionne le curseur texte à l'écran pour le prochain caractère
    - "colonne" est un entier compris 0 et 39
    - "ligne" en un entier compris entre 0 et 23.

- ### TEXT$ texte : Affiche un texte à l'écran à la position du curseur courante
    - "texte$" est une chaine.
