window.onload = function(){
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var canvas;
    var context;
    var delay = 100;
    xCord = 0;
    yCord = 0;
    var snaker;
    var apple;
    var widthInBlock = canvasWidth/blockSize;
    var heightInBlock = canvasHeight/blockSize;
    var score;
    init();
    

    function init (){
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px splid";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#000000";
        document.body.appendChild(canvas);
        context = canvas.getContext('2d');
        snaker = new Snake([[6,4], [5,4], [4,4]], "right");
        apple = new   Apple([10,10]);
        score=0;
        refreshCanvas();
        
    };

    function refreshCanvas(){
        snaker.advance();
        if (snaker.checkCollision()) {
            gameOver();
        } else {
            if(snaker.isEatingApple(apple)){
                score ++;
                snaker.ateApple = true;
                do{
                    apple.setNewPosition();
                }
                while(apple.isOnSnake(snaker))
                
            }
            context.clearRect(0,0,canvasWidth,canvasHeight);
            snaker.draw();
            apple.draw();
            drawScore();
            setTimeout(refreshCanvas,delay);
            
            
        }
        
    };

    function gameOver() {
        context.save();
        context.fillStyle = "white";
        context.fillText("Man you s*ck ", 5, 15);
        context.fillText("Come on! restart by pressing space ", 5 , 30);
        context.restore();
        
    };

    function drawScore(){
        context.save();
        context.font = "bold 200px sans-seriff";
        context.fillStyle = "white";
        context.textAlign = "center";
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        context.fillText(score.toString(),centreX, centreY);
        context.restore();
    };

    function drawBlock(context, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        context.fillRect(x,y, blockSize, blockSize);

    };
    function restart() 
    {
        snaker = new Snake([[6,4], [5,4], [4,4]], "right");
        apple = new   Apple([10,10]);
        score=0;
        refreshCanvas();
    }

    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function()
        {
            context.save();
            context.fillStyle = "#ff0000";
            for(var i=0; i < this.body.length; i++){
                drawBlock(context, this.body[i]);
            }
            context.restore();
        };

        this.advance= function(){
            var nextPosition = this.body[0].slice();
            switch (this.direction){
                case "left":
                    nextPosition[0]-=1;
                    break;
                case "right":
                    nextPosition[0]+=1;
                    break;
                case "up":
                    nextPosition[1] -=1;
                    break;
                case"down":
                    nextPosition[1] +=1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple)
                this.body.pop();
            else{
                this.ateApple = false;
            }

        };

        this.setDirection = function (newDirection)
        {
            var allowedDirections=[];
            switch (this.direction){
                case "left":
                    allowedDirections = ["up","down"];
                    break;
                case "right":
                    allowedDirections = ["up","down"];
                    break;
                case "up":
                    allowedDirections = ["left","right"];
                    break;
                case"down":
                    allowedDirections = ["left","right"];
                    break;
                    default:
                        throw("Invalid Direction");
            }
            if (allowedDirections.indexOf(newDirection)>-1){
                this.direction = newDirection;
            }
        };

        this.checkCollision = function (){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var corpse = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock -1;
            var maxY = heightInBlock -1;
            var isNotInHorizontalWalls = snakeX < minX || snakeX>maxX;
            var isNotInVerticalWalls = snakeY < minY || snakeY>maxY
            if(isNotInHorizontalWalls || isNotInVerticalWalls){
                wallCollision = true
            }

            for (let i = 1; i < corpse.length; i++) {
                if(snakeX == corpse[i][0] && snakeY == corpse[i][1]){
                    snakeCollision = true;
                }
                
            }
            return wallCollision || snakeCollision;
        }

        this.isEatingApple = function(appleToeat)
        {
            var head = this.body[0];
            if (head[0]==appleToeat.position[0] && head[1] == appleToeat.position[1]){
                return true;
            }
            else {
                return false;
            }
        }
        
    }
    
    function Apple(position){
        this.position = position;
        this.draw = function(){
            context.save();
            context.fillStyle = "#33cc33";
            context.beginPath();
            var radius = blockSize/2;
            var x = this.position[0] * blockSize + radius;
            var y  = this.position[1] * blockSize + radius; 
            context.arc(x,y,radius,0,Math.PI*2,true)
            context.fill();
            context.restore();
        };

        this.setNewPosition = function () {
            var newX = Math.round(Math.random()*(widthInBlock - 1));
            var newY = Math.round(Math.random()*(heightInBlock - 1));
            this.position = [newX,newY];
            
        }

        this.isOnSnake = function(snakeChecked){
            var isOnSnake = false;
            for (var i = 0; i < snakeChecked.body.length; i ++){
                if(this.position[0] === snakeChecked.body[i][0] && this.position[1] === snakeChecked.body[i][1] ){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }


    }
    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snaker.setDirection(newDirection);
    
    };
    
}

