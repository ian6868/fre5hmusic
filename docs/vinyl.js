let imageSwitchInterval = 6000/1 // Time between each cover image change
let imageAnimationTime = 1500 // Transition duration for the cover images

let backgroundSwitchInterval = 10000/2 // Time between each background image change
let backgroundAnimationTime = 1000 // Transition duration for the background images

// Enable background for play button
let buttonBackground = false

// Custom vinyl image path (set to false to disable)
let customVinylImage = false // 'vinyl.png'

// Player background gradient
let playerGradientStart = '#0EB5AA'
let playerGradientStop = '#501E67'
let playerGradientDirection = 'horizontal' // 'horizontal', 'vertical' or 'radial'

let currentTrackHoverColor = '#2349A2'

/// SCRIPT ///

let canvasContainer
let album, trackCount
let needleImage, playImage, vinylImage, flipImage
let downAngle

let defaultTrack
let currentTrack = 0, trackId = 0
let tracklist

let audioElement, audioCtx, source, analyser, data
let btnHitbox, flipHitbox, flipX, btnX, btnY, btnSize, flipBtnSize, btnMargin, btnRadius
let vplayer

///TODO:
// - flip button
// - end of track flip
// DONE smooth transition for cover images
// DONE fix background
// DONE vinyl flip animation
// DONE handle vinyl colors per album

let images = {}
let isVinylShowingFront = true

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const mobile = isMobile()

function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }
}

function initBackgroundDisplayManagement() {
    if (album.backgrounds.length === 1) return

    let currentBackground = 0
    let update = () => {
        currentBackground = (currentBackground + 1) % album.backgrounds.length
        changeBackgroundImage(album.backgrounds[currentBackground])
    }

    setInterval(update, backgroundSwitchInterval)
}

let imgInterval
function initImageDisplayManagement() {
    let IMAGE_DISPLAY_MODE = 0

    const hasTrackImages = album.tracks.filter(t => t.image).length === trackCount

    if (album.images.length > 1 && !hasTrackImages) IMAGE_DISPLAY_MODE = 1
    else if (album.images.length === 1 && hasTrackImages) IMAGE_DISPLAY_MODE = 2
    else if (album.images.length > 1 && hasTrackImages) IMAGE_DISPLAY_MODE = 3

    console.log({hasTrackImages, IMAGE_DISPLAY_MODE})

    let currentCover = 0
    let showCoverImage = false
    let update

    switch (IMAGE_DISPLAY_MODE) {
        case 1:
            update = () => {
                currentCover = (currentCover + 1) % album.images.length
                changeDisplayImage(album.images[currentCover])
            }
        break
        case 2:
        case 3:
            update = () => {
                if (showCoverImage) {
                    currentCover = (currentCover + 1) % album.images.length
                    // console.log('show cover', currentCover)
                    changeDisplayImage(album.images[currentCover])
                }
                else {
                    // console.log('show track', trackId)
                    changeDisplayImage(album.tracks[trackId].image)
                }
                showCoverImage = !showCoverImage
            }
        break
    }

    currentImageElement = document.getElementById('cover-image')

    if (imgInterval) clearInterval(imgInterval)
    imgInterval = setInterval(update, imageSwitchInterval)
}

const vinylFlipAnimationDuration = 1000
let vinylFlipAnimationStart
function flipVinyl(callback) {
    if (vinylFlipAnimationStart) return

    vinylFlipAnimationStart = Date.now()

    setTimeout(() => {
        album.tracks = album[isVinylShowingFront ? 'tracks_back' : 'tracks_front']
        isVinylShowingFront = !isVinylShowingFront

        trackCount = album.tracks.length
        tracklist = new Array(trackCount).fill().map((_,i) => i)
        defaultTrack = album.tracks[0].path
        currentTrack = 0

        initImageDisplayManagement()
    }, vinylFlipAnimationDuration/2)

    setTimeout(() => {
        vinylFlipAnimationStart = null
        setTrack()
        if (callback) callback()
    }, vinylFlipAnimationDuration)

    audioElement.pause()
    audioElement.currentTime = 0
    audioElement.src = defaultTrack
    vplayer.needleAngle = 0
}
// setTimeout(flipVinyl, 5000)

