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
        images: ['./ALBUM.png'],
        backgrounds: ['./bg.png', './bg.png'],
        track_gradient_start: '#ff3000',
        track_gradient_end: '#fee400',
        track_hover_color: '#0000F6',
        tracks_front: [
            {
                name: 'A Marie',
                path: './AMarie.mp3',
                image: './AMarie.png',
            }, {
                name: 'Basement Song',
                path: './BasementSong.mp3',
                image: './BasementSong22.png',
            }, {
                name: 'Allo',
                path: './Allo.mp3',
                image: './Allo2.png',
            }, {
                name: 'Who Are We',
                path: './WhoAreWe.mp3',
                image: './WhoAreWe23.png',
            }, {
                name: 'Beaten Battered Shoreline',
                path: './BeatenBatteredShoreline.mp3',
                image: './BeatenBatteredShoreline3.png',
            }
        ],
        tracks_back: [
            {
                name: 'Midnight',
                path: './Midnight.mp3',
                image: './mIDNIGHT2.png',
            }, {
                name: 'Standing Undressed',
                path: './StandingUndressed.mp3',
                image: './StandingUndressed2.png',
            }
        ]

    }
]
