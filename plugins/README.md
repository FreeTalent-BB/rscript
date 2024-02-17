# Plugins pour RSCRIPT


## img2char
Ce plugin génère le code BASIC pour la redéfinition de caractères pour une machine ciblée, à partir d'une image donnée.

Exemple d'utilisation avec le tag <b>#plugin</b> :
```
#plugin img2char source=./graphics/sprites.png m=thomson ns=0 cl=yes o=./inc/SPRITES.rscript
```
Liste des paramètres:
- source : chemine de l'image à utiliser (obligatoire)
- m : Nom de la machine cible. Les machines supportées sont : cpc, thomson, exelvision, vg5000 et alice (facultatif "cpc" par défaut)
- o : Chemin du fichier basic de sortie (facultatif "output.rscript" par défaut)
- ns : Numéro du premier caractère (facultatif 32 par défaut)
- n : Nombre de caractères à capturer (facultatif 127 par défaut)
- c : Couleur au format HTML (#RRGGBB) à prendre en compte sur l'image (facultatif "#FFFFFF" par défaut)
- s : Espace en pixel à prendre en compte sur l'image lors de la capture( facultatif 0 par défaut)
- cl : Supprime les doublons et les caractères vides ( facultatif "no" par défaut);
- eteg : Pour le VG5000 uniquement "et" ou "eg". Type de caractères à redéfinir (facultatif "et" par défaut)

Le fichier généré est composé d'un code de chargement et d'un ensemble de lignes "DATA ...". Voici un exemple généré pour l'Amstrad CPC :

```basic
    SYMBOL AFTER 127
    FOR I=0 TO 2
    READ A$,B$,C$,D$,E$,F$,G$,H$
    SYMBOL 127+I,VAL("&"+A$),VAL("&"+B$),VAL("&"+C$),VAL("&"+D$),VAL("&"+E$),VAL("&"+F$),VAL("&"+G$),VAL("&H$)
    NEXT I

    DATA FE,FE,FE,0,7F,7F,7F,0
    DATA FF,81,81,81,81,81,81,FF
```

## tmx2bas
Ce plugin génère le code BASIC d'une carte de jeu, à partir d'une carte créée avec l'application <a href="https://www.mapeditor.org/" target="_new"><b>TILED</b></a>.

Exemple d'utilisation avec le tag <b>#plugin</b> :
```
#plugin tmx2char source=./map/levels.tmx o=./inc/LEVELS.rscript
```
Liste des paramètres:
- source : chemin du fichier .TMX de la carte (obligatoire)
- c : Compression ("none" ( pas de compression ) ou "rle").(facultatif "none" par défaut). La compresseion "rle" peut faire gagner quelques octets de mémoire à votre programme.
- o : Chemin du fichier basic de sortie (facultatif "output.rscript" par défaut)
- max : Maximum de données par ligne de "DATA" (facultatif 8 par défaut)
- f: Format type. Peut être "dec", "hex" ou "str". (facultatif "dec" par défaut)
    - dec : Les données seront stockées sous la forme d'entier ( DATA 1,2,3,4,...)
	- hex : Les données seront stockées sous forme hexadécimale ( DATA AA,BB,CC, DD,...' )
	- str : Les données seront stockées sous forme de chaine (DATA "0123456ABCD...")
- rl : Ajoute une étiquette avant chaque données de tableau. Peut être "no" ou "yes". (facultatyig "no" by default).

Le fichier généré est composé d'un ensemble de lignes "DATA ...". Voici un exemple généré pour l'Amstrad CPC :

```basic
    DATA 25,40,56,89,56,34,21,21,21,21
    ...
    DATA 67,45,23,90,90,90,56,34,23,78,45
```