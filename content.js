const SiteTitleBoldifier = {
  originalTitle: "",
  boldTitle: "",
  observer: null,
  isBold: false,

  // Converts the title chars to Unicode math bold equivalent
  bold() {
    let boldStr = "";
    for(const char of this.originalTitle){
      let boldChar;
      if (/[A-Z]/.test (char)) {
        boldChar = String.fromCodePoint (char.codePointAt (0) + 120211)}
      else if (/[a-z]/.test (char)) {
        boldChar = String.fromCodePoint (char.codePointAt (0) + 120205)}
      else if (/[0-9]/.test (char)) {
        boldChar = String.fromCodePoint (char.codePointAt (0) + 120764)}
      else {
        boldChar = char;
      }
      boldStr += boldChar;
    }
    return boldStr;
  },

  // Applies the bold title and starts monitoring
  apply() {
    if(document.title === this.boldTitle) return;

    this.originalTitle = document.title;
    this.boldTitle = this.bold();
    document.title = this.boldTitle;

    if(this.isBold)
      return;

    this.observeTitle();
    this.isBold = true;
  },

  // Resets the title and disconnects the observer
  reset() {
    if(this.originalTitle != ""){
      document.title = this.originalTitle;
      this.isBold = false;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  // Watches for changes to the title and reapplies bold
  observeTitle() {
    const target = document.querySelector('head > title');

    if (!target) return;

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
          if (this.isBold){
            const currentTitle = mutation.target.textContent;
            if(currentTitle === this.boldTitle) return;
            if(currentTitle !== this.originalTitle){
              this.apply();
              this.observer.disconnect();
              }
            else{
              mutation.target.textContent = this.boldTitle;
            }
          }
        };
    });
    this.observer.observe(target, { subtree: true, characterData: true, childList: true });
  },

  // Called when the tab becomes hidden
  checkSiteVisibility() {
    if (document.visibilityState == "hidden")
      this.apply();
  },

  // Called when the tab becomes visible
  onchangeVisibility() {
    if (document.visibilityState == "visible" && this.isBold){
      this.reset();
      }
  },

  // Initialization logic
  init(){
    const waitForTitle = setInterval(() => {
      if (document.querySelector("title")) {
        clearInterval(waitForTitle);
        this.checkSiteVisibility();
      }
        
    }, 100);

    document.addEventListener("visibilitychange", () => this.onchangeVisibility());
  }

};

SiteTitleBoldifier.init();