let previousImageSrc
let currentImageSrc
let lastImageChangeTime = 0
function changeDisplayImage(src) {
    previousImageSrc = currentImageSrc
    currentImageSrc = src
    lastImageChangeTime = Date.now()
}

function changeBackgroundImage(src) {
    animateElements(1, ['background-image', 'background-image-2'], src, imageAnimationTime)
}

let currents = [true, true]
let currentImageElement
let isAnimating = false
function animateElements(id, elements, src, duration) {
    let current = currents[id]
    let indexOffset = id * -10 - 2

    let [currentImageID, nextImageID] = current ? elements : elements.reverse()
    let image = document.getElementById(currentImageID)
    let nextImage = document.getElementById(nextImageID)
    nextImage.src = src
    nextImage.style.zIndex = 1 + indexOffset
    image.style.zIndex = 0 + indexOffset

    if (id === 0 && !current) currentImageElement = nextImage

    let start = Date.now()
    console.log('start')
    const animate = () => {
        let elapsed = Date.now() - start

        if (elapsed >= duration) console.log(elapsed, duration)

        if (elapsed < duration) {
            isAnimating = requestAnimationFrame(animate)
            let k = elapsed / duration
            // console.log('animate', k)
            nextImage.style.opacity = k
        } else {
            console.log('done')
            image.style.opacity = 0
            image.style.zIndex = 1 + indexOffset
            nextImage.style.opacity = 1
            nextImage.style.zIndex = 0 + indexOffset
            currents[id] = !currents[id]
            if (id === 0 && !current) currentImageElement = nextImage
            else currentImageElement = null
            isAnimating = false
        }
    }

    if (!isAnimating) animate()
}

// function initTrackList(randomize = false) {
//     tracklist = new Array(trackCount).fill().map((_,i) => i)
//     if (randomize) {
//         for (let i = 0; i < trackCount; i++) {
//             let randomIndex = Math.floor(Math.random() * trackCount)
//             let tmp = tracklist[i]
//             tracklist[i] = tracklist[randomIndex]
//             tracklist[randomIndex] = tmp
//         }
//     }

//     console.log(tracklist)
// }

window.onload = () => {
    const albumID = new URLSearchParams(window.location.search).get('id')
    album = albums[albumID]
    album.tracks = album.tracks_front
    trackCount = album.tracks.length

    tracklist = new Array(trackCount).fill().map((_,i) => i)

    // initTrackList()
    initImageDisplayManagement()
    initBackgroundDisplayManagement()

    canvasContainer = document.getElementById('canvas-inner-container')

    document.querySelector('.track-name').innerText = album.tracks[0].name
    document.querySelector('.album-name').innerText = album.name
    document.querySelector('.published-year').innerText = album.year

    defaultTrack = album.tracks[0].path

    console.log({album, trackCount, tracklist, defaultTrack})

    let p5instance = new p5(sketch, 'canvas-inner-container');
}

