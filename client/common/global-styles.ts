let globalSheets: CSSStyleSheet[] | undefined = undefined;

export function getGlobalStyleSheets() {
  if (globalSheets === undefined) {
    globalSheets = Array.from(document.styleSheets)
      .map(x => {
        const sheet = new CSSStyleSheet();
        const css = Array.from(x.cssRules).map(rule => rule.cssText).join(' ');
        sheet.replaceSync(css);
        return sheet;
      });
  }

  return globalSheets;
}

export function addGlobalStylesToShadowRoot(shadowRoot: ShadowRoot) {
  shadowRoot.adoptedStyleSheets.push(
    ...getGlobalStyleSheets()
  );
}