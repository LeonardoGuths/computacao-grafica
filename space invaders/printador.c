#include <stdio.h>

void main (){
    int i;
    double p=-7.5;

    for (i=7; i<=13; i++){
            printf ("{\nname: \"space_invader_%d\",\ndraw: true,\ntranslation: [%.1lf, 2.5, 0],\nrotation: [degToRad(0), degToRad(0), degToRad(0)],\nchildren: [],\ntexture: tex.spaceinvaderW,\nformat: arrayCube,\nchildren: [],\n},", i, p);
    p+=2.5;
    }
}