$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var d;
	var df;
	var food;
	var score;
	var isPlaying = true;

	//Lets create the snake now
	var snake_array; //an array of cells to make up the snake

	function startGameLoop(){
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
		isPlaying = true;
	}

	function pauseGameLoop(){
		clearInterval(game_loop);
		isPlaying = false;
	}

	function restart(){
		pauseGameLoop();
		setTimeout(function(){
			init();
		},1000);
	}

	function init(){
		d = "right"; //default direction
		create_snake();
		create_food();
		score = 0;
		startGameLoop();
		pauseGameLoop();
		setTimeout(pauseGameLoop,100);
	}
	init();

	function create_snake()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			snake_array.push({x: i, y:0});
		}
	}

	//Lets create the food now
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}

	//Lets paint the snake now
	function paint()
	{
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;

		if(df == "right") 		food.x++;
		else if(df == "left") 		food.x--;
		else if(df == "up") 		food.y--;
		else if(df == "down") 		food.y++;

		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if( nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array) ) {
			restart(); // Snake collided, snake lost
		} else if( food.x == -1 || food.x == w/cw || food.y == -1 || food.y == h/cw || isCaptured() ) {
			restart(); // food collided , snake won
		} else {
			 score++;
		}

		if(score%5)
			snake_array.pop(); //pops out the last cell

		var tail = {x: nx, y: ny};
		//The snake can now eat the food.

		snake_array.unshift(tail); //puts back the tail as the first cell


		//Lets paint the food
		paint_snake();
		paint_cell(food.x, food.y , 0);

		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);

		function isCaptured(){
			if(nx == food.x && ny == food.y){
				return true;
			}
			for(var i = 0; i < snake_array.length; i++){
				if(snake_array[i].x == food.x && snake_array[i].y == food.y)
				 return true;
			}
			return false;
		}
	}

	function paint_snake(){
		for(var i = 0; i < snake_array.length; i++) {
			paint_cell(snake_array[i].x, snake_array[i].y, 1);
		}
	}

	//Lets first create a generic function to paint cells
	function paint_cell(x, y, isSnake) {
		ctx.beginPath();
		ctx.fillStyle = (isSnake) ? "red":"blue";
		//ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.arc(x*cw+cw/2, y*cw+cw/2, cw/2, 0, 2 * Math.PI);
		ctx.strokeStyle = "black";
		ctx.fill();
		ctx.stroke();
	}

	function check_collision(x, y, array) {
		for(var i = 1; i < array.length; i++) {
			if(array[i].x == x && array[i].y == y){
				return true;
			}
		}
		return false;
	}

	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
		//The snake is now keyboard controllable
		else if(key == "65") df = "left";
		else if(key == "87") df = "up";
		else if(key == "68") df = "right";
		else if(key == "83") df = "down";

		else if(key == "82") {
			startGameLoop();
		}
		else if(key == "80") {
			pauseGameLoop();
		}

		if(!isPlaying && key!="80"){
			startGameLoop();
		}



	})







})
