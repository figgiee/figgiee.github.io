const grammarData = {
  "origin": ["#instructionSequence#"],

  "instructionSequence": [
      "#instruction#.",
      "#instruction#. Then, #instruction#.",
      "First: #instruction#. Next: #instruction#. Finally: #contemplate#.",
      "Warning: #state#. You must #imperative#.",
      "Observe the #systemComponent#. Is it #quality#? If so, #imperative#. If not, #imperative#.",
      "Invert the #computationalConcept# while whistling.",
      "Should the #object# #actionVerb#? Probably."
  ],
// Instructions
  "instruction": [
    "#imperative# the #object#",
    "#actionVerb# toward the #abstractConcept#",
    "Consider the #computationalConcept#",
    "Ensure the #systemComponent# remains #quality#",
    "Wait for the #event# before you #actionVerb#",
    "Whisper secrets to the #systemComponent#",
    "Politely ask the #object# to #actionVerb#"
  ],
// Grammar rules
  "imperative": [ "Carefully #actionVerb#", "Do not #actionVerb#", "Try to #actionVerb#", "Pretend to #actionVerb#", "Aggressively #actionVerb#", "Silently #actionVerb#", "Enthusiastically #actionVerb#", "Reluctantly #actionVerb#" ],
  "actionVerb": [ "click", "reboot", "vibrate", "illuminate", "forget", "reconfigure", "align", "listen to", "classify", "accept", "compile", "query", "authenticate", "tickle", "contemplate", "misplace", "serenade", "polish" ],
  "object": [ "#systemComponent#", "process", "state", "network", "input field", "button", "code", "algorithm", "memory", "user", "interface", "void", "existential dread", "rubber chicken", "infinite loop" ],
  "systemComponent": [ "interface", "process", "state", "network", "algorithm", "memory", "user input", "button state", "hamster wheel", "flux capacitor", "enigma machine" ],
  "computationalConcept": [ "latency", "bandwidth", "data flow", "logical structure", "randomness", "recursion", "state change", "protocol", "algorithmic despair", "the sound of one hand clapping", "quantum entanglement of socks" ],
  "quality": [ "stable", "responsive", "pending", "corrupted", "optimal", "ambiguous", "correct", "complete", "nominal", "encrypted", "sparkly", "slightly damp", "in a state of quantum superposition" ],
  "abstractConcept": [ "endpoint", "entropy", "potential", "data stream", "user's intention", "system state", "inevitable outcome", "truth value", "null pointer", "the color of Tuesday", "infinite recursion of thought", "the meaning of 'if'" ],
  "event": [ "change", "click", "timeout", "signal", "error", "correct alignment", "API response", "user confirmation", "sudden appearance of a penguin", "spontaneous combustion", "the heat death of the universe", "a rogue semicolon" ],
  "state": [ "System nominal", "Buffer overflow imminent", "Awaiting input", "Authentication required", "Process stalled", "Network unstable", "Everything is fine... probably", "Currently experiencing whimsy", "Engaged in existential query" ],
  "contemplate": [ "contemplate #abstractConcept#", "ignore further instructions", "prepare for #event#", "document the #state#", "brew some tea", "question reality", "admire the #object#" ]
};

// Global variables
let grammar;
let instructionDisplay;
let generateButton;
let traceryInitialized = false;
let typingTimeoutId = null;

document.addEventListener('DOMContentLoaded', setup);


function setup() {

  instructionDisplay = document.getElementById('instructionText');
  generateButton = document.getElementById('newInstructionButton');

  if (!instructionDisplay || !generateButton) {
      console.error("Required HTML elements not found!");
      return;
  }


  tryInitializeTracery();
}


function tryInitializeTracery() {
  if (typeof tracery !== 'undefined') {

    grammar = tracery.createGrammar(grammarData);


    generateButton.addEventListener('click', generateNewInstruction);


    generateNewInstruction();
    traceryInitialized = true;

  } else {

    // If Tracery hasn't loaded yet, check again shortly.
    setTimeout(tryInitializeTracery, 100);
  }
}


function generateNewInstruction() {

  // Prevent overlapping typing animations if the button is clicked rapidly.
  if (typingTimeoutId) {
    clearTimeout(typingTimeoutId);
    typingTimeoutId = null;
  }

  const generatedText = grammar.flatten("#origin#");


  typeText(generatedText);
}


function typeText(textToType) {

  instructionDisplay.innerHTML = "";
  const characters = textToType.split('');
  let index = 0;
  const typingSpeed = 30; // Milliseconds between character additions.

  function typeCharacter() {
    if (index < characters.length) {
      instructionDisplay.innerHTML += characters[index];
      index++;

      // Schedule the next character to appear.
      typingTimeoutId = setTimeout(typeCharacter, typingSpeed);
    } else {

      typingTimeoutId = null;
    }
  }


  typeCharacter();
}
