# RSCRIPT Transpiler

RSCRIPT ("R" pour "Retro") est un Transpiler destiné au développement Retro, pour les langages de programmation BASIC qui étaient intégrés (pour beaucoup) avec les machines des années 80/90. <b></b>Il ne s'agit pas d'un compilateur BASIC vers de l'Assembleur</b>. RSCRIPT apporte quelques aménagements pour un meilleur confort de programmation. Il faudra donc tenir compte de la syntaxe BASIC de la machine ciblée par votre programme.

## Ligne de commande de RSCRIPT
RSCRIPT nécessite <a href="https://nodejs.org/en" target="_new"><b>NodeJS</b></a>.<br>
```
node compiler.js [-h] [-v] [-c yes|no|true|false] -m aquarius|cpc|thomson|exelvision|vg5000|alice -o output-file -s source
```

- -s : Source RSCRIPT (obligatoire)
- -h : Affiche l'aide (facultatif)
- -v : Affiche la version(facultatif)
- -c : Compresser le code BASIC final (si le langage BASIC de la machine cible le permet)(facultatif)
- -m : Nom de la machine cible. Les machines supportées sont listées dans le dossier "syntax"(facultatif)
- -o : Chemin du fichier basic de sortie(facultatif)

## Plus besoin de se soucier des numéros de ligne
Les anciens langages BASIC utilisent des numéros pour identifier chaque ligne du code. Ces numéros servent à faire des sauts dans le programme (GOTO) ou des appels de sous-programmes(GOSUB). C'est simple mais lorsque le programme devient long et que l'on souhaite insérer une ou plusieurs lignes au milieu de notre code, il y a obligatoirement un décalage de ces numéros, et nos GOTOs et GOSUBs doivent être mis à jour, manuellement le plus souvent.

RSCRIPT prend en charge la numérotation des lignes, vous n'aurez pas besoin de les intégrer.

## Utilisation des étiquettes
Comme indiqué ci-dessus, RSCRIPT prend en charge la numérotation des lignes. Mais, comme vous ne pouvez pas prévoir à l'avance les numéros des lignes, vous aurez besoin d'avoir d'en référencer certaines pour les sauts de programmes (GOTO) et appels de sous-programmes(GOSUB). Pour cela, RSCRIPT permet l'utilisation d'étiquettes dans votre code. Une étiquette est un repère (avec le nom de votre choix) qui sera utilisé pour ça. Voici un exemple d'étiquette :

```
#label mon_etiquette
```
<b>#label</b> est un tag qui indique à RSCRIPT que l'on veut <b>référencer la ligne tout de suite en dessous.</b>. RSCRIPT peut gérer plusieurs tags. Vous verrez plus bas dans cette page.

Pour faire un saut vers l'étiquette créée, il suffit de faire :
```vb
#label mon_etiquette
Print "BONJOUR!"
Goto @mon_etiquette
```
## Inclusion de code
A l'époque, un programme BASIC devait être écrit dans un seul et même fichier. Ce qui, sur des longs programmes, devenait vite un casse-tête pour debugger ou corriger un morceau du code. 
Morceller son programme en plusieurs fichiers permet un confort de lecture et de développement. C'est une pratique standard utilisée avec les langages modernes. Chaque morceau est une partie du programme, Par exemple, pour un programme de jeu on pourrait avoir :

- Un fichier de code pour l'écran de titre
- Un fichier de code pour les graphismes
- Un fichier de code pour la gestion du jeu
- Un fichier de code pour les sons et musiques

RSCRIPT peut faire ce type d'inclusion. Voici un exemple :

```
#include "inc/gfx/sprites.rscript"
```

Le tag <b>#include</b> indique à RSCRIPT qu'il doit intégrer le code contenu dans le fichier "inc/gfx/sprites.rscript" à partir de la ligne actuelle. 

<b>A noter que les inclusions de fichiers ne peuvent se faire que dans le code principal. Un fichier inclus ne peut pas contenir d'inclusion de fichier.</b>

## Utilisation de plugins
RSCRIPT peut utiliser des plugins lors de la génération du code final. Un plugin est un script "outil" appelé par RSCRIPT et qui a sa fonction propre. Tous les plugins se trouvent dans le dossier plugins. Pour utiliser un plugin, vous devrez utiliser le tag "#plugin". Voici un exemple :

```
#plugin img2char source=./graphics/sprites.png m=thomson ns=0 cl=yes o=./inc/SPRITES.rscript
```
Ce code indique à RSCRIPT d'exécuter le plugin "img2char" (qui transforme une image en code BASIC), en lui passant les paramètres qui suivent.

Il est recommandé de placer les tags <b>#plugin</b> au début du code principal.

## Variables et constantes
RSCRIPT possède un système souple pour l'utilisation des variables et des constants. Souvent, dans les vieux langages BASIC, ces noms sont limités en nombre de caractères, ce qui peut  rendre difficile la compréhension du code. RSCRIPT propose 2 tags : <b>#var</b> et <b>#const</b>

Voici un exemple de déclaration de variable avec le tag <b>#var</b> et leur utilisation dans le code BASIC.  
```basic
#var NOM_DU_JOUEUR1$
#var PRENOM_DU_JOUEUR1$

REM Utilisation des variables RSCRIPT
!NOM_DU_JOUEUR1$="Toto":!PRENOM_DU_JOUEUR1$="Titi"
```
Ce code référence 2 variables "NOM_DU_JOUEUR1$", "PRENOM_DU_JOUEUR1$" qui sont utilisées dans notre code en les précédent de "!". Lors de la transpilation, RSCRIPT les renommera en quelque chose comme cela :
```basic
!A$="Toto":!B$="Titi"
```

Pour les constantes, le fonctionnement est similaire à l'exception que vous ne pourrez pas modifier leur valeur. Voici un exemple : 
```basic
#const FRANCE$="fr"
#const ENGLAND$="uk"

PRINT !FRANCE$ : PRINT !ENGLAND$
```
Lors de la transpilation, RSCRIPT remplacera le code comme cela :
```basic
PRINT "fr" : PRINT "uk"
```
A NOTER : Vous remarquerez que les noms des variables et constantes respectent le typage du BASIC. Si la valeur d'une variable est alphanumérique, son nom doit se terminer par "$".

Bien sûr, vous pouvez continuer à utiliser les variables BASIC  de manière classique.
```basic
A$ = "Hello"
PRINT A$
``` 

## Liste des tags
RSCRIPT comprends un certain nombre de tags. Un tag est une directive que doit appliquer RSCRIPT lors de la transpilation du code. Vous avez pû en voir quelques unes dans les paragraphes précédents. En voici la liste complète :

- #plugin:
    Script outil à utiliser lors de la transpilation.
    Syntaxe : #plugin <nom du plugin> <liste des arguments>

- #include:
    Inclusion de code
    Syntaxe : #include path1.path2.file_without_extension

- #label:
    Insertion d'une étiquette
    Syntaxe : #label <nom de l'étiquette>

- #var:
    Référencement d'une variable.
    Syntaxe : #var <nom_de_la_variable>

- #const:
    Référencement d'une constante
    Syntaxe : #const <nom de la constante>=<valeur>