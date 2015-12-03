angular.module('zexplorer')
.factory('torrentTypeIcons', [function() {

    var generalMovie = {
        icon: 'videocam',
        color: 'blue'
    },
        generalGame = {
            icon: 'games',
            color: 'orange'
    },
        generalSoft = {
            icon: 'memory',
            color: 'green'
    },
        generalMusic = {
            icon: 'volume_up',
            color: 'darkorange'
    };

    return {
        movie: generalMovie,
        moviehd: {
            icon: 'high_quality',
            color: 'green'
        },
        dvd: {
            icon: 'disc_full',
            color: 'brown'
        },
        blueray: {
            icon: 'disc_full',
            color: 'darkblue'
        },
        anime: angular.extend({}, generalMovie, {color: 'yellow'}),
        vidhd: {
            icon: 'high_quality',
            color: 'lightgreen'
        },
        "3d": {
            icon: '3d_rotation',
            color: 'blue'
        },
        science: {
            icon: 'camera_roll',
            color: 'brown'
        },
        movierus: angular.extend({}, generalMovie, {color: 'red'}),
        moviebg: angular.extend({}, generalMovie, {color: 'green'}),

        tv: {
            icon: 'tv',
            color: 'lightblue'
        },
        tvhd: {
            icon: 'tv',
            color: 'green'
        },
        clips: {
            icon: 'play_arrow',
            color: 'purple'
        },

        pcrip: generalGame,
        pciso: angular.extend({}, generalGame, {color: 'red'}),
        ps3: angular.extend({}, generalGame, {color: 'blue'}),
        xbox: angular.extend({}, generalGame, {color: 'green'}),

        mac: {
            icon: 'apple',
            color: 'black'
        },

        pcsoft: generalSoft,
        miscsoft: generalSoft,

        music: generalMusic,
        flac: angular.extend({}, generalMusic, {color: 'green'}),
        dts: angular.extend({}, generalMusic, {color: 'green'}),
        musicdvd: angular.extend({}, generalMusic, {color: 'green'}),
        "24bit": angular.extend({}, generalMusic, {color: 'green'}),

        porn: {
            icon: 'play_circle_outline',
            color: 'pink'
        },
        pornhd: {
            icon: 'play_circle_fill',
            color: 'pink'
        },

        book: {
            icon: 'book',
            color: 'grey'
        },

        sport: {
            icon: 'directions_bike',
            color: 'lightblue'
        },

        others: {
            icon: 'attachment',
            color: 'lightgrey'
        }
    };
}]);