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
        images: ['./ALBUMsm.png', './2sm.png', './1sm.png'],
        backgrounds: ['./bg.png'],
        track_gradient_start: '#ff3000',
        track_gradient_end: '#fee400',
        track_hover_color: '#0000F6',
        tracks_front: [
            {
                name: 'A Marie',
                path: "./AMarie.mp3",
                image: './AMariesm.png',
            }, {
                name: 'Basement Song',
                path: "./BasementSong.mp3",
                image: './BasementSong22sm.png',
            }
        ],
        tracks_back: [
            {
                name: 'Halcyon',
                path: "./halcyon.mp3",
                image: './3.gif',
            }, {
                name: 'Too Scared of the Future',
                path: "./tooscared.mp3",
                image: './4.gif',
            },
        ]

    }
]
