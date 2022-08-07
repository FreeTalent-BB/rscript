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
<b>#label<b> est un tag qui indique à RSCRIPT que l'on veut <b>référencer la ligne tout de suite en dessous.</b>. RSCRIPT peut gérer plusieurs tags. Vous verrez plus bas dans cette page.

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