const sketch = ( s ) => {
    class VinylPlayer {
        constructor(needleAngle) {
            this.startR = s.height * 0.15
            this.endR = s.height * 0.42

            this.x = s.width/2 - 0.08 * s.width
            this.y = s.height/2
            this.w = this.endR * 2

            this.needleW = 0.12 * s.width
            this.needleH = needleImage.height / needleImage.width * this.needleW
            this.needleX = (s.width + this.x + this.w/2)/2 - s.width*0.08
            this.needleY = s.height/2

            this.needleAnchorX = this.needleX + s.width * 0.004
            this.needleAnchorY = this.needleY - this.needleH*0.1
            this.needleVector = s.createVector(this.needleAnchorX, this.needleAnchorY)
            this.needleAngle = needleAngle
            this.smoothNeedleAngle = needleAngle
            this.needleStartAngle = 0.4
            this.needleMaxAngle = 1.1
            this.needleOnVinyl = false
            this.mouseDragging = false
        }

        draw(amplitude) {
            s.stroke(0)

            if (!this.g) {
                this.g = s.createGraphics(this.w + 40, this.w + 40)
                this.g.strokeWeight(0.5)
            } else this.g.clear()

            const hoveredTrackID = this.getCurrentTrackFromNeedleAngle(this.needleAngle)

            // if (customVinylImage) {
            //     s.push()
            //     s.translate(this.x, this.y)
            //     s.erase()
            //     s.ellipse(0, 0, this.startR*2.5)
            //     s.noErase()
            //     s.rotate(coverImageRotation)
            //     // s.image(vinylImage, 0, 0, this.w, this.w)
            //     s.pop()
            //     this.drawNeedle()
            //     return
            // }

            const stepR = (this.endR - this.startR) / trackCount

            for (let i = 0; i < trackCount; i++) {
                const r = this.endR - stepR*i //- this.stepR*i//s.map(i, 0, this.innerEllipseCount, this.endR, this.startR)

                // let c = s.color('#121214')
                // if (i === hoveredTrackID) c = s.lerpColor(c, s.color(currentTrackHoverColor), 0.4)
                // c.setAlpha(i === this.innerEllipseCount-1 ? 255 : 180)
                // this.g.fill(c)

                let c = s.lerpColor(s.color(album.track_gradient_start), s.color(album.track_gradient_end), s.map(i, 0, trackCount-1, 0, 1))
                if (i === hoveredTrackID) c = s.lerpColor(c, s.color(album.track_hover_color), 0.4)
                this.g.fill(c)

                this.g.beginShape()
                const res = 300
                for (let j = 0; j < res; j++) {
                    let a = j * s.TWO_PI / res
                    let newR = (r) + s.random((s.pow(amplitude, 2)))
                    let x = s.cos(a) * newR + this.g.width/2//+ this.x
                    let y = s.sin(a) * newR + this.g.height/2 //+ this.y
                    this.g.vertex(x, y)
                }
                this.g.endShape(s.CLOSE)

                // s.ellipse(this.x, this.y, r*2)

                // if (i === hoveredTrackID) {
                //     s.fill('#2349A222')
                //     s.ellipse(this.x, this.y, r*2)
                // }
            }

            this.g.ellipseMode(s.CENTER)
            this.g.push()
            this.g.translate(this.g.width/2, this.g.height/2)
            this.g.erase()
            this.g.ellipse(0, 0, this.startR*2)
            this.g.noErase()
            this.g.pop()

            s.image(this.g, this.x, this.y, this.w+20, this.w+20)

            // Blank circle for the image
            // s.erase()
            // s.ellipse(this.x, this.y, this.startR*2)
            // s.noErase()

            this.drawNeedle()
        }

        drawNeedle() {
            s.pop()

            s.push()
            s.translate(this.needleX, this.needleY)

            s.translate(this.needleAnchorX - this.needleX, this.needleAnchorY - this.needleY)
            s.rotate(s.constrain(this.smoothNeedleAngle, 0, this.needleMaxAngle))
            s.translate(-this.needleAnchorX + this.needleX, -this.needleAnchorY + this.needleY)

            // s.fill(200)
            // s.strokeWeight(2)
            // s.ellipse(this.needleAnchorX - this.needleX, this.needleAnchorY - this.needleY, s.width*0.05)
            // s.line(this.needleAnchorX - this.needleX - s.width*0.05/2, this.needleAnchorY - this.needleY, this.needleAnchorX - this.needleX + s.width*0.05/2, this.needleAnchorY - this.needleY,)

            s.image(needleImage, 0, 0, this.needleW, this.needleH)

            // s.strokeWeight(2)
            // s.stroke(0)
            // s.line(this.needleAnchorX - this.needleX, this.needleAnchorY - this.needleY - this.needleH/4, this.needleAnchorX - this.needleX, this.needleAnchorY + this.needleH/4)
            // s.ellipse(this.needleAnchorX - this.needleX, this.needleAnchorY - this.needleY, 40)
            s.pop()
        }

        getAngleToMouse() {
            const mouseVector = s.createVector(s.mouseX, s.mouseY)
            let angle = -mouseVector.sub(this.needleVector).angleBetween(downAngle)

            // Upper part of the needle
            if (s.abs(angle) > s.PI/2)
                angle = angle > 0 ? 0 : s.PI-s.abs(angle)

            return angle
        }

        getCurrentTrackFromNeedleAngle(angle) {
            return Math.min(trackCount-1, s.floor(s.map(angle, this.needleStartAngle, this.needleMaxAngle, 0, trackCount)))
        }

        newUpdate() {
            const progress = audioElement.currentTime / audioElement.duration
            this.strideAngle = (this.needleMaxAngle - this.needleStartAngle) / trackCount

            if (this.mouseDragging) {
                this.needleAngle = this.getAngleToMouse()
            } else if (!this.needleOnVinyl) {
                this.needleAngle = 0
            } else if (!Number.isNaN(progress) && progress > 0) {
                const needleAngle = this.needleStartAngle + this.strideAngle * (currentTrack + progress)
                this.needleAngle = needleAngle
            }

            const diff = this.needleAngle - this.smoothNeedleAngle
            this.smoothNeedleAngle += diff * 0.15
        }

        manualUpdate(clickEvent) {
            const angle = this.getAngleToMouse()
            const id = this.getCurrentTrackFromNeedleAngle(angle)
            this.strideAngle = (this.needleMaxAngle - this.needleStartAngle) / trackCount
            console.log('ypdare')

            // Needle drag out
            if (id < 0) {
                this.needleOnVinyl = false
                currentTrack = 0
                audioElement.currentTime = 0
                audioElement.pause()
                setTrack()
                return
            } else if (audioElement.paused) {
                this.needleOnVinyl = true
            }

            // Track change
            let trackChanged = false
            if (id !== currentTrack) {
                trackChanged = true
                currentTrack = id
                setTrack()
            }

            if (clickEvent && trackChanged) {
                // Start from beginning if click on a new track
                // setTimeout(() => audioElement.currentTime = 0)
                audioElement.currentTime = 0
                this.needleAngle = this.needleStartAngle + this.strideAngle * currentTrack
            } else {
                const progress = s.map(angle, this.needleStartAngle, this.needleMaxAngle, 0, 0.999, true)%(1/trackCount) * trackCount
                const setAudioProgress = () => {
                    audioElement.currentTime = audioElement.duration * progress
                    audioElement.removeEventListener('canplay', setAudioProgress)
                }

                this.needleAngle = this.needleStartAngle + this.strideAngle * (currentTrack + progress)
                if (Number.isNaN(audioElement.duration)) {
                    audioElement.addEventListener('canplay', setAudioProgress)
                } else setAudioProgress()
            }
        }
    }

    function clickOnPlayButton() {
        if (audioElement.paused) {
            vplayer.needleOnVinyl = true
            // audioElement.play()
            setTimeout(() => audioElement.play(), 100)
        }
        else audioElement.pause()
    }

    let released = true
    s.mousePressed = () => {
        if (!released) return
        released = false

        if (!mouseOnCanvas()) return

        if (mouseOnButton()) {
            clickOnPlayButton()
        } else if (mouseOnFlipButton()) {
            flipVinyl()
        } else if (mouseOnNeedle()) {
            vplayer.manualUpdate(true)
        }
        return false
    }

    let dragCount = 0
    s.mouseDragged = () => {
        dragCount++
        if (mouseOnButton() || !mouseOnNeedle() || dragCount < 3) return
        vplayer.mouseDragging = true
    }

    s.mouseReleased = () => {
        dragCount = 0
        released = true
        if (!vplayer.mouseDragging) return
        vplayer.mouseDragging = false
        vplayer.manualUpdate(false)
        return
    }

    function init() {
        btnSize = s.width * 0.1
        btnX = s.width - btnSize
        btnY = s.height - btnSize
        btnMargin = btnSize*0.1
        btnRadius = btnSize*0.1

        flipBtnSize = btnSize * 1.4

        btnHitbox = {
            xMin: btnX - (btnSize - btnMargin)/2,
            xMax: btnX + (btnSize + btnMargin)/2,
            yMin: btnY - (btnSize - btnMargin)/2,
            yMax: btnY + (btnSize + btnMargin)/2,
        }

        flipX = s.width - btnSize * 2.5
        flipHitbox = {
            xMin: flipX - (flipBtnSize - btnMargin)/2,
            xMax: flipX + (flipBtnSize + btnMargin)/2,
            yMin: btnY - (flipBtnSize - btnMargin)/2,
            yMax: btnY + (flipBtnSize + btnMargin)/2,
        }

        vplayer = new VinylPlayer(vplayer ? vplayer.needleAngle : 0)

        const arrowElm = document.getElementById("back-btn")
        const arrowRect = arrowElm.getBoundingClientRect()
        const canvasRect = document.getElementById("canvas-outer-container").getBoundingClientRect()

        // Check if the bounding rects overlap
        if (arrowRect.right > canvasRect.left && arrowRect.left < canvasRect.right &&
            arrowRect.bottom > canvasRect.top && arrowRect.top < canvasRect.bottom) {
                arrowElm.style.top = "auto"
                arrowElm.style.bottom = "20px"
            } else {
                arrowElm.style.top = "20px"
                arrowElm.style.bottom = "auto"
            }

        // initCoverImage('cover-image')
        // initCoverImage('cover-image-2')
    }

    let coverImageRotation = 0
    function initCoverImage(domElementName) {
        const coverImage = document.getElementById(domElementName)
        const coverImageSize = s.height * 0.5

        coverImage.style.width = coverImageSize + 'px'
        coverImage.style.height = coverImageSize + 'px'
        coverImage.style.top = Math.round((s.height - coverImageSize)/2) + 'px'
        coverImage.style.left = Math.round(vplayer.x - coverImageSize/2) + 'px'
    }

    s.preload = () => {
        for (let src of [...album.images, ...[...album.tracks_front, ...album.tracks_back].map(t => t.image)]) {
            images[src] = s.loadImage(src)
        }
        currentImageSrc = album.images[0]
        needleImage = s.loadImage('./needle.png')
        playImage = s.loadImage('./play.png')
        flipImage = s.loadImage('./flip.png')
        if (customVinylImage) vinylImage = s.loadImage(customVinylImage)
    }

    s.setup = () => {
        s.createCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight)
        s.imageMode(s.CENTER)
        s.rectMode(s.CENTER)

        audioElement = new Audio()
        audioElement.crossOrigin = "anonymous"
        audioElement.src = defaultTrack
        audioElement.onended = onTrackEnded

        downAngle = s.createVector(0, 1)

        init()
    }

    s.windowResized = () => {
        s.createCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight)
        init()
    }

    s.draw = () => {
        makeGradient()
        s.rect(s.width/2, s.height/2, s.width, s.height)

        coverImageRotation = s.map(vplayer.smoothNeedleAngle, vplayer.needleStartAngle, vplayer.needleMaxAngle, 0, s.TWO_PI * 10, true)


        const imgW = (vplayer.startR * 2.1)
        const imgAnimProgression = lastImageChangeTime && previousImageSrc ? (Date.now() - lastImageChangeTime)/imageAnimationTime : -1

        s.push()

        const vinylFlipAnimProgress = vinylFlipAnimationStart ? (Date.now() - vinylFlipAnimationStart)/vinylFlipAnimationDuration : -1
        const f = (x) => s.abs(s.cos(vinylFlipAnimProgress* s.PI))

        if (vinylFlipAnimProgress >= 0 && vinylFlipAnimProgress <= 1) {
            s.translate(vplayer.x, vplayer.y)
            s.scale(f(vinylFlipAnimProgress), 1)
            s.translate(-vplayer.x, -vplayer.y)
        }

        if (imgAnimProgression >= 0 && imgAnimProgression <= 1) {
            s.push()
            s.translate(vplayer.x, vplayer.y)
            s.rotate(coverImageRotation)
            s.image(images[currentImageSrc], 0, 0, imgW, imgW)
            s.tint(255, 255-255*imgAnimProgression)
            s.image(images[previousImageSrc], 0, 0, imgW, imgW)
            s.pop()
        }
        else if (currentImageSrc) {
            s.push()
            s.translate(vplayer.x, vplayer.y)
            s.rotate(coverImageRotation)
            s.image(images[currentImageSrc], 0, 0, imgW, imgW)
            s.pop()
        }

        let amplitude = 0
        if (analyser != null && analyser.getFloatTimeDomainData) {
            analyser.getFloatTimeDomainData(data)
            amplitude = 0.5 + data.reduce((a,b) => a + b*b, 0) / data.length * (mobile ? 50 : 100)

            amplitude = Math.min(amplitude, 4)
        }

        vplayer.newUpdate()
        vplayer.draw(amplitude)

        drawButton()
    }

    function drawButton() {
        s.push()

        if (buttonBackground) {
            s.strokeWeight(audioElement.paused ? 1 : 4)
            s.stroke(audioElement.paused ? 0 : 'white')
            s.fill(0, 150)
            s.rect(btnX, btnY, btnSize + btnMargin, btnSize + btnMargin, btnRadius)
        }

        let newSize = audioElement.paused ? btnSize : btnSize * 0.9
        s.image(playImage, btnX, btnY, newSize, newSize)

        let newFlipButtonSize = vinylFlipAnimationStart ? flipBtnSize * 0.9 : flipBtnSize
        s.image(flipImage, flipX, btnY, newFlipButtonSize, newFlipButtonSize)

        s.pop()
    }

    const mouseOnButton = () =>
        s.mouseX > btnHitbox.xMin && s.mouseX < btnHitbox.xMax &&
        s.mouseY > btnHitbox.yMin && s.mouseY < btnHitbox.yMax

    const mouseOnCanvas = () =>
        s.mouseX > 0 && s.mouseX < s.width &&
        s.mouseY > 0 && s.mouseY < s.height

    const mouseOnNeedle = () => {
        const xMin = vplayer.x
        const xMax = vplayer.needleX + vplayer.needleW
        const yMin = vplayer.y - vplayer.endR
        const yMax = vplayer.y + vplayer.endR

        return s.mouseX > xMin && s.mouseX < xMax &&
               s.mouseY > yMin && s.mouseY < yMax
    }

    const mouseOnFlipButton = () =>
        s.mouseX > flipHitbox.xMin && s.mouseX < flipHitbox.xMax &&
        s.mouseY > flipHitbox.yMin && s.mouseY < flipHitbox.yMax

    function makeGradient() {
        let sX = 0, sY = s.height/2
        let eX = s.width, eY = s.height/2

        if (playerGradientDirection === 'vertical') {
            sX = s.width/2
            sY = 0
            eX = s.width/2
            eY = s.height
        }

        let gradient = s.drawingContext.createLinearGradient(sX, sY, eX, eY)

        if (playerGradientDirection === 'radial') {
            gradient = s.drawingContext.createRadialGradient(
                vplayer.x, vplayer.y, vplayer.endR, vplayer.x, vplayer.y, vplayer.endR * 2
              )
        }

        gradient.addColorStop(0, playerGradientStart);
        gradient.addColorStop(1, playerGradientStop);
        s.drawingContext.fillStyle = gradient;
    }
}

