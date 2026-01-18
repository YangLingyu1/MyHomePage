/**
 * 音乐播放器模块
 * 从 index.html 内联代码中提取
 */

(function() {
    'use strict';

    const bgMusic = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playBtn');
    const playIcon = playBtn.querySelector('.play-icon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const modeBtn = document.getElementById('modeBtn');
    const modeIcon = modeBtn.querySelector('.mode-icon');
    const musicTitle = document.getElementById('musicTitle');
    const listBtn = document.getElementById('listBtn');
    const closeListBtn = document.getElementById('closeListBtn');
    const playlistContainer = document.getElementById('playlistContainer');
    const playlistElement = document.getElementById('playlist');
    const addSongBtn = document.getElementById('addSongBtn');
    const fileInput = document.getElementById('fileInput');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const songNameInput = document.getElementById('songName');
    const insertPositionSelect = document.getElementById('insertPosition');
    const musicPlayer = document.getElementById('musicPlayer');
    const dragHandle = document.getElementById('dragHandle');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.querySelector('.volume-icon');

    let selectedFile = null;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let animationFrameId = null;
    let currentX = 0;
    let currentY = 0;

    const musicExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];
    const musicDir = './audio/music/';

    let playlist = [];
    let currentIndex = 0;
    let isPlaying = false;
    let playMode = 0;
    const modeIcons = ['🔁', '🔀', '1️⃣'];
    const modeNames = ['顺序播放', '随机播放', '单曲循环'];

    function scanMusicFiles() {

        const musicFiles = [
            { title: 'lulala(汉语)', src: './audio/music/lulala(汉语).mp3' },
            { title: 'lulala(韩语)', src: './audio/music/lulala(韩语).mp3' },
            { title: 'lulala(日语)', src: './audio/music/lulala(日语).mp3' },
            { title: '赴每一程未知(哼唱版)', src: './audio/music/赴每一程未知(哼唱版).mp3' },
            { title: '赴每一程未知', src: './audio/music/赴每一程未知.mp3' },
            { title: 'Shelter(轻柔版)', src: './audio/music/Shelter(轻柔版).mp3' },
            { title: '凑热闹BY2', src: './audio/music/BY2 - 凑热闹.mp3' },
            { title: '不散的夏之灯', src: './audio/music/不散的夏之灯.mp3' },
            { title: '塞壬唱片Misty_Memory', src: './audio/music/塞壬唱片Misty_Memory.mp3' },
            { title: 'ElectronicVibes', src: './audio/music/Electronic Vibes.mp3' },
            { title: '你的名字-夢灯籠', src: './audio/music/你的名字-夢灯籠.mp3' },
            { title: '希望有羽毛和翅膀', src: './audio/music/希望有羽毛和翅膀.mp3' },
        ];

        return musicFiles;
    }

    function loadSong(index) {
        if (index >= 0 && index < playlist.length) {
            currentIndex = index;
            bgMusic.src = playlist[index].src;
            musicTitle.textContent = playlist[index].title;
            updatePlaylistActive();
        }
    }

    function playSong() {
        bgMusic.volume = volumeSlider.value / 100;
        bgMusic.play().catch(function(error) {
        });
        playIcon.textContent = '❚❚';
        playBtn.classList.add('playing');
        isPlaying = true;
    }

    function pauseSong() {
        bgMusic.pause();
        playIcon.textContent = '▶';
        playBtn.classList.remove('playing');
        isPlaying = false;
    }

    function getNextIndex() {
        switch(playMode) {
            case 0:
                return (currentIndex + 1) % playlist.length;
            case 1:
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * playlist.length);
                } while (nextIndex === currentIndex && playlist.length > 1);
                return nextIndex;
            case 2:
                return currentIndex;
            default:
                return (currentIndex + 1) % playlist.length;
        }
    }

    function getPrevIndex() {
        switch(playMode) {
            case 0:
                return (currentIndex - 1 + playlist.length) % playlist.length;
            case 1:
                let prevIndex;
                do {
                    prevIndex = Math.floor(Math.random() * playlist.length);
                } while (prevIndex === currentIndex && playlist.length > 1);
                return prevIndex;
            case 2:
                return currentIndex;
            default:
                return (currentIndex - 1 + playlist.length) % playlist.length;
        }
    }

    function initPlayer() {
        playlist = scanMusicFiles();
        renderPlaylist();
        loadSong(currentIndex);

        const savedVolume = localStorage.getItem('musicVolume');
        if (savedVolume !== null) {
            volumeSlider.value = savedVolume;
            bgMusic.volume = savedVolume / 100;

            if (savedVolume == 0) {
                volumeIcon.textContent = '🔇';
            } else if (savedVolume < 50) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }
    }

    function renderPlaylist() {
        playlistElement.innerHTML = '';
        playlist.forEach(function(song, index) {
            const li = document.createElement('li');
            li.className = 'playlist-item' + (index === currentIndex ? ' active' : '');
            li.innerHTML = `
                <span class="song-number">${index + 1}</span>
                <span class="song-name">${song.title}</span>
                <span class="playing-icon">♪</span>
                <button class="delete-btn" data-index="${index}" aria-label="删除歌曲">×</button>
            `;
            playlistElement.appendChild(li);
        });
    }

    function updatePlaylistActive() {
        const items = playlistElement.querySelectorAll('.playlist-item');
        items.forEach(function(item, index) {
            if (index === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function deleteSong(index) {
        if (index >= 0 && index < playlist.length) {
            const song = playlist[index];
            if (song.isLocal) {
                URL.revokeObjectURL(song.src);
            }
            playlist.splice(index, 1);

            if (index === currentIndex) {
                if (playlist.length > 0) {
                    loadSong(index % playlist.length);
                    if (isPlaying) {
                        playSong();
                    }
                } else {
                    bgMusic.src = '';
                    musicTitle.textContent = '';
                    isPlaying = false;
                    playIcon.textContent = '▶';
                    playBtn.classList.remove('playing');
                }
            } else if (index < currentIndex) {
                currentIndex--;
            }

            renderPlaylist();
        }
    }

    playlistElement.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            e.stopPropagation();
            const index = parseInt(deleteBtn.getAttribute('data-index'));
            deleteSong(index);
            return;
        }

        const item = e.target.closest('.playlist-item');
        if (item) {
            const index = Array.from(playlistElement.children).indexOf(item);
            if (index !== -1) {
                loadSong(index);
                playSong();
            }
        }
    });

    playlistElement.addEventListener('wheel', function(e) {
        e.stopPropagation();
    }, { passive: true });

    listBtn.addEventListener('click', function() {
        const isShowing = playlistContainer.classList.contains('show');
        playlistContainer.classList.toggle('show');

        if (!isShowing) {
            const playerRect = musicPlayer.getBoundingClientRect();
            const windowWidth = window.innerWidth;

            if (playerRect.right > windowWidth / 2) {
                playlistContainer.style.left = 'auto';
                playlistContainer.style.right = '0';
            } else {
                playlistContainer.style.right = 'auto';
                playlistContainer.style.left = '0';
            }
        }
    });

    closeListBtn.addEventListener('click', function() {
        playlistContainer.classList.remove('show');
    });

    addSongBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            songNameInput.value = selectedFile.name.replace(/\.[^/.]+$/, '');
            modalOverlay.classList.add('show');
        }
    });

    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        bgMusic.volume = volume;

        if (volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    });

    volumeSlider.addEventListener('change', function() {
        const volume = this.value / 100;
        bgMusic.volume = volume;
        localStorage.setItem('musicVolume', this.value);
    });

    modalClose.addEventListener('click', function() {
        modalOverlay.classList.remove('show');
        selectedFile = null;
        fileInput.value = '';
    });

    modalCancel.addEventListener('click', function() {
        modalOverlay.classList.remove('show');
        selectedFile = null;
        fileInput.value = '';
    });

    modalConfirm.addEventListener('click', function() {
        if (selectedFile) {
            const songName = songNameInput.value.trim() || selectedFile.name.replace(/\.[^/.]+$/, '');
            const position = insertPositionSelect.value;
            const fileURL = URL.createObjectURL(selectedFile);

            const newSong = {
                title: songName,
                src: fileURL,
                isLocal: true
            };

            let insertIndex = playlist.length;

            switch(position) {
                case 'beginning':
                    insertIndex = 0;
                    break;
                case 'after':
                    insertIndex = currentIndex + 1;
                    break;
                case 'before':
                    insertIndex = currentIndex;
                    break;
                case 'end':
                default:
                    insertIndex = playlist.length;
                    break;
            }

            playlist.splice(insertIndex, 0, newSong);

            if (insertIndex <= currentIndex) {
                currentIndex++;
            }

            renderPlaylist();
            modalOverlay.classList.remove('show');
            selectedFile = null;
            fileInput.value = '';
        }
    });

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('show');
            selectedFile = null;
            fileInput.value = '';
        }
    });

    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    prevBtn.addEventListener('click', function() {
        const prevIndex = getPrevIndex();
        loadSong(prevIndex);
        if (isPlaying) {
            playSong();
        }
    });

    nextBtn.addEventListener('click', function() {
        const nextIndex = getNextIndex();
        loadSong(nextIndex);
        if (isPlaying) {
            playSong();
        }
    });

    modeBtn.addEventListener('click', function() {
        playMode = (playMode + 1) % 3;
        modeIcon.textContent = modeIcons[playMode];

        if (playMode === 2) {
            bgMusic.loop = true;
        } else {
            bgMusic.loop = false;
        }
    });

    bgMusic.addEventListener('ended', function() {
        if (playMode !== 2) {
            const nextIndex = getNextIndex();
            loadSong(nextIndex);
            playSong();
        }
    });

    makeDraggable(musicPlayer, dragHandle, {
        onDragEnd: function(x, y) {
            if (playlistContainer.classList.contains('show')) {
                const playerRect = musicPlayer.getBoundingClientRect();
                const windowWidth = window.innerWidth;

                if (playerRect.right > windowWidth / 2) {
                    playlistContainer.style.left = 'auto';
                    playlistContainer.style.right = '0';
                } else {
                    playlistContainer.style.right = 'auto';
                    playlistContainer.style.left = '0';
                }
            }
        }
    });

    let playerInitialized = false;

    function lazyInitPlayer() {
        if (!playerInitialized) {
            initPlayer();
            playerInitialized = true;
        }
    }

    playBtn.addEventListener('click', function() {
        lazyInitPlayer();
    });

    nextBtn.addEventListener('click', function() {
        lazyInitPlayer();
    });

    prevBtn.addEventListener('click', function() {
        lazyInitPlayer();
    });

    listBtn.addEventListener('click', function() {
        lazyInitPlayer();
    });

    window.playSpecificSong = function(songTitle) {
        lazyInitPlayer();
        const songIndex = playlist.findIndex(function(song) {
            return song.title === songTitle;
        });
        if (songIndex !== -1) {
            loadSong(songIndex);
            playSong();
        }
    };

    const videos = document.querySelectorAll('.video-background');
    const activeVideo = document.querySelector('.video-background.active');
    if (activeVideo) {
        activeVideo.play().catch(function(error) {
        });
    }
})();
