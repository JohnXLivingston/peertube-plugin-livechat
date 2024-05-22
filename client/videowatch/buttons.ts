/* eslint-disable max-len */
type SVGButton = () => string

const closeSVG: SVGButton = () => {
  // This content comes from the file assets/images/bye.svg, after svgo cleaning.
  // To get the formated content, you can do:
  // xmllint dist/client/images/bye.svg --format
  // Then replace the main color by «currentColor»
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233">
  <rect
    style="
      fill:currentColor;
      stroke:currentColor;stroke-width:.529167;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1
    "
    width="4.223" height=".427" x=".882" y="-.213" transform="rotate(45)" ry=".213"
  />
  <rect
    style="
      fill:currentColor;
      stroke:currentColor;stroke-width:.529167;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1
    "
    width="4.223" height=".427" x="-2.112" y="2.78" transform="scale(-1 1) rotate(45)" ry=".213"
  />
</svg>`
}

const openChatSVG: SVGButton = () => {
  // This content comes from the file assets/images/talking.svg, after svgo cleaning.
  // To get the formated content, you can do:
  // xmllint dist/client/images/talking.svg --format
  // Note: it was highly simplified in this file.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 8.467 8.467">
  <path style="fill:transparent;stroke-width:.187325" d="M.838.848h2.643v1.861H.838zM4.896 4.38h2.451v.875H4.896z"/>
  <path
    d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2ZM9 11H7V9h2zm4 0h-2V9h2zm4 0h-2V9h2z"
    style="fill:currentColor;" transform="matrix(-.18741 0 0 .18741 8.493 3.004)"
  />
  <path
    d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2ZM6 9h12v2H6Zm8 5H6v-2h8zm4-6H6V6h12z"
    style="fill:currentColor;" transform="scale(.18741)"
  />
</svg>`
}

const openBlankChatSVG: SVGButton = () => {
  // This content comes from the file assets/images/new-window.svg, after svgo cleaning.
  // To get the formated content, you can do:
  // xmllint dist/client/images/new-window.svg --format
  // Then replace the main color by «currentColor»
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233">
  <g
    transform="matrix(.45208 0 0 .45208 -.526 1.335)"
    style="stroke-width:1.00021;stroke-miterlimit:4;stroke-dasharray:none"
  >
    <path
      style="
        opacity:.998;fill:none;fill-opacity:1;
        stroke:currentColor;stroke-width:1.17052322;stroke-miterlimit:4;
        stroke-dasharray:none;stroke-opacity:1
      "
      d="
        m8.674.744.012 1.266v2.199a.94.94 0 0 1-.943.942H3.345a.94.94
        0 0 1-.942-.942V-.19a.94.94 0 0 1 .942-.943h2.2l1.255.016
      "
    />
    <rect
      style="
        opacity:.998;fill:currentColor;fill-opacity:1;
        stroke:currentColor;stroke-width:1.17223459;stroke-miterlimit:4;
        stroke-dasharray:none;stroke-opacity:1
      "
      width="5.632" height=".569"
      x="-6.185" y="4.854" transform="scale(-1.03747 .96108) rotate(45)" ry=".285"
    />
    <path
      style="
        opacity:.998;fill:currentColor;fill-opacity:1;
        stroke:currentColor;stroke-width:1.30528;stroke-miterlimit:4;
        stroke-dasharray:none;stroke-opacity:1
      "
      d="m5.15.374 1.091-1.89L7.333.373Z"
      transform="scale(.89676) rotate(45 9.536 3.618)"
    />
  </g>
</svg>`
}

const shareChatUrlSVG: SVGButton = () => {
  // This content comes from the file assets/images/url.svg, after svgo cleaning.
  // To get the formated content, you can do:
  // xmllint dist/client/images/url.svg --format
  // Then replace the color by `currentColor`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233">
  <g style="stroke-width:1.17052;stroke-miterlimit:4;stroke-dasharray:none">
    <path style="opacity:.998;fill:none;fill-opacity:1;stroke:currentColor;stroke-width:1.17052;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m6.556-.435 1.132-1.132c.269-.268.618-.351.784-.186L9.867-.357c.166.165.083.515-.186.784L7.418 2.69c-.269.269-.618.352-.784.186l-.698-.697-.39-.407" transform="matrix(.45208 0 0 .45208 -.73 1.423)"/>
    <path style="opacity:.998;fill:none;fill-opacity:1;stroke:currentColor;stroke-width:1.17052;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M6.038 3.505 4.906 4.637c-.268.268-.618.351-.784.186L2.727 3.427c-.166-.165-.083-.515.186-.784L5.176.38c.27-.269.619-.352.784-.186l.698.697.39.407" transform="matrix(.45208 0 0 .45208 -.73 1.423)"/>
  </g>
</svg>
`
}

const helpButtonSVG: SVGButton = () => {
  // This content comes from the file assets/images/help.svg, after svgo cleaning.
  // To get the formated content, you can do:
  // xmllint dist/client/images/url.svg --format
  // Then replace the color by `currentColor`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233">
  <path style="display:inline;opacity:.998;fill:none;fill-opacity:1;stroke:currentColor;stroke-width:.529167;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M1.48 1.583V.86c0-.171.085-.31.19-.31h.893c.106 0 .19.139.19.31v.838c0 .171-.107.219-.19.284l-.404.314c-.136.106-.219.234-.221.489l-.003.247"/>
  <path style="display:inline;fill:currentColor;stroke-width:.235169" d="M1.67 3.429h.529v.597H1.67z"/>
</svg>
`
}

const promoteSVG: SVGButton = () => {
  // This content comes from the file assets/images/moderator.svg, after svgo cleaning.
  // To get the formated content, you can do:
  // xmllint dist/client/images/moderator.svg --format
  // Then replace the color by `currentColor`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233">
  <g style="stroke-width:1.00021;stroke-miterlimit:4;stroke-dasharray:none">
    <path style="opacity:.998;fill:currentColor;fill-opacity:1;stroke:currentColor;stroke-width:1.17052;stroke-linecap:butt;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M2.943 1.626V-.34a.94.94 0 0 1 .942-.943l1.962-.023 1.961.01a.94.94 0 0 1 .942.942v1.968S7.126 4.746 5.847 4.767c-1.28.02-2.904-3.14-2.904-3.14Z" transform="matrix(.45208 0 0 .45208 -.526 1.335)"/>
  </g>
</svg>
`
}

export {
  closeSVG,
  openChatSVG,
  openBlankChatSVG,
  shareChatUrlSVG,
  helpButtonSVG,
  promoteSVG
}
export type {
  SVGButton
}
