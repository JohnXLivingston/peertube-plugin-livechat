type SVGButton = () => string

const closeSVG: SVGButton = () => {
  // This content comes from the file public/image/bye.svg, after svgo cleaning.
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
  // This content comes from the file public/image/talking.svg, after svgo cleaning.
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
  // This content comes from the file public/image/new-window.svg, after svgo cleaning.
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

export {
  closeSVG,
  openChatSVG,
  openBlankChatSVG,
  SVGButton
}
