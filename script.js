$(document).ready(function() {
	var rows = 9;
	var columns = 9;
	var blocks = (rows * columns);
	var clicked = 0;
	var mines = 10;
	
	// Setting Grid Arrays
	var grid = [];
	for(var i = 0; i < rows; i++) {
		grid.push([]);
		for(var j = 0; j < columns; j++) {
			var box = {
				r: i,
				c: j,
				isMine: false,
				minesAround: 0,
				flagged: false,
			}
			grid[i].push(box);
		}
	}

	//Picking mine locations
	var mineLocations = [];
	while(mineLocations.length < mines) {
		var randomNumber = Math.floor((Math.random() * blocks));
		if (mineLocations.indexOf(randomNumber) >= 0) { //randomNumber already exists in mineLocations
			continue;
		}
		else {
			mineLocations.push(randomNumber);
		}
	}
	console.log(mineLocations);
	
	//Setting mine locations
	for(var i = 0; i< mineLocations.length; i++) {
		var rowNumber = Math.floor(mineLocations[i]/rows);
		var columnNumber = (mineLocations[i] % columns);
		grid[rowNumber][columnNumber].isMine = true;
	}

	//Calculating minesAround
	for(var i = 0; i < rows; i++) {
		for(var j = 0; j < columns; j++) {
			function getMine(r, c) {
				if ((grid[r] == undefined) || (grid[r][c] == undefined)) {
					return 0;
				}
				else if (grid[r][c].isMine) {
					return 1;
				}
				else {
					return 0;
				}
			}

			var minesAroundBlock = getMine(i - 1, j - 1) + getMine(i - 1, j) + getMine(i - 1, j + 1) + getMine(i, j - 1) + getMine(i, j + 1) + getMine(i + 1, j - 1) + getMine(i + 1, j) + getMine(i + 1, j + 1);
			grid[i][j].minesAround =  minesAroundBlock;
		}
	}

	console.log(grid);

	// Setting Board
	for (var i = 0; i < rows; i++) {
		$("#grid").append("<div id='r" + i + "' class='row'></div>");
		for(var j = 0; j < columns; j++) {
			$("#r" + i).append("<div id='r" + i + "c" + j + "' class='block unclicked'></div>");
		}
	}

	$(".unclicked").on("click", function() {
		var blockID = $(this).attr("id");
		var rowNumber = Number(blockID.substring(1, blockID.indexOf("c")));
		var columnNumber = Number(blockID.substring(blockID.indexOf("c") + 1));
		var blockObject = grid[rowNumber][columnNumber];
		if (blockObject.isMine === true) {
			$(this).addClass("clicked-mine");
			$(this).removeClass("unclicked");
			$(".unclicked").off(); // Disables clicks on all unclicked blocks
			blowAllMines();
		}
		else if ($(this).attr("class") != "block clicked-block"){ // Unclicked Block
			$(this).addClass("clicked-block");
			$(this).removeClass("unclicked");
			if (blockObject.minesAround == 0) {
				clearSurroundingZeros(rowNumber, columnNumber);
			}
			else {
				$(this).append("<p>" + blockObject.minesAround + "</p>");
			}
		}
	});

	function clearSurroundingZeros(rowNum, colNum) {
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {
				if (!((i == 0) && (j == 0))) {
					if ((grid[rowNum + i] == undefined) || (grid[rowNum + i][colNum + j] == undefined)) {
						continue;
					}
					else {
						blockID = "#r" + (rowNum + i) + "c" + (colNum + j);
						blockObject = grid[rowNum + i][colNum + j];
						if ($(blockID).attr("class") != "block clicked-block") {
							$(blockID).addClass("clicked-block");
							$(blockID).removeClass("unclicked");
							if (blockObject.minesAround == 0) {
								clearSurroundingZeros(rowNum + i, colNum + j);
							}
							else {
								$(blockID).append("<p>" + blockObject.minesAround + "</p>");
							}
						}
					}
				}
			}
		}
	}

	function blowAllMines() {
		for(var i = 0; i < rows; i++) {
			for (var j = 0; j < columns; j++) {
				if (grid[i][j].isMine === true) {
					$("#r" + i + "c" + j).addClass("clicked-mine");
					$("#r" + i + "c" + j).removeClass("unclicked");
				}
			}
		}
	}
});