function setTrack() {
    const isPlaying = !audioElement.paused
    trackId = tracklist[currentTrack]
    audioElement.src = album.tracks[trackId].path

    document.querySelector('.track-name').innerText = album.tracks[trackId].name

    // if (currentImageElement) currentImageElement.src =  album.tracks[trackId].image

    if (isPlaying)
        audioElement.play()
}

function onTrackEnded() {
    if (currentTrack >= tracklist.length - 1) {
        flipVinyl(() => {
            audioElement.play()
        })
    }
    else {
        currentTrack = (currentTrack+1)%trackCount
        setTrack()
        audioElement.play()
    }
}

function clickOnBackButton() {
    console.log('back')
    window.location = './index.html'
}

function onClick() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    audioCtx = new AudioContext()

    const ios = iOSversion()
    const isUnderIOS14 = ios && ios[0] <= 13

    console.log({ios, isUnderIOS14})

    analyser = audioCtx.createAnalyser();

    if (!isUnderIOS14 && !analyser.getFloatTimeDomainData) {
        var r = new Uint8Array(2048);
        analyser.getFloatTimeDomainData = function(e) {
            analyser.getByteTimeDomainData(r);
            for (var t = 0, o = e.length; o > t; t++) e[t] = .0078125 * (r[t] - 128)
        }
    }

    if (analyser.getFloatTimeDomainData) {
        analyser.fftSize = 2048;
        source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyser);
        source.connect(audioCtx.destination);
        data = new Float32Array(analyser.fftSize);
    }

    console.log('click2')

    window.removeEventListener('click', onClick)
    window.removeEventListener('touchend', onClick)
}

