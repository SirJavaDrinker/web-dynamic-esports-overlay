

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let mapTitles = [];
let currentMap = 0;
let score = [0, 0];

let teamNames = ["PLACEHOLDER", "PLACEHOLDER"]
let teamColor = ['gray', 'gray']


let logoImage1 = new Image();
let logoImage2 = new Image();
let leagueLogo = new Image();

let image1Loaded = false;
let image2Loaded = false;
let leagueLogoLoaded = false;

let show_ll = false;

loadImages();
let ll_values = [300, 300, 150, centerY+50];

// Request data from server to use within the overlay
setInterval(() => {
  fetch('/data')
    .then(res => res.json())
    .then(data => {
        mapTitles = data.mapTitles;
        score = data.score;
        currentMap = data.currentMap;
        teamNames = data.teamNames;
        teamColor = data.teamColor;
        
        logoImage1.src = '/logos/'+data.teamLogos[0];
        logoImage2.src = '/logos/'+data.teamLogos[1];
        leagueLogo.src = '/icon/'

        update();
    });
    fetch('/settings')
    .then(res => res.json())
    .then(settings => {
        show_ll = settings.league_logo.show;
        ll_values = [settings.league_logo.size[0], settings.league_logo.size[1], settings.league_logo.pos[0], settings.league_logo.pos[1]];
    });
}, 500);



function update() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBanner();
    drawScores();
    drawMaps();
    //drawSeriesTitle();

    if (leagueLogoLoaded && show_ll) {
        drawImage(ll_values[0], ll_values[1], leagueLogo, ll_values[2], ll_values[3]);
    }
}

function drawBanner() {
    // ----------------------------------------- TEAM BAR LEFT
    ctx.fillStyle=teamColor[0];
    ctx.fillRect(centerX-550-40, 0, 550, 30);

    ctx.strokeStyle = 'black';

    let startPoint = centerX-550-120;

    ctx.beginPath();
    ctx.moveTo(startPoint, 0); // bottom left
    ctx.lineTo(startPoint + 120, 0); // bottom right
    ctx.lineTo(startPoint + 120 + 20, 70); // top right (shifted left)
    ctx.lineTo(startPoint + 20, 70); // top left (shifted left)
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();

    // ----------------------------------------

    // ---------------------------------------- TEAM BAR RIGHT

    ctx.fillStyle=teamColor[1];
    ctx.fillRect(centerX+40, 0, 550, 30);

    startPoint = centerX+550;

    ctx.beginPath();
    ctx.moveTo(startPoint, 0); // bottom left
    ctx.lineTo(startPoint + 120, 0); // bottom right
    ctx.lineTo(startPoint + 120 - 20, 70); // top right (shifted left)
    ctx.lineTo(startPoint - 20, 70); // top left (shifted left)
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // ----------------------------------------


    // Draw team labels.
    ctx.fillStyle='white';
    ctx.textAlign="center";
    ctx.textBaseline = "top";
    ctx.font = '29px "Russo One"';
    ctx.fillText(teamNames[0], centerX-(700/2), 3)
    ctx.fillText(teamNames[1], centerX+(700/2), 3)

    // Define points on polygon
    const sides = 6;
    const radius = 40;
    const points = [];

    for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        const x = centerX + (radius*4) * Math.cos(angle);
        const y = /*centerY +*/ radius * Math.sin(angle);
        points.push({ x, y });
    }

    // Draw polygon
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.stroke
    ctx.fill();

    // Draw images if they're loaded.
    if (image1Loaded) {
        drawImage(70, 70, logoImage1, centerX-595, 35);
    }
    if (image2Loaded) {
        drawImage(70, 70, logoImage2, centerX+595, 35);
    }


    ctx.fillStyle='white';
    ctx.textAlign="center";
    ctx.textBaseline = "top";
    ctx.font = '25px "Russo One"';

    // !!! Change this line if you wish to change the league title/season. !!!
    // TODO: This editable via json file or other method outside of direct editing.
    ctx.fillText("CSK League S3", centerX, 4)
}

function drawScores() {
    // Draw team map scores.
    const scorePosA = [centerX-(80), 90];
    const scorePosB = [centerX+(80), 90];
    
    ctx.beginPath();
    ctx.moveTo(scorePosA[0], scorePosA[1]);
    ctx.fillStyle=teamColor[0];
    ctx.arc(scorePosA[0], scorePosA[1], 16, 0, 2 * Math.PI);
    ctx.fill();

    
    ctx.moveTo(scorePosB[0], scorePosB[1]);
    ctx.beginPath();
    ctx.fillStyle=teamColor[1];
    ctx.arc(scorePosB[0], scorePosB[1], 16, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle='white';

    ctx.textBaseline = "middle";
    ctx.fillText(score[0], scorePosA[0], scorePosA[1])
    ctx.fillText(score[1], scorePosB[0], scorePosB[1])
}

function drawMaps() {
        ctx.font = '24px "Russo One"';
    // Find box dimensions based on text size
    const padding = 22;
    const boxHeight = 26;
    const shiftLeft = -20;

    let currentX = -20;
    const startY = canvas.height - boxHeight;

    for (let i = 0; i < 3; i++) {
        const textWidth = ctx.measureText(mapTitles[i]).width;
        const boxWidth = textWidth + padding * 2;

        const grad=ctx.createLinearGradient(currentX, 0, currentX+boxWidth,0);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0.4)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(currentX, canvas.height); // bottom left
        ctx.lineTo(currentX + boxWidth, canvas.height); // bottom right
        ctx.lineTo(currentX + boxWidth - shiftLeft, startY); // top right (shifted left)
        ctx.lineTo(currentX - shiftLeft, startY); // top left (shifted left)
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = 'black';
        
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'white';
        
        const centerX = currentX + boxWidth/2 - shiftLeft/2;
        ctx.fillText(mapTitles[i], centerX, startY + boxHeight/2);
        
        if (i == currentMap) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const underlineY = startY + boxHeight/2 + 12;
            const underlineStart = centerX - textWidth/2;
            const underlineEnd = centerX + textWidth/2;
            ctx.moveTo(underlineStart, underlineY);
            ctx.lineTo(underlineEnd, underlineY);
            ctx.stroke();
        }
        
        currentX += boxWidth;

    }
}

function drawSeriesTitle() {
    const grad=ctx.createLinearGradient(20, 0, 150, 0);
    grad.addColorStop(0, "rgba(0, 0, 0, .5)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.fillRect(20, 0, 150, 20);
    ctx.stroke();
}

function drawImage(maxHeight, maxWidth, Image, x, y) {
        
    // Maintain aspect ratio
    const scale = Math.min(maxWidth / Image.width, maxHeight / Image.height);
    const imgWidth = Image.width * scale;
    const imgHeight = Image.height * scale;
    // ---------------------
    
    const imgX = x - imgWidth / 2;
    const imgY = y - imgHeight / 2; 
    
    ctx.drawImage(Image, imgX, imgY, imgWidth, imgHeight);
}

function loadImages() {
    logoImage1.onload = function() {
        image1Loaded = true;
        //console.log('Logo image 1 loaded successfully');
    };
    logoImage1.onerror = function() {
        console.error('Failed to load logo image 1');
    };


    logoImage2.onload = function() {
        image2Loaded = true;
        //console.log('Logo image 2 loaded successfully');
    };
    logoImage2.onerror = function() {
        console.error('Failed to load logo image 2');
    };

    leagueLogo.onload = function() {
        leagueLogoLoaded = true;
        //console.log('Logo image 2 loaded successfully');
    };
    leagueLogo.onerror = function() {
        console.error('Failed to load logo image 2');
    };
}

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}