let currentAlbumId = 0
let totalAlbumCount = albums.length
let albumSelector

window.onload = () => {
    for (let [id, album] of Object.entries(albums)) {
        createAlbumDiv(Number(id), album)
    }

    albumSelector = document.querySelectorAll('.outer-container')
}

function createAlbumDiv(id, album) {
    const trackCount = album.tracks_front.length + album.tracks_back.length

    if (id === 0) {
        document.querySelector('.cover-image').src = album.images[0]
        document.querySelector('.album-name').innerText = album.name
        document.querySelector('.album-desc').innerText = trackCount + ' tracks'
        document.querySelector('.published-year').innerText = album.year
        document.querySelector('.album-id').innerText = '1/' + totalAlbumCount
        return
    }

    const albumDiv = document.createElement('div')
    albumDiv.innerHTML = `
    <div class="outer-container inactive-container">
        <div class="inner-container">
            <svg id="btn-previous" onclick="clickOnPrevious()" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-skip-back" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M20 5v14l-12 -7z"></path>
                <line x1="4" y1="5" x2="4" y2="19"></line>
            </svg>
            <img class="cover-image" src="${album.images[0]}" alt="cover">
            <svg id="btn-next" onclick="clickOnNext()" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-skip-forward" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M4 5v14l12 -7z"></path>
                <line x1="20" y1="5" x2="20" y2="19"></line>
            </svg>
            <svg id="btn-play" onclick="clickOnPlay(${id})" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M7 4v16l13 -8z"></path>
             </svg>
            <div class="album-decoration">
                <p class="album-name">${album.name}</p>
                <p class="album-desc">${trackCount} tracks</p>
            </div>
            <p class="album-decoration published-year">${album.year}</p>
            <p class="album-id">${id+1}/${totalAlbumCount}</p>
        </div>
    </div>`

    document.body.appendChild(albumDiv)
}

function clickOnPrevious() {
    let previousID = currentAlbumId
    if (--currentAlbumId < 0) currentAlbumId = totalAlbumCount-1

    animate('right', previousID)
}

function clickOnNext() {
    let previousID = currentAlbumId
    currentAlbumId = (currentAlbumId + 1)%totalAlbumCount

    animate('left', previousID)
}

function clickOnPlay(id) {
    window.location = './vinyl.html?id=' + id
}

function animate(direction='left', previousID) {
    const current = albumSelector[previousID]
    const next = albumSelector[currentAlbumId]
    const isLeft = direction === 'left'

    gsap.to(current, {
        x: isLeft ? '-100%' : '100%',
        autoAlpha: 0,
    })

    gsap.fromTo(next, {
        x: isLeft ? '100%' : '-100%',
        autoAlpha: 0,
    }, {
        x: '0%',
        autoAlpha: 1,
    })
}
