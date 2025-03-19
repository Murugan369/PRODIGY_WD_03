const twoPlayerBtn = document.querySelector(".two-player");
const bot=document.querySelector(".bot");
const container = document.querySelector(".container");
const statusTxt = document.querySelector(".status");
const restartBtn = document.querySelector("#restart");
const buttonhide1=document.querySelector(".two-player");
const buttonhide2=document.querySelector(".bot");
//back to home button
const buttonhome=document.querySelector(".back");

twoPlayerBtn.addEventListener("click", () => {
    container.style.display="grid";
    statusTxt.style.display="flex";
    restartBtn.style.display="flex";
    buttonhide1.style.display="none";
    buttonhide2.style.display="none";
    buttonhome.style.display="flex"
    start();
});


bot.addEventListener("click", () => {
    container.style.display="grid";
    statusTxt.style.display="flex";
    restartBtn.style.display="flex";
    buttonhide1.style.display="none";
    buttonhide2.style.display="none";
    buttonhome.style.display="flex"
    botter();
});
buttonhome.addEventListener("click",()=>{
    container.style.display="none";
    statusTxt.style.display="none";
    restartBtn.style.display="none";
    buttonhide1.style.display="flex";
    buttonhide2.style.display="flex";
    buttonhome.style.display="none"
    reset();
});

const boxs=document.querySelectorAll(".box");
const statustxt=document.querySelector(".status");
const restart=document.querySelector("#restart");
let x="<img src='download-removebg-preview.png'>";
let o="<img src='Ink-liquid-round-box-hero-writing-gold-leaf-liquid-sketch_309126_wh300-removebg-preview.png'>";
const win=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
];
let options=["","","","","","","","","",];
let player="X";
let currentPlayer=x;
let running =false;
function start(){
    boxs.forEach(box=>box.addEventListener("click",boxClick));
    restart.addEventListener("click",reset);
    statustxt.innerHTML=`${player} Your turn`;
    running=true;
}
function boxClick()
{
    let index=this.dataset.index;
    if(options[index]!=""||!running)
    {
        return;
    }
    update(this,index);
    checkwinner();
}
function update(box,index)
{
    options[index]=player;
    box.innerHTML=currentPlayer;
}
function playerchange()
{
    player=player=="X"?"O":"X";
    currentPlayer=currentPlayer==x?o:x; 
    statustxt.innerHTML=`${player} Your Turn`;
}
function checkwinner(){
    let iswon=false;
    for(let i=0;i<win.length;i++)
    {
        const condition=win[i];
        const box1=options[condition[0]];
        const box2=options[condition[1]];
        const box3=options[condition[2]];
        if(box1==""||box2==""||box3=="")
        {
            continue;
        }
        if(box1==box2 && box2==box3)
        {
            iswon=true;
        }
    }
    if(iswon)
    {
        statustxt.innerHTML=`${player} Won..`;
        running=false;
    }
    else if(!options.includes("")){
        statustxt.innerHTML="Game Draw..!";
        running=false;
    }
    else{
        playerchange();
    }
}
function reset()
{
    options=["","","","","","","","","",];
    player="X";
    currentPlayer=x;
    running =true;
    statustxt.innerHTML=`${player} Your turn`;
    boxs.forEach(box=>{
        box.innerHTML="";
    })
}
/*bot*/
let player1 = "X";
let currentPlayer1 = "X"; 
let running1 = false;
let options1 = ["", "", "", "", "", "", "", "", ""];
function botter() {
    options1 = ["", "", "", "", "", "", "", "", ""];
    player1 = "X";
    currentPlayer1 = "X";
    running1 = true;
    statusTxt.innerHTML = `${player1} Your Turn`;

    boxs.forEach((box,index) => {
        box.dataset.index = index;
        box.innerHTML = "";
        box.removeEventListener("click", boxClick); // Remove two-player mode
        box.addEventListener("click", boxClick1);   // Add bot mode
    });

    restart.addEventListener("click", reset1);
}

function boxClick1() {
    let index = this.dataset.index;
    if (options1[index] !== "" || !running1) return;

    update1(this, index);
    checkwinner1();

    if (running1) {
        setTimeout(botMove, 300);
    }
}

function update1(box, index) {
    options1[index] = player1;
    let img = document.createElement("img");
    img.src = player1 === "X" ? "download-removebg-preview.png" : "Ink-liquid-round-box-hero-writing-gold-leaf-liquid-sketch_309126_wh300-removebg-preview.png"; // Use your image path
    img.alt = player1;
    img.style.width = "100px"; // Adjust size
    img.style.height = "100px";

    box.innerHTML = "";  // Clear the box before adding the image
    box.appendChild(img);
}

function playerchange1() {
    player1 = (player1 === "X") ? "O" : "X";
    currentPlayer1 = (currentPlayer1 === "X") ? "O" : "X";
    statusTxt.innerHTML = `${player1} Your Turn`;
}

function checkwinner1() {
    let winner = checkWinner1(options1);
    
    if (winner) {
        statusTxt.innerHTML = winner === "draw" ? "Game Draw..!" : `${winner} Won..!`;
        running1 = false;
    } else {
        playerchange1();
    }
}

function botMove() {
    if (!running1) return; 

    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < options1.length; i++) {
        if (options1[i] === "") {
            options1[i] = "O";
            let score = minimax(options1, 0, false);
            options1[i] = "";

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    if (bestMove !== null) {
        let botBox = boxs[bestMove];
        update1(botBox, bestMove);
        checkwinner1();
    }
}
function minimax(board, depth, isMaximizing) {
    let result = checkWinner1(board);
    if (result !== null) {
        return result === "O" ? 1 : result === "X" ? -1 : 0;
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
function checkWinner1(board) {
    for (let condition of win) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // "X" or "O"
        }
    }
    if (!board.includes("")) return "draw"; 
    return null;
}
function reset1() {
    options1 = ["", "", "", "", "", "", "", "", ""];
    player1 = "X";
    currentPlayer1 = "X";
    running1 = true;
    statusTxt.innerHTML = `${player1} Your Turn`;

    boxs.forEach(box => {
        box.innerHTML = "";
    });
}

// Start the game












