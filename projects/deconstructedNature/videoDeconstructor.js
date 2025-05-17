let vjsPlayer; // This variable holds the Video.js player instance.
const playPauseButton = document.getElementById('playPauseButton');
const statusDiv = document.getElementById('status');
const statusIcon = document.getElementById('statusIcon');

let isGlitchedPlaying = false;
let currentActionTimeout;

function updateStatus(message, isEffect = false) {
    console.log(message);
    statusDiv.textContent = message;

    if (isEffect) {
        statusIcon.style.display = 'inline-block';
        statusIcon.textContent = '●';
    } else {
        statusIcon.style.display = 'none';
    }
}

// Initialize Video.js player
// Note: The video tag in HTML has data-setup which initializes basic player.
// We get the instance and then add our custom event listeners and logic.
document.addEventListener('DOMContentLoaded', () => {
    // Ensure Video.js is loaded and player element exists
    if (typeof videojs === 'function' && document.getElementById('myVideo')) {
        vjsPlayer = videojs('myVideo');

        vjsPlayer.ready(() => {
            updateStatus("Video.js Player Ready. Video loaded.");
            playPauseButton.disabled = false;

            // Event listener for when the video ends
            vjsPlayer.on('ended', () => {
                if (isGlitchedPlaying) {
                    updateStatus("Video ended, looping.");
                    vjsPlayer.currentTime(0);
                    playNormalSegment(); // Restart the cycle
                } else {
                    updateStatus("Video ended.");
                }
            });

            // Event listener for errors
            vjsPlayer.on('error', () => {
                const error = vjsPlayer.error();
                let errorMsg = "Video.js Error";
                if (error) {
                    errorMsg = `Video.js Error: ${error.message} (Code: ${error.code})`;
                }
                updateStatus(errorMsg);
                console.error(errorMsg, error);
                isGlitchedPlaying = false;
                clearTimeout(currentActionTimeout);
                playPauseButton.textContent = 'Play Deconstructed Nature';
            });

        });
    } else {
        updateStatus("Video.js not found or player element missing.");
        console.error("Video.js not found or player element missing.");
        playPauseButton.disabled = true;
    }
});


function playNormalSegment() {
    if (!isGlitchedPlaying || !vjsPlayer || typeof vjsPlayer.play !== 'function') {
        return;
    }
    clearTimeout(currentActionTimeout);

    vjsPlayer.playbackRate(1.0);
    vjsPlayer.muted(false);

    const normalPlayDuration = (Math.random() * 2500) + 1500; // Play duration will be between 1.5 and 4 seconds.
    updateStatus(`Normal Play (${(normalPlayDuration / 1000).toFixed(1)}s)`);
    
    vjsPlayer.play().catch(e => {
        console.error("Play error:", e);
        updateStatus(`Play error: ${e.message}`);
    });

    currentActionTimeout = setTimeout(() => {
        if (!isGlitchedPlaying || !vjsPlayer) { 
            // If glitching stopped or player gone, ensure things are reset if necessary
            if (vjsPlayer && typeof vjsPlayer.playbackRate === 'function' && vjsPlayer.playbackRate() !== 1.0) {
                 vjsPlayer.playbackRate(1.0); // Reset playback rate just in case
            }
            return; // Stop if glitch mode is off or player is unavailable
        }
        // If we are here, isGlitchedPlaying is true and vjsPlayer exists.
        vjsPlayer.pause();
        triggerIntervention(); 
    }, normalPlayDuration);
}

