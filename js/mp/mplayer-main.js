console.log('mplayer-main.js loaded');

var modeText = ['顺序播放', '单曲循环', '随机播放', '列表循环'];
var detitle = document.title;

console.log('jQuery loaded:', typeof jQuery !== 'undefined');

$(document).ready(function() {
	console.log('DOM ready, initializing player...');
	console.log('Container exists:', $('.mp').length > 0);
	
	var player = new MPlayer({
		// 容器选择器名称
		containerSelector: '.mp',
		// 播放列表
		songList: mplayer_song,
		// 专辑图片错误时显示的图片
		defaultImg: 'images/error.jpg',
		// 自动播放
		autoPlay: false,
		// 播放模式(0->顺序播放,1->单曲循环,2->随机播放,3->列表循环(默认))
		playMode: 3,
		playList: 0,
		playSong: 0,
		// 当前歌词距离顶部的距离
		lrcTopPos: 34,
		// 列表模板，用${变量名}$插入模板变量
		listFormat: '<tr><td>${name}$</td><td>${singer}$</td><td>${time}$</td></tr>',
		// 音量滑块改变事件名称
		volSlideEventName: 'change',
		// 初始音量
		defaultVolume: 80,
		// 歌词替代标题
		outLrc: true
	}, function () {
		console.log('Player initialized successfully');
		// 将音频标签添加到DOM中
		$('body').append(this.audio);
		console.log('Audio element appended to DOM');
		// 绑定事件
		this.on('afterInit', function () {
			console.log('播放器初始化完成，正在准备播放');
			// 显示初始歌曲信息
			this._setInfo(this.settings.playList, this.settings.playSong);
		}).on('beforePlay', function () {
			var $this = this;
			var song = $this.getCurrentSong(true);
			var songName = song.name + ' - ' + song.singer;
			console.log('即将播放' + songName + '，return false;可以取消播放');
		}).on('timeUpdate', function () {
			var $this = this;
			var lrc = $this.getLrc();
			//console.log('当前歌词：' + lrc);
			//logout(lrc);
			if ($this.settings.outLrc && !$this.audio.prop('paused')) {
				document.title = lrc == undefined ? detitle : lrc;
			} else {
				document.title = detitle;
			}
		}).on('end', function () {
			var $this = this;
			var song = $this.getCurrentSong(true);
			var songName = song.name + ' - ' + song.singer;
			console.log(songName + '播放完毕，return false;可以取消播放下一曲');
		}).on('mute', function () {
			var status = this.getIsMuted() ? '已静音' : '未静音';
			console.log('当前静音状态：' + status);
		}).on('changeMode', function () {
			var $this = this;

			var mode = modeText[$this.getPlayMode()];
			$this.dom.container.find('.mp-mode').attr('title', mode);
			console.log('播放模式已切换为：' + mode);
		});
		
		setEffects(this);
	});
});

function setEffects(player) {
	console.log('setEffects called, player:', player);
	console.log('container:', player.dom.container);
	
	// 滑块
	if (player.dom.volRange.length > 0) {
		player.dom.volRange.nstSlider({
			"left_grip_selector": ".mp-vol-circle",
			"value_changed_callback": function (cause, value) {
				player.dom.container.find('.mp-vol-current').width(value + '%');
				player.dom.volRange.trigger('change', [value]);
			}
		});
	}
	
	// 播放模式
	player.dom.container.find('.mp-mode').click(function () {
		var dom = $(this);
		var mode = player.getPlayMode();
		dom.removeClass('mp-mode-' + mode);
		mode = mode == 3 ? 0 : mode + 1;
		player.changePlayMode(mode);
		dom.addClass('mp-mode-' + mode);
	});
	
	// 播放列表
	player.dom.container.find('.mp-list-toggle').click(function () {
		player.dom.container.find('.mp-list-box').toggleClass('mp-list-show');
	});
	
	// 歌词
	player.dom.container.find('.mp-lrc-toggle').click(function () {
		player.dom.container.find('.mp-lrc-box').toggleClass('mp-lrc-show');
	});
	
	// 切换按钮
	var toggleBtn = player.dom.container.find('.mp-toggle');
	console.log('toggle button found:', toggleBtn.length);
	if (toggleBtn.length > 0) {
		toggleBtn.click(function () {
			console.log('toggle button clicked');
			player.dom.container.toggleClass('mp-show');
			console.log('mp-show class toggled');
		});
	} else {
		console.error('toggle button not found!');
	}
	
	// 歌词关闭
	player.dom.container.find('.mp-lrc-close').click(function () {
		player.dom.container.find('.mp-lrc-box').removeClass('mp-lrc-show');
	});
	
	// 上一首
	player.dom.container.find('.mp-prev').click(function () {
		console.log('prev button clicked');
		player.prev();
	});
	
	// 播放/暂停
	player.dom.container.find('.mp-pause').click(function () {
		console.log('play/pause button clicked');
		if (player.audio.prop('paused')) {
			player.play();
			console.log('playing');
		} else {
			player.pause();
			console.log('paused');
		}
	});
	
	// 下一首
	player.dom.container.find('.mp-next').click(function () {
		console.log('next button clicked');
		player.next();
	});
	
	// 音量控制
	player.dom.container.find('.mp-vol-img').click(function () {
		console.log('volume button clicked');
		player.toggleMute();
	});
	
	// 进度条点击
	player.dom.container.find('.mp-pro').click(function (event) {
		console.log('progress bar clicked');
		var width = $(this).width();
		var offset = Math.min(Math.max(event.offsetX, 0), width);
		var percent = offset / width;
		player.setCurrentTime(player.getDuration() * percent);
	});
	
	console.log('All event listeners bound');
}