window.addEventListener('click', onClick)
window.addEventListener('touchend', onClick)

// https://github.com/processing/p5.js/issues/3610
p5.Renderer2D.prototype._getTintedImageCanvas = function(img) {
    if (!img.canvas) {
      return img;
    }

    if (!img.tintCanvas) {
      // Once an image has been tinted, keep its tint canvas
      // around so we don't need to re-incur the cost of
      // creating a new one for each tint
      img.tintCanvas = document.createElement('canvas');
    }

    // Keep the size of the tint canvas up-to-date
    if (img.tintCanvas.width !== img.canvas.width) {
      img.tintCanvas.width = img.canvas.width;
    }
    if (img.tintCanvas.height !== img.canvas.height) {
      img.tintCanvas.height = img.canvas.height;
    }

    // Goal: multiply the r,g,b,a values of the source by
    // the r,g,b,a values of the tint color
    const ctx = img.tintCanvas.getContext('2d');

    ctx.save();
    ctx.clearRect(0, 0, img.canvas.width, img.canvas.height);

    if (this._tint[0] < 255 || this._tint[1] < 255 || this._tint[2] < 255) {
      // Color tint: we need to use the multiply blend mode to change the colors.
      // However, the canvas implementation of this destroys the alpha channel of
      // the image. To accommodate, we first get a version of the image with full
      // opacity everywhere, tint using multiply, and then use the destination-in
      // blend mode to restore the alpha channel again.

      // Start with the original image
      ctx.drawImage(img.canvas, 0, 0);

      // This blend mode makes everything opaque but forces the luma to match
      // the original image again
      ctx.globalCompositeOperation = 'luminosity';
      ctx.drawImage(img.canvas, 0, 0);

      // This blend mode forces the hue and chroma to match the original image.
      // After this we should have the original again, but with full opacity.
      ctx.globalCompositeOperation = 'color';
      ctx.drawImage(img.canvas, 0, 0);

      // Apply color tint
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = `rgb(${this._tint.slice(0, 3).join(', ')})`;
      ctx.fillRect(0, 0, img.canvas.width, img.canvas.height);

      // Replace the alpha channel with the original alpha * the alpha tint
      ctx.globalCompositeOperation = 'destination-in';
      ctx.globalAlpha = this._tint[3] / 255;
      ctx.drawImage(img.canvas, 0, 0);
    } else {
      // If we only need to change the alpha, we can skip all the extra work!
      ctx.globalAlpha = this._tint[3] / 255;
      ctx.drawImage(img.canvas, 0, 0);
    }

    ctx.restore();
    return img.tintCanvas;
};
