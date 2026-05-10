import { useEffect, useRef } from 'react';

export default function BackgroundMusic({ isPlaying, volume, restartTrigger }) {
  const playerRef = useRef(null);
  const saveIntervalRef = useRef(null);

  useEffect(() => {
    // YouTube IFrame API yükleme
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('bg-music-player', {
        height: '0',
        width: '0',
        videoId: '6Ujs0_z_amI',
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: '6Ujs0_z_amI',
          controls: 0,
          showinfo: 0,
          autohide: 1,
          modestbranding: 1,
          mute: 0,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volume);
            
            // Hafızadaki saniyeden devam et
            const savedTime = localStorage.getItem('bg_music_time');
            if (savedTime) {
              event.target.seekTo(parseFloat(savedTime), true);
            }

            if (isPlaying) {
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    // Temizlik: Interval'i temizle
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, []);

  // İlerleme durumunu periyodik olarak kaydet
  useEffect(() => {
    if (isPlaying && playerRef.current && playerRef.current.getCurrentTime) {
      saveIntervalRef.current = setInterval(() => {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime > 0) {
          localStorage.setItem('bg_music_time', currentTime.toString());
        }
      }, 2000); // Her 2 saniyede bir kaydet
    } else {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    }

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // isPlaying veya volume değiştiğinde player'ı güncelle
  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  // Restart tetiklendiğinde başa sar
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(0);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [restartTrigger]);

  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div id="bg-music-player"></div>
    </div>
  );
}
