// Album structure : {
//     name:  Text
//     year:  Number
//     images:       Array [1...N]
//     backgrounds:  Array [1...N]
//     front_tracks: Array [1...N]
//     back_tracks:  Array [1...N]
//     track_gradient_start: Text
//     track_gradient_end:   Text
//     track_hover_color:    Text
// }

// Track structure : {
//     name: Text
//     path: Text
//     image: Text (optional property)
// }

const albums = [
    {
        name: 'I Probably Should Not Have Said That',
        year: 2024,
        images: ['./ALBUM.png', './2.png', './1.png'],
        backgrounds: ['./bg.png', './bg.png'],
        track_gradient_start: '#ff3000',
        track_gradient_end: '#fee400',
        track_hover_color: '#0000F6',
        tracks_front: [
            {
                name: 'A Marie',
                path: './AMarie.ogg',
                image: './AMarie.png',
            }, {
                name: 'Basement Song',
                path: './BasementSong.ogg',
                image: './BasementSong22.png',
            }, {
                name: 'Allo',
                path: './Allo.ogg',
                image: './Allo2.png',
            }, {
                name: 'Who Are We',
                path: './WhoAreWe.ogg',
                image: './WhoAreWe23.png',
            }, {
                name: 'Beaten Battered Shoreline',
                path: './BeatenBatteredShoreline.ogg',
                image: './BeatenBatteredShoreline3.png',
            }
        ],
        tracks_back: [
            {
                name: 'Midnight',
                path: './Midnight.ogg',
                image: './mIDNIGHT2.png',
            }, {
                name: 'Standing Undressed',
                path: './StandingUndressed.ogg',
                image: './StandingUndressed2.png',
            }, {
                name: 'Mommas Boy',
                path: './MommasBoy.ogg',
                image: './MommasBoy2.png',
            }, {
                name: 'Exhale',
                path: './Exhale.ogg',
                image: './exhales.png',
            }, {
                name: 'Those Three Words',
                path: './ThoseThreeWords.ogg',
                image: './ThoseThreeWords2.png',
            }
        ]

    }
]
