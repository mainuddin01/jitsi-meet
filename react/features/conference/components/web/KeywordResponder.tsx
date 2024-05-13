/* global APP */
import React, { useRef, useEffect } from 'react';

import { bootstrapCameraKit } from '@snap/camera-kit';

// @ts-ignore
import conference from '../../../../../conference';

import JitsiMeetJS from '../../../base/lib-jitsi-meet';
// import { IJitsiConference } from '../../../base/conference/reducer';

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
    "./images/fox.png",
    "./images/bird.png",
    "./images/cat.png",
    "./images/hen.png",
    "./images/fish.png",
    "./images/frog.png",
    "./images/monkey.png",
    "./images/tiger.png"
];

interface KeywordResponderProps {
    // conference: IJitsiConference;
    // other props if any
  }

const KeywordResponder: React.FC<KeywordResponderProps> = (props) => {

    const dreamCanvasRef = useRef<HTMLDivElement>(null);

    const sound = new Audio('../../../../../sounds/reactions-thumbs-up.mp3');

    let recognitionStarted = false;

    // Create a new SpeechRecognition object
    const recognition = new ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition)();
    
    // const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;

    // if (SpeechGrammarList) {
    //     // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
    //     const speechRecognitionList = new SpeechGrammarList();
    //     const grammar = '#JSGF V1.0; grammar keywords; public <keyword> = ' + keywords.join(' | ') + ' ;';
    //     speechRecognitionList.addFromString(grammar, 1);
    //     recognition.grammars = speechRecognitionList;
    // }
    

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

    recognition.onnomatch = function() {
        console.log('No match found....');
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





    const applyFilters = async () => {
        const cameraKit = await bootstrapCameraKit({
            apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzE1MTkyMTQ0LCJzdWIiOiI1ODFiMDc4MS0zYzMyLTRiYTYtOGJlYy0yODI0ZTA3OTgyMTR-U1RBR0lOR342OTY5NTk1Mi05YmJhLTQzNzItYTBiMy0xNDQ4OWU2M2FkZTYifQ.-U6n1Sjm61UqcoeY7D4Xk3IRwdC6Ja5rrxhrIWMSpDE',
          });
          const liveRenderTarget = document.getElementById(
            'canvas'
          ) as HTMLCanvasElement;
          const session = await cameraKit.createSession({ liveRenderTarget });
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        
          await session.setSource(mediaStream);
          await session.play();
        
          const lens = await cameraKit.lensRepository.loadLens(
            '43309500875',
            '094af563-fca4-42a0-850b-2bd77125c5dc'
          );
        
          await session.applyLens(lens);

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const canvasStream = canvas.captureStream(30); // 30 fps
const videoTrack = canvasStream.getVideoTracks()[0];

// Create a new Jitsi Meet video track object
const jitsiVideoTrack = await JitsiMeetJS.createLocalTracks({
  devices: ['video'],
  stream: {...videoTrack, active: true}
});

console.log("VIDEO TRACK MAINUDDIN: ", jitsiVideoTrack[0]);

// Assuming `conference` is initialized somewhere and `useVideoStream` method exists
conference.useVideoStream(jitsiVideoTrack[0]);

// if (props.conference && jitsiVideoTrack.length > 0) {
//     // props.conference.addTrack(jitsiVideoTrack[0]);
//     props.conference.replaceTrack(jitsiVideoTrack[0])
//   }
  
          
    }


    useEffect(() => {

        applyFilters();

    }, []);






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
            <div style={{position: "absolute", left: "2%", right: "2%", top: 45, borderRadius: "5px", textAlign: "center", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", padding: "10px", margin: "20px", fontSize: "20px", zIndex: 100}}>
            <p>
                For testing please start speech recognition by pressing the bottom right button and try to include any of these keyword while you're speaking: 
                {keywords.map((keyword, index) => <strong style={{color: "cyan"}} key={index}> {keyword.toUpperCase()}{index === (keywords.length - 1) ? "" : ","}</strong>)}
            </p>
            </div>
            <div ref={dreamCanvasRef} style={{width: "100%", height: "100%", position: "absolute", zIndex: 100, top: 0, left: 0}}/>
            <canvas id="canvas" style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}></canvas>
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