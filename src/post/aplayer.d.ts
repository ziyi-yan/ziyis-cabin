declare module 'aplayer' {
  class ReactAplayer extends HTMLDivElement{
    constructor(init: {
      container: HTMLElement
      mini: boolean
      audio: {
        url: string
        theme: string
        artist: string
        name: string
      }
      volume: number
    })
  }
  export default ReactAplayer
}
