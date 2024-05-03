import React, { useRef } from 'react';

const keywords: string[] = [
    "fox",
    "bird",
    "cat",
    "hen",
    "fish",
    "frog",
    "monkey",
    "tiger"
];

const animalImages: string[] = [
    "./images/animals/fox.png",
    "./images/animals/bird.png",
    "./images/animals/cat.png",
    "./images/animals/hen.png",
    "./images/animals/fish.png",
    "./images/animals/frog.png",
    "./images/animals/monkey.png",
    "./images/animals/tiger.png"
];

interface KeywordResponderProps {}

const KeywordResponder: React.FC<KeywordResponderProps> = (props) => {

    const dreamCanvasRef = useRef<HTMLDivElement>(null);

    const sound = new Audio('../../../../../sounds/reactions-thumbs-up.mp3');

    let recognitionStarted = false;

    // Create a new SpeechRecognition object
    const recognition = new ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition)();

    // Set properties for recognition
    recognition.lang = 'en-US'; // Set the language
    recognition.continuous = true; // Keep listening for speech
    recognition.interimResults = true; // Get interim results

    // Variable to store the last spoken word
    let lastSpokenWord = '';

    recognition.onstart = function() {
        console.log('Speech recognition started...');
        recognitionStarted = true;
    }

    // Event listener for result event
    recognition.onresult = function(event: any) {
        const lastResultIndex = event.results.length - 1;
        const lastTranscript = event.results[lastResultIndex][0].transcript;
        const words = lastTranscript.split(' ');
        const newLastWord = words[words.length - 1];

        // Check if the new last word is different from the last spoken word
        if (newLastWord !== lastSpokenWord) {
            console.log('Last spoken word:', newLastWord);
            lastSpokenWord = newLastWord; // Update the last spoken word
            const keywordIndex = keywords.indexOf(newLastWord.toLowerCase());
            if (keywordIndex !== -1) {
                if (dreamCanvasRef.current?.firstChild) {
                    dreamCanvasRef.current.innerHTML = "";
                }
                const img = document.createElement('img');
                // img.src = './images/logo-deep-linking.png';
                img.src = animalImages[keywordIndex];
                img.classList.add("custom-image");
                // Prepend the image to the dreamCanvas div
                dreamCanvasRef.current?.prepend(img);
                // Trigger reflow to apply transition
                img.offsetWidth; // This line forces the browser to reflow, allowing the transition to take effect
                function playAudio() {
                    if (!sound.paused) {
                        sound.currentTime = 0;
                    }
                    sound.play();
                }
                playAudio();
            }
        }            
    };

    // Event listener for errors
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
    };

    // Event listener for when the speech recognition is ended
    recognition.onend = () => {
        console.log('Speech recognition ended');
        if (recognitionStarted) {
            recognition.start();
        }
    };

    const handleSpeech = () => {

        recognitionStarted = !recognitionStarted;

        const speechBtn = document.querySelector(".speech-element");

        if (recognitionStarted) {
            recognition.start();
            speechBtn?.classList.add("speech-btn");
        } else {
            recognition.stop();
            speechBtn?.classList.remove("speech-btn");
        }

    }

    return (
        <>
            <style>
                {`
                    .custom-image {
                        width: 100px;
                        opacity: 0;
                        transform: scale(1) translateY(100%);
                        animation: fadeInAndScale 2s ease-in-out forwards;
                        position: absolute;
                        bottom: 0%;
                        left: 50%;
                    }
                    
                    @keyframes fadeInAndScale {
                        0% {
                            opacity: 0;
                            transform: scale(0.5) translateY(100%);
                            bottom: 10%;
                        }
                        30% {
                            opacity: 1;
                            transform: scale(3) translateY(0);
                            bottom: 50%;
                        }
                        100% {
                            opacity: 0;
                            transform: scale(4) translateY(0);
                            bottom: 50%;
                        }
                    } 

                    .speech-btn {
                        animation: scaleInOut 1s ease-in-out infinite alternate;
                    }
                    
                    @keyframes scaleInOut {
                        0% {
                          transform: scale(1);
                        }
                        100% {
                          transform: scale(1.1); /* Change the scale value for desired effect */
                        }
                    }
                `}
            </style>
            <div style={{position: "absolute", left: "2%", right: "2%", top: 20, borderRadius: "5px", textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.4)", color: "white", padding: "10px", margin: "20px", fontSize: "20px", zIndex: 100}}><p>{`For testing please start speech recognition by pressing the button below and try to include any of these keyword while you're speaking: ${keywords.map((keyword, index) => ` ${keyword.toUpperCase()}`)}`}</p></div>
            <div ref={dreamCanvasRef} style={{width: "100%", height: "100%", position: "absolute", zIndex: 100, top: 0, left: 0}}/>
            <button className='speech-element' style={{
                color: "red",
                width: 100,
                // height: 100,
                // backgroundColor: "green",
                right: "10%",
                position: "absolute",
                bottom: 30,
                zIndex: 2000,
                padding: 0,
                overflow: "hidden",
                borderRadius: "10px",
                border: "1px solid rebeccapurple"}}
                onClick={handleSpeech}
            ><img style={{width: "100%"}} src='./images/speech_recognition_btn.jpg' /></button>
        </>
    );
}

export default KeywordResponder;