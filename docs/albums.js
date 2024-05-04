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
        name: ' ',
        year: 2024,
        images: ['./ALBUM.png'],
        backgrounds: ['./bg.png', './bg.png'],
        track_gradient_start: '#ff3000',
        track_gradient_end: '#fee400',
        track_hover_color: '#0000F6',
        tracks_front: [
            {
                name: 'Angelic Anguish',
                path: "./angelicanguish.mp3",
                image: './1.gif',
            }, {
                name: 'Catching Z\'s',
                path: "./catchingzs.mp3",
                image: './2.gif',
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
