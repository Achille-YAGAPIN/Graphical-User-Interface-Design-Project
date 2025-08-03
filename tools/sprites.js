// ===================================================================================
// canvasImage : image sur un canvas
// nameImg : URL de l'image
// (posX,posY) : position du coin supérieur gauche de l'image dans le canvas
// ctx : contexte graphique
function canvasImage(imgURL,posX,posY,ctx)
{   
    // Initialisation des propriétés de l'image
    var canvasImageObj = new Image();
    canvasImageObj.src = imgURL;
    canvasImageObj.alt = "mon image";
    canvasImageObj.posX = posX;
    canvasImageObj.posY = posY;
    canvasImageObj.ctx = ctx;

    return canvasImageObj;
}

// -----------------------------------------------------------------------------------
// Dessine l'image sur le canvas
// image: graphics source
// (posX,posY) : position du coin supérieur gauche de l'image dans le canvas
function drawCanvasImage(image,posX,posY)
{
    var ctx = image.ctx;
    ctx.drawImage(image,-posX,-posY);       // On met des négatifs car on descend dans le sprite
}
// ===================================================================================
// Constructeur for an animation object
// image: graphics source
// (x, y): position to draw the animation
// width, height: size of each tile
// nbXTiles : nombre de tiles horizontalement
// nbYTiles : nombre de tiles verticallement
// loop : animation en boucle (true) ou non (false)
function CanvasSprite(spriteImgURL, x, y, widthTile, heightTile, nbXTiles, nbYTiles,ctx)
{
    this.src = spriteImgURL;
    this.alt = "sprite";
    this.posX = x;
    this.posY = y;

    this.widthTile = widthTile;
    this.heightTile = heightTile;
    this.nbXTiles = nbXTiles;
    this.nbYTiles = nbYTiles;
    this.ctx = ctx;

    this.animations = {};           // Liste des animations
    this.currentAnimation = [];     // Animation courante
    this.currentTile = 0;           // Tile courante
    this.indiceTile = 0;            // Indice de la tile dans l'animation
    this.loop = false;              
    this.timeID = 0;                // On l'initialise à 0 (position de base)
}
// -----------------------------------------------------------------------------------
// Ajout d'une animation spécifique
// nameAnim : nom de l'animation
// tiles : tableau d'indices de tile
CanvasSprite.prototype.addAnimation = function(nameAnim, tiles)
{
    this.animations[nameAnim]=[];
    for(let i of tiles){
        this.animations[nameAnim].push(i);
    }

}
// -----------------------------------------------------------------------------------
// Sélectionne une animation spécifique nameAnim
CanvasSprite.prototype.selectAnimation = function(nameAnim,loop)
{
    for(let i of this.animations[nameAnim]){
        this.currentAnimation.push(i);}  

    this.currentTile = this.currentAnimation[0];    // On l'initialise à la première tile de l'animation    
    this.loop = loop ;
}

// -----------------------------------------------------------------------------------
// Sélectionne la tile suivante et la dessine, si la tile existe (mode sans boucle)
// retourne false si la tile courrante est la dernière (mode sans boucle), true sinon
CanvasSprite.prototype.nextTile = function()
{
    if (this.indiceTile < this.currentAnimation.length){
        this.drawTile(this.currentAnimation[this.indiceTile]);
        this.indiceTile = this.indiceTile + 1;                          // On passe à la tile suivante dans l'animation
        this.currentTile = this.currentAnimation[this.indiceTile];      // On change la tile courante
        return true;
    }

    // On est au bout de l'animation
    else{
        if(this.loop){ // Si on est en boucle
            this.currentTile = this.currentAnimation[0];    // On réinitialise la tile courante à la première tile de l'animation
            this.indiceTile = 0;                            // On réinitialise l'indice des tiles à 0
            this.nextTile();                                // On appelle à nouveau nextTile
            return true;
        }
        else{
            return false;
        }
    }
        
}

// -----------------------------------------------------------------------------------
// Retourne la position de la tile dans le sprite selon x
CanvasSprite.prototype.tileX = function(tileIndex)
{
    var position = tileIndex%this.nbXTiles;
    return (position*this.widthTile);
}
// -----------------------------------------------------------------------------------
// Retourne la position de la tile dans le sprite selon y
CanvasSprite.prototype.tileY = function(tileIndex)
{
    var position = Math.floor(tileIndex/this.nbXTiles)%this.nbYTiles;
    return(position * this.heightTile);
}
// -----------------------------------------------------------------------------------
// Dessine une tile
CanvasSprite.prototype.drawTile = function(tileIndex)
{
    var x = this.tileX(tileIndex);
    var y = this.tileY(tileIndex);

    /*Transformer en feuille blanche à l'aide de la fonction clearRect*/
    this.ctx.clearRect(0,0,512,256);

    this.currentTile = tileIndex;
    drawCanvasImage(image,x,y);
};
// ----------------------------------------------------------------------------------
// Démarre l'animation
CanvasSprite.prototype.simpleAnim = function(tps)
{
    this.timeID = setInterval(function(elt){elt.nextTile();},tps,this);
}
// -----------------------------------------------------------------------------------
// Stoppe l'animation 
CanvasSprite.prototype.stopAnim = function()
{
	clearInterval(this.timeID);
}
//  ----------------------------------------------------------------------------------