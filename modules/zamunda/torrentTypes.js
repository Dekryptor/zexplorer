var typeParser = (function() {

	// Private

	var types = {
		'http://img.zamunda.net/pic/cat_movies_sd.gif': 'movie',
		'http://img.zamunda.net/pic/cat_movs_hdtv.gif': 'moviehd',
		'http://img.zamunda.net/pic/cat_movies_dvdr.gif': 'dvd',
		'http://img.zamunda.net/pic/cat_bluray.gif': 'blueray',
		'http://img.zamunda.net/pic/cat_anime_anime.gif': 'anime',
		'http://img.zamunda.net/pic/cat_video_hdtv.gif': 'vidhd',
		'http://img.zamunda.net/pic/cat_3d.gif': '3d',
		'http://img.zamunda.net/pic/cat_movies_science.gif': 'science',
		'http://img.zamunda.net/pic/cat_movies_xvidrus.gif': 'movierus',
		'http://img.zamunda.net/pic/cat_movies_xvidbg.gif': 'moviebg',

		'http://img.zamunda.net/pic/cat_episodes_tveps.gif': 'tv',
		'http://img.zamunda.net/pic/cat_episodes_tveps_hd.gif': 'tvhd',

		'http://img.zamunda.net/pic/cat_games_pcrip.gif': 'pcrip',
		'http://img.zamunda.net/pic/cat_games_pciso.gif': 'pciso',
		'http://img.zamunda.net/pic/cat_games_ps2.gif': 'ps3',
		'http://img.zamunda.net/pic/cat_apps_xbox.gif': 'xbox',

		'http://img.zamunda.net/pic/cat_apps_mac.gif': 'mac',

		'http://img.zamunda.net/pic/cat_apps_pciso.gif': 'pcsoft',
		'http://img.zamunda.net/pic/cat_apps_misc.gif': 'miscsoft',

		'http://img.zamunda.net/pic/cat_music_music.gif': 'music',
		'http://img.zamunda.net/pic/cat_music_music_flac.gif': 'flac',
		'http://img.zamunda.net/pic/cat_music_musicdts.gif': 'dts',
		'http://img.zamunda.net/pic/cat_music_dvdr.gif': 'musicdvd',
		'http://img.zamunda.net/pic/cat_music_hires.gif': '24bit',

		'http://img.zamunda.net/pic/cat_xxx_porn.gif': 'porn',
		'http://img.zamunda.net/pic/cat_xxx_hd.gif': 'pornhd'
	};

	// Exposed

	function getType(typeImgUrl) {
		if (!typeImgUrl) throw new Error('typeImgUrl is not defined');
		return types[typeImgUrl] || undefined;
	}
	// TODO remove list + {all: list} if is not used anymore.
	function list() {
		return types;
	}

	return {
		all: list,
		getType: getType
	};

}());

module.exports = typeParser;