function triggerIntervention() {
    if (!isGlitchedPlaying || !vjsPlayer || typeof vjsPlayer.pause !== 'function') return;
    clearTimeout(currentActionTimeout);
    vjsPlayer.pause(); // Ensure player is paused before intervention decision

    const PROB_SPEED_UP = 0.40;
    const PROB_SLOW_MOTION = 0.30;
    const PROB_MICRO_LOOPS = 0.20;
    const PROB_FLASH_FREEZE = 0.10;

    const rand = Math.random();
    let interventionDescription = "";
    let interventionDuration = 1000;
    let nextAction = () => { if (isGlitchedPlaying) playNormalSegment(); };
    let cumulativeProb = 0;

    if (rand < (cumulativeProb += PROB_SPEED_UP)) {
        const playbackRate = 3.0 + (Math.random() * 2.0); // Playback rate will be between 3x and 5x.
        interventionDuration = (Math.random() * 1000) + 500; // Intervention will last for 0.5 to 1.5 seconds.
        interventionDescription = `Speed up (${(interventionDuration / 1000).toFixed(1)}s)`;
                
        vjsPlayer.playbackRate(playbackRate);
        vjsPlayer.play().catch(e => console.error("Play error:", e));

        nextAction = () => {
            if (!isGlitchedPlaying || !vjsPlayer) return;
            vjsPlayer.pause();
            vjsPlayer.playbackRate(1.0);
            if (isGlitchedPlaying) playNormalSegment();
        };
        // --- End of Speed Up Logic ---

    } else if (rand < (cumulativeProb += PROB_SLOW_MOTION)) {
        // --- Start of Slow-Motion Logic ---
        const playbackRate = 0.25 + (Math.random() * 0.50); 
        interventionDuration = (Math.random() * 1500) + 1500; 
        interventionDescription = `Slow-Motion (${(interventionDuration / 1000).toFixed(1)}s)`;
        vjsPlayer.playbackRate(playbackRate);
        vjsPlayer.play().catch(e => console.error("Play error:", e));
        nextAction = () => {
            if (!isGlitchedPlaying || !vjsPlayer) return;
            vjsPlayer.pause();
            vjsPlayer.playbackRate(1.0);
            if (isGlitchedPlaying) playNormalSegment();
        };
        // --- End of Slow-Motion Logic ---

    } else if (rand < (cumulativeProb += PROB_MICRO_LOOPS)) {
        // --- Start of Micro-Loops Logic ---
        interventionDescription = "Micro-Loops"; 

        const videoDuration = vjsPlayer.duration();
        if (videoDuration <= 0) { // Safety check
            if (isGlitchedPlaying) playNormalSegment();
            return; 
        }

        const minLoopDurationSec = 0.3;
        const maxLoopDurationSec = 1.0;
        const loopSegmentDurationSec = Math.random() * (maxLoopDurationSec - minLoopDurationSec) + minLoopDurationSec;

        const numberOfLoops = Math.floor(Math.random() * 3) + 3; // The segment will loop 3 to 5 times.
        const actualEffectDurationS = (loopSegmentDurationSec * numberOfLoops).toFixed(1);
        updateStatus(`${interventionDescription} (${actualEffectDurationS}s)`, true);

        let loopCount = 0;

        let loopStartTimeSec = Math.random() * (videoDuration - loopSegmentDurationSec);
        if (loopStartTimeSec < 0) loopStartTimeSec = 0; // Just in case

        function executeMicroLoop() {
            if (!isGlitchedPlaying || loopCount >= numberOfLoops) {
                if (vjsPlayer && typeof vjsPlayer.pause === 'function') {
                    vjsPlayer.pause(); 
                }
                if (vjsPlayer) vjsPlayer.playbackRate(1.0); 
                if (isGlitchedPlaying) playNormalSegment();
                return;
            }

            if (loopCount >= numberOfLoops - 2) { 
                vjsPlayer.playbackRate(2.5); 
            } else {
                vjsPlayer.playbackRate(1.0); 
            }

            vjsPlayer.currentTime(loopStartTimeSec);
            vjsPlayer.play().catch(e => console.error("Play error during micro-loop:", e));

            currentActionTimeout = setTimeout(() => {
                if (!isGlitchedPlaying || !vjsPlayer) return;
                loopCount++;
                if (loopCount < numberOfLoops) {
                    executeMicroLoop(); 
                } else {
                    vjsPlayer.pause();
                    if (isGlitchedPlaying) playNormalSegment();
                }
            }, loopSegmentDurationSec * 1000);
        }
        executeMicroLoop(); 
        return; 
        // --- End of Micro-Loops Logic ---

    } else if (rand < (cumulativeProb += PROB_FLASH_FREEZE)) { // Catches up to 1.0
        // --- Start of Flash Freeze Logic ---
        interventionDescription = "Flash Freeze";

        const numberOfFreezes = 4; // This intervention will execute exactly 4 freeze frames.
        // Calculate average expected duration
        const avgPlayLeadInMs = (50 + 200) / 2;
        const avgFreezeHoldMs = (800 + 1500) / 2; 
        const expectedTotalDurationMs = (avgPlayLeadInMs + avgFreezeHoldMs) * numberOfFreezes;
        updateStatus(`${interventionDescription} (${(expectedTotalDurationMs / 1000).toFixed(1)}s)`, true);

        let freezeCount = 0;

        function executeFlashFreeze() {
            if (!isGlitchedPlaying || freezeCount >= numberOfFreezes) {
                if (vjsPlayer && vjsPlayer.paused()) { 
                    // No specific action needed here, playNormalSegment will handle play
                } else if (vjsPlayer) {
                    vjsPlayer.pause(); 
                }
                if (isGlitchedPlaying) playNormalSegment();
                return;
            }

            const playLeadInMs = Math.random() * 150 + 50; 
            const freezeHoldMs = Math.random() * 700 + 800;

            vjsPlayer.play().catch(e => {
                console.error("Play error during flash freeze lead-in:", e);
                if (isGlitchedPlaying) playNormalSegment();
                return;
            });

            currentActionTimeout = setTimeout(() => {
                if (!isGlitchedPlaying || !vjsPlayer) return;
                vjsPlayer.pause();
                freezeCount++;
                currentActionTimeout = setTimeout(executeFlashFreeze, freezeHoldMs);
            }, playLeadInMs);
        }

        if (!vjsPlayer.paused()) {
            vjsPlayer.pause();
            currentActionTimeout = setTimeout(executeFlashFreeze, 50); 
        } else {
            executeFlashFreeze(); 
        }
        return; 
        // --- End of Flash Freeze Logic ---

    } else {
        // Fallback if rand >= 1.0 (highly unlikely but good to have)
        console.warn("Random value issue or probability sum error, defaulting to normal play.");
        playNormalSegment();
        return; 
    }

    // If we haven't returned by now, it's either Speed up or Slow-Motion.
    // Micro-Loops and Flash Freeze have their own updateStatus calls and 'return'.
    if (interventionDescription.startsWith("Speed up") || interventionDescription.startsWith("Slow-Motion")) {
        updateStatus(interventionDescription, true); // interventionDescription now includes duration
        currentActionTimeout = setTimeout(nextAction, interventionDuration);
    }
    // Any console.log statements for debugging selection can be removed later if desired.
}

playPauseButton.addEventListener('click', () => {
    if (!vjsPlayer || typeof vjsPlayer.play !== 'function') {
         updateStatus("Video.js Player not ready yet. Please wait.");
         return;
    }

    if (isGlitchedPlaying) {
        isGlitchedPlaying = false;
        clearTimeout(currentActionTimeout);
        if(vjsPlayer && !vjsPlayer.paused()) vjsPlayer.pause();
        if(vjsPlayer) vjsPlayer.playbackRate(1.0);
        if(vjsPlayer) vjsPlayer.muted(false); 
        playPauseButton.textContent = 'Play Deconstructed Nature';
        updateStatus('Stopped by user.');
    } else {
        isGlitchedPlaying = true;
        playPauseButton.textContent = 'Stop Deconstruction';
        playNormalSegment(); // Starts the sequence of normal play followed by interventions.
    }
});

// Initial setup
playPauseButton.disabled = true; // The play button is disabled until the Video.js player is ready.
updateStatus("Loading Video.js Player..."); 