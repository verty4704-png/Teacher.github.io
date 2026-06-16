
export class Player{
constructor(){this.xp=0;this.level=1;this.hearts=5;this.avatar='😎';}
addXP(v){this.xp+=v;this.level=Math.floor(this.xp/100)+1;}
loseHeart(){this.hearts=Math.max(0,this.hearts-1);}
refillHearts(){if(this.hearts<5)this.hearts++;}
}