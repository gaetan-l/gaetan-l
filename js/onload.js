import Translator from "./translator.js";

var translator = new Translator();
translator.load();

document.getElementById("flag").onclick = function() {translator.switchLanguage(translator)};