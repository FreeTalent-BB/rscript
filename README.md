# RSCRIPT Transpiler

RSCRIPT Transpiler est destiné au développement Retro, pour les langages de programmation BASIC qui étaient intégrés (pour beaucoup) avec les machines des années 80/90. Il ne s'agit pas d'un compilateur BASIC, car RSCRIPT se code à l'aide de la syntaxe BASIC de la machine ciblée. RSCRIPT rend simplement plus confortable la programmation avec ces vieux langages :

<b>Plus besoin de se soucier des numéros de ligne</b><br>
Les anciens langages BASIC utilisaient des numéros pour identifier chaque ligne du code. Ces numéros servaient à faire des sauts dans le programme (GOTO) ou des appels de sous-programmes(GOSUB). C'était simple mais lorsque le programme devenait long et que l'on souhaitait insérer une ou plusieurs lignes au milieu de notre code, il y avait obligatoirement un décalage de ces numéros, et nos GOTOs et GOSUBs devaient être mis à jour, manuellement le plus souvent.

RSCRIPT prend en charge la numérotation des lignes, vous n'aurez pas besoin de les intégrer.

<b>Utilisation des étiquettes</b><br>
Comme indiqué ci-dessus, RSCRIPT prend en charge la numérotation des lignes. Cependant, vous aurez besoin d'avoir des références de lignes pour les sauts de programmes (GOTO) et appels de sous-programmes(GOSUB). Pour cela, RSCRIPT permet l'utilisation d'étiquette dans votre code. Une étiquette est un repère (avec le nom de votre choix) qui sera utilisé pour ça. Voici un exemple d'étiquette :

```
#label mon_etiquette
```
<b>#label</b> est un tag qui indique à RSCRIPT que l'on veut <b>référencer la ligne tout de suite en dessous.</b>. RSCRIPT peut gérer plusieurs tags. Vous verrez plus bas dans cette page.

Pour faire un saut vers l'étiquette créée, il suffit de faire :
```
#label mon_etiquette
Print "BONJOUR!"
Goto @mon_etiquette
```

Les étiquettes peuvent être appelées avec les commandes BASIC suivantes:
- Goto
- Gosub
- Restore
- On N Goto
- On N Gosub
- On Error Goto

<b>Compression du code BASIC</b><br>
Les machines de l'époque étaient très limitées en mémoire vive (quelques ko) et un code BASIC pouvait prendre beaucoup de mémoire avant même d'être exécuté, ne laissant que peu d'espace au programme lui-même. Heureusement, il y avait tout un tas d'astuces pour récupérer de la mémoire, et notement en compressant son code. Moins il y aura de caractères dans le code, plus il restera de la mémoire pour exécuter son programme.

RSCRIPT peut ainsi compresser le code BASIC final afin de réduire sa taille et gagner de précieux ko. Pour cela, RSCRIPT va :
- Supprimer les espaces inutiles
- Remplacer la commande "PRINT" par son équivalent "?".
- Renommer les variables en diminuant la taille de leur nom.
- Supprimer les lignes de remarques (commentaires)
- Remplacer les commandes "CHR$(N)" par leur équivalent texte (quand c'est possible)
- Remplacer les concaténations de textes qui suivent une commande "PRINT" ( par exemple: Print "Bonjour " + A$, deviendra ?"Bonjour "A$ )

<b>Inclusion de code</b><br>
A l'époque, un programme BASIC devait être écrit dans un seul et même fichier. Ce qui, sur des longs programmes, devenait vite un casse-tête pour debugger ou corriger un morceau du code. 
Morceller son programme en plusieurs fichiers permet un confort de lecture et de développement. C'est une pratique standard utilisée avec les langages modernes. Chaque morceau est une partie du programme, Par exemple, pour un programme de jeu on pourrait avoir :

- Un fichier de code pour l'écran de titre
- Un fichier de code pour les graphismes
- Un fichier de code pour la gestion du jeu
- Un fichier de code pour les sons et musiques

RSCRIPT peut faire ce type d'inclusion. Voici un exemple :

```
#include inc.gfx.sprites
```

Le tag <b>"#include"</b> indique à RSCRIPT qu'il doit intégrer le code contenu dans le fichier "inc/gfx/sprites.rscript" à partir de la ligne actuelle. Vous remarquerez que le chemin du fichier fourni avec le tag remplace les séparateurs de fichiers par ".". L'extension ".rscript" n'est pas non plus indiquée, car RSCRIPT suppose qu'il s'agit d'un fichier ".rscript", car il ne peut qu'insérer que ce type de fichier. 

A noter que les inclusions de fichiers ne peuvent se faire que dans le code principal. Un fichier inclus ne peut pas contenir d'inclusion de fichier.

<b>Utilisation de plugins</b><br>
RSCRIPT peut utiliser des plugins lors de la génération du code final. Un plugin est un script "outil" appelé par RSCRIPT et qui a sa fonction propre. Tous les plugins se trouvent dans le dossier plugins. Pour utiliser un plugin, vous devrez utiliser le tag "#plugin". Voici un exemple :

```
#plugin img2char source=./graphics/sprites.png m=thomson ns=0 cl=yes o=./inc/SPRITES.rscript
```
Ce code indique à RSCRIPT d'exécuter le plugin "img2char" (qui transforme une image en code BASIC), en lui passant les paramètres qui suivent...

<b>Référencement des variables et constantes</b><br>
Comme indiqué dans le paragraphe sur la compression de code, RSCRIPT peut renommer les variables et constantes afin de réduire la taille de leur nom. Il faut référencer les noms de ces variables et constantes qui devront être renommer. C'est très simple, voici un exemple :
```
#var NOM_DU_JOUEUR1$
#var PRENOM_DU_JOUEUR1$

!NOM_DU_JOUEUR1$="Toto":!PRENOM_DU_JOUEUR1$="Titi"
```
Ce code référence 2 variables "NOM_DU_JOUEUR1$", "PRENOM_DU_JOUEUR1$" qui sont utilisées dans notre code en les précédent de "!". Lors de la transpilation, RSCRIPT les renommera en quelque chose comme cela :
```
!A$="Toto":!B$="Titi"
```

Pour les constantes, le fonctionnement est similaire à l'exception que vous ne pourrez pas modifier leur valeur. Voici un exemple : 
```
#const FRANCE$="fr"
#const ENGLAND$="uk"

Print !FRANCE$ : Print !ENGLAND$
```
Lors de la transpilation, RSCRIPT remplacera le code comme cela :
```
Print "fr" : Print "uk"
```
A NOTER : Vous remarquerez que les noms des variables et constantes respectent le typage du BASIC. Si la valeur d'une variable est alphanumérique, son nom doit se terminer par "$".


<b>Liste des tags</b><br>
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
