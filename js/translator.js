/* Courtesy of: https://codeburst.io/translating-your-website-in-pure-javascript-98b9fa4ce427 */
"use strict"

class Translator {
  constructor() {
    this._lang = this.getLanguage();
    this._elements = document.querySelectorAll("[data-i18n]");
    console.log("elements=");
    console.log(this._elements);
  }

  getLanguage() {
    var lang = navigator.languages ? navigator.languages[0] : navigator.language;

    return lang.substr(0, 2);
  }

  load(lang = null) {
    if (lang) {
      this._lang = lang;
    }
    else {
      var re = new RegExp("lang=([^;]+)");
      var value = re.exec(document.cookie);
      var cookieLang = (value != null) ? unescape(value[1]) : null;
      if (cookieLang) {
        this._lang = cookieLang;
      }
    }
    console.log(`this._lang=${this._lang}`)

    fetch(`/i18n/${this._lang}.json`)
      .then((res) => res.json())
      .then((translation) => {
        this.translate(translation);
      })
      .then(this.toggleLangTagAndFlag())
      .then(document.cookie = `lang=${this._lang};path=/`)
      /*.catch(() => {
        console.error(`Could not load ${this._lang}.json.`);
      });*/
  }

  translate(translation) {
    this._elements.forEach((element) => {
      console.log(`element=${element}`)
      var keys = element.dataset.i18n.split(".");
      var text = keys.reduce((obj, i) => obj[i], translation);
      console.log(`keys=${keys}`)
      console.log(`text=${text}`)

      if (text) {
        element.innerHTML = text;
      }
      else {
        element.innerHTML = `key ${keys} not found for ${this._lang}!`
      }
    });
  }

  toggleLangTagAndFlag() {
    if (document.documentElement.lang !== this._lang) {
      document.documentElement.lang = this._lang;
    }

    document.getElementById("flag").src = `/images/flag-${this._lang}.png`;
  }

  switchLanguage(translator) {
    console.log("switchLanguage!");
    console.log("translator=");
    console.log(translator);
    console.log(`translator._lang=${translator._lang}`);
    var availableLang = ["en", "fr"];
    var currentLangIndex = availableLang.indexOf(translator._lang);
    var nextLang = availableLang[(currentLangIndex + 1)%availableLang.length];
    console.log(`nextLang=${nextLang}`);
    translator.load(nextLang);
  }
}

export default Translator;