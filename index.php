<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kiosk</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: 'Noto Sans JP', sans-serif;
        }
        
        .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #333;
            text-align: center;
            cursor: pointer;
            position: relative;
        }
        
        .video-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
        }
        
        .overlay {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(255, 255, 255, 0);
            z-index: 1;
        }
        
        .content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        
        h1 {
            font-size: 65px;
            margin-bottom: 40px;
            color:rgb(255, 255, 255);
            font-weight: 500;
        }
        
        p {
            font-size: 24px;
            margin-bottom: 40px;
            max-width: 80%;
            color: #252525;
        }
        
        .touch-button {
            font-size: 24px;
            padding: 15px 40px;
            background-color: #4E1F00;
            color: white;
            border: 2px solid #4E1F00;
            border-radius: 0;
            position: relative;
            transition: all 0.3s ease;
            font-weight: 300;
            letter-spacing: 2px;
        }
        
        .touch-button::before {
            content: "";
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            bottom: 5px;
            border: 1px solid rgba(255,255,255,0.5);
        }
        
        .touch-button:hover {
            background-color: #252525;
            border-color: #252525;
        }
        
        .cherry-blossom {
            position: absolute;
            width: 30px;
            height: 30px;
            background-color: #FFB7C5;
            border-radius: 50%;
            opacity: 0.8;
            z-index: 1;
            animation: fall linear infinite;
        }
        
        @keyframes fall {
            0% {
                transform: translateY(-100px) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translateY(calc(100vh + 50px)) rotate(360deg);
                opacity: 0;
            }
        }
        
        @media (orientation: landscape) {
            .content {
                flex-direction: row;
                justify-content: center;
                gap: 50px;
            }
            
            .text-content {
                text-align: center;
            }
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 36px;
            }
            
            p {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container" id="startScreen">
    
        <video class="video-background" autoplay muted loop playsinline>
            <source src="images/background/expoo2.mp4" type="video/mp4">
       
          sample
        </video>
        
   
        <div class="overlay"></div>
        
       
    </div>

    <script>
       
      
        
        document.getElementById('startScreen').addEventListener('click', function() {
            window.location.href = 'indexs.php';
        });


        function enableFullScreen() {
 
 const elem = document.documentElement;
 

 if (elem.requestFullscreen) {
   elem.requestFullscreen();
 } else if (elem.webkitRequestFullscreen) { 
   elem.webkitRequestFullscreen();
 } else if (elem.msRequestFullscreen) { 
   elem.msRequestFullscreen();
 } else if (elem.mozRequestFullScreen) { 
   elem.mozRequestFullScreen();
 }
}


document.addEventListener('DOMContentLoaded', function() {

 enableFullScreen();
 

 document.addEventListener('click', function onFirstClick() {
   enableFullScreen();
   document.removeEventListener('click', onFirstClick);
 }, { once: true });
});
        
    </script>
</body>
</html>