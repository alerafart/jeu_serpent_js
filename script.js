window.onload = function() {

  var canvasWidth = 900;
  var canvasHeight = 600;
  var blockSize = 30;
  var ctx;
  var delay = 200;
  var snakee;
  var applee;
  var widthInBlocks = canvasWidth/blockSize;
  var heightInBlocks = canvasHeight/blockSize;

  init();

  function init(){
    var canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
    applee = new Apple([10,10]);
    refreshCanvas();
  }

  function refreshCanvas(){
    snakee.advance();
    if (snakee.checkCollission())
      {
        //Game OVER
      }
      else
      {
        if(snakee.isEatingApple(applee))
        {
          /* le serpent a mangé la pomme*/
          snakee.ateApple = true;
          /* quand le serpent mange la pomme on lui donne une nouvelle position
          */
          do
          {
            applee.setNewPosition();
          }
          /*tant que la new position tombe sur le serpent la boucle continue
          jusqu'a que la new position ne tombe pas sur le corps du serpent*/
          while(applee.isOnSnake(snakee))
          
        }
        ctx.clearRect(0,0, canvasWidth, canvasHeight);    
        snakee.draw();
        applee.draw();
        setTimeout(refreshCanvas, delay);
      }
    
  }
  
  function drawBlock(ctx, position)
  {
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    ctx.fillRect(x,y, blockSize, blockSize);
  }

  function Snake(body, direction){
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function()
    {
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for(var i = 0; i<this.body.length; i++)
      {
        drawBlock(ctx, this.body[i]);
      }
      ctx.restore();
    };
    
    /**
     *  methode qui fais avancer le serpent
     * on avance la tête d'une position et on enleve le dernier morceau/block avec pop
     */
    this.advance = function()
    {
      var nextPosition = this.body[0].slice();
      switch(this.direction)
      {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
          case "down":
            nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw("Invalid Direction");
      }
      this.body.unshift(nextPosition);
      if(!this.ateApple)
        {/* si le serpent ne mange pas de pomme on 
          supprime le dernier block lors qu'elle
          avance, taille ne bouge pas*/
          this.body.pop();
        }
        else{
          /*si on tombe ici c'est que le serpent a mangé une pomme
          donc on retire pas le dernier block a sa taille
          mais on dois remettre ateApple a false, sinon el continue a grandir infiniment*/
          this.ateApple=false;
        }
            
      
    };

    this.setDirection = function(newDirection)
    {
      var allowedDirections;
      switch(this.direction)
      {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        case "down":
        case "up":
            allowedDirections = ["left", "right"];
            break;               
      }
      if(allowedDirections.indexOf(newDirection)>-1)
      {
        this.direction = newDirection;
      }
    }

    this.checkCollission = function()
    {
      var wallCollission =false;
      var snakeCollission = false;
      var head = this.body[0];
      var rest = this.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var minX = 0;
      var minY = 0;
      var maxX = widthInBlocks-1;
      var maxY = heightInBlocks-1;
      var isNotBetweenHorizontalWalls = snakeX < minX || snakeX  >maxX;
      var isNotBetweenVerticalWalls = snakeY < minY || snakeY  > maxY;

       /*verification si tete du serpent(head)sors du canvas dessiné) */
      if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
        {
          wallCollission = true;
        }
        
        /*verification si corps(rest collissionne avec soi même) 
        les cases du corps dont sous forme de tableau
        on verifie si la tete du serpent est egal a un des elements du reste du corps*/
        for(var i=0; i < rest.length; i++)
          {
              /* [[6,4], [5,4], [4,4]] position actuel du snakee
                [6,4] corresponds a la tête et [5,4], [4,4] au reste (corps)*/            
              /* on boucle sur le corps pour verifier que la 
                tete ne soit pas a l'emplacement precis (coordones x,y)
                d'un carreau du corps
                snakeX et snakeY corresponds a la tête*/

              if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                  /* i est l'index de la partie du corps ou on boucle
                  [0] est l axe de x (horizontale) et [1] corresponds a l'axe Y vertical*/
                
                  snakeCollission = true;
                }
            }
            return wallCollission || snakeCollission;
    };

    this.isEatingApple = function(appleToEat)
    {
      var head = this.body[0];
      if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
      {
        return true;
      }
      else
      {
        return false;
      }
    };
  }

  function Apple(position)
  {
    this.position = position;
    /* function qui dessine la pomme */
    this.draw = function()
      {
        ctx.save();
        ctx.fillStyle ="#33cc33";
        ctx.beginPath();
        var radius = blockSize/2;
        var x = this.position[0]*blockSize + radius;
        var y = this.position[1]*blockSize + radius;
        ctx.arc(x,y, radius, 0, Math.PI*2, true);
        ctx.fill();
        ctx.restore();
      };

     /* si la pomme est mangé par le serpent cette function
      va la replacer a un autre endroit de façon aleatoire*/
     this.setNewPosition = function()
     {
       /**
        * math.random donne une chiffre aleatoire entre 0 et 1 
        * qu'on dois ensuite multiplier par la largeur du tableau
        * on obtiendra un chiffre non entiens donc avec math.round on obtiens un chiffre entier
        */
       var newX = Math.round (Math.random() * (widthInBlocks-1));
       var newY = Math.round (Math.random() * (heightInBlocks-1));
       this.position = [newX, newY];
     };
     /* methode qui va verifier si la nouvelle pomme est recrée sur le corps
      du serpent */
     this.isOnSnake = function(snakeToCheck)
     {
        var isOnSnake = false;
        /*on va boucler sur tout le corps du serpent */
        for(var i = 0; i< snakeToCheck.body.lenght; i++)
        {
          if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1] )
          {
            isOnSnake = true;
          }
        }
        return isOnSnake;
     }
    
  }
  
  document.onkeydown = function handleKeyDown(event)
  {
    var key = event.key;
    var newDirection;
    switch(key)
    {
      case "ArrowLeft":
        newDirection = "left";
          break;
      case "ArrowUp":
        newDirection = "up";
          break;
      case "ArrowRight":
        newDirection = "right";
          break;
      case "ArrowDown":
        newDirection = "down";
          break;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  }
}
