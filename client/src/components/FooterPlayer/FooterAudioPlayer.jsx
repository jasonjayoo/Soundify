import React, { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import FooterAudioControls from "./FooterAudioControls"
import "./styles/FooterMusicPlayer.css"
import Slider from "@mui/material/Slider"
import Stack from "@mui/material/Stack"
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded"
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded"
import Marquee from "react-fast-marquee"
import { width } from "@mui/system"

const AudioPlayer = ({
    tracks,
    currentSong,
    oneSongClick,
    setOneSongClick,
    audioR,
    genreClickCount,
    playing,
    prevCount,
    currentPlayer,
    isOnePlaying,
    isTwoPlaying,
    isThreePlaying,
}) => {
    // State
    const location = useLocation()
    const [trackIndex, setTrackIndex] = useState(0)
    const [trackProgress, setTrackProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.2)
    // const [style, setStyle] = useState({ display: 'none' });

    // Destructure for conciseness
    const { title, artist, audioSrc } = tracks[trackIndex]

    // Refs

    let audioRef = currentPlayer

    const isReady = useRef(false)
    const intervalRef = useRef()

    const [duration, setDuration] = useState(0)
    const [trackStyle, setTrackStyle] = useState(`
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${0}, #fff), color-stop(${0}, #777))`)
    const [currentPercent, setCurrentPercent] = useState(0)

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current)

        intervalRef.current = setInterval(() => {
            if (audioRef) {
                if (audioRef.current && audioRef.current.ended) toNextTrack()
                else if (audioRef.ended) toNextTrack()
                else {
                    if (audioRef.current)
                        setTrackProgress(audioRef.current.currentTime)
                    else setTrackProgress(audioRef.currentTime)
                }
            }
        }, [100])
    }

    const onScrub = (value) => {
        // Clear any timers already running
        clearInterval(intervalRef.current)

        audioRef.current.currentTime = value
        setTrackProgress(audioRef.current.currentTime)
    }

    const onScrubEnd = () => {
        // If not already playing, start
        if (!isPlaying) {
            setIsPlaying(true)
        }
        startTimer()
    }

    const toPrevTrack = () => {
        if (trackIndex - 1 < 0) {
            setTrackIndex(tracks.length - 1)
        } else {
            setTrackIndex(trackIndex - 1)
        }
    }

    const toNextTrack = () => {
        if (trackIndex < tracks.length - 1) {
            setTrackIndex(trackIndex + 1)
        } else {
            setTrackIndex(0)
        }
    }

    const onVolumeChange = (e) => {
        const { target } = e
        const newVolume = +target.value

        if (newVolume) {
            setVolume(newVolume)
            audioRef.current.volume = newVolume || 0.01
        }
    }

    useEffect(() => {}, [currentSong])

    useEffect(() => {
        if (isOnePlaying || isTwoPlaying || isThreePlaying) setIsPlaying(true)
        else if (!isOnePlaying && !isTwoPlaying && !isThreePlaying)
            setIsPlaying(false)
    }, [isOnePlaying, isTwoPlaying, isThreePlaying])

    useEffect(() => {
        if (genreClickCount > prevCount) {
            if (audioRef.current) audioRef.current.pause()
        }
    }, [genreClickCount, prevCount, currentSong])

    // Handles cleanup and setup when changing tracks
    useEffect(() => {
        if (audioRef.current) {
            if (audioR && audioR.current) audioRef = audioR
            else if (audioR && !audioR.current) audioRef.current = audioR

            setOneSongClick(false)
        }
    }, [oneSongClick, currentSong, audioR])

    useEffect(() => {
        if (location.pathname.split("/")[1] !== "song") {
            if (audioRef.current !== undefined) {
                if (genreClickCount > prevCount) {
                    audioRef.current.pause()
                }

                if (isPlaying) {
                    currentPlayer.current.play()

                    startTimer()
                } else {
                    audioRef.current.pause()
                }
            }
        } else {
            if (audioRef.current) {
                if (audioRef.current.src !== currentSong && currentSong) {
                    audioRef.current.src = currentSong
                }

                if (playing && isPlaying) {
                    audioRef.current.addEventListener("loadedmetadata", () => {
                        //audioRef.current.play()
                    })
                    startTimer()
                } else {
                    audioRef.current.pause()
                }
            }
        }
    }, [isPlaying, location.pathname, playing, genreClickCount])

    useEffect(() => {
        if (audioRef.current !== undefined)
            if (audioR && audioR.current) audioRef.current = audioR.current
            else if (audioR && !audioR.current) audioRef = audioR
            else if (!audioR) audioRef.current.src = currentSong
    }, [currentSong, audioR])

    useEffect(() => {
        if (audioRef && audioRef.current) {
            audioRef.current.volume = volume
            // Destructure for conciseness
            setDuration(audioRef.current.duration)

            setCurrentPercent(
                duration ? `${(trackProgress / duration) * 100}%` : "0%",
            )
            setTrackStyle(`
            -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercent}, #fff), color-stop(${currentPercent}, #777))`)

            if (!audioRef.current.paused)
                if (audioR && audioR.current)
                    //audioRef.current.pause()
                    audioRef.current = audioR.current
                else if (audioR && !audioR.current) audioRef.current = audioR

            setTrackProgress(audioRef.current.currentTime)
        }
    }, [trackProgress, audioR, currentSong])

    useEffect(() => {
        if (audioRef && audioRef.current) {
            audioRef.current.volume = volume
            // Destructure for conciseness
            setDuration(audioRef.current.duration)

            setCurrentPercent(
                duration ? `${(trackProgress / duration) * 100}%` : "0%",
            )
            setTrackStyle(`
            -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercent}, #fff), color-stop(${currentPercent}, #777))`)

            if (!audioRef.current.paused)
                if (audioR && audioR.current)
                    //audioRef.current.pause()
                    audioRef.current = audioR.current
                else if (audioR && !audioR.current) audioRef.current = audioR

            setTrackProgress(audioRef.current.currentTime)
            if (isReady.current) {
                audioRef.current.play()
                setIsPlaying(true)
                // isReady.current = false
            } else {
                // Set the isReady ref as true for the next pass
                isReady.current = true
            }
        }
    }, [
        trackIndex,
        oneSongClick,
        currentSong,
        location.pathname,
        audioR,
        trackProgress,
    ])

    useEffect(() => {
        // Pause and clean up on unmount
        return () => {
            audioRef.current.pause()
            clearInterval(intervalRef.current)
        }
    }, [])

    let h,
        m,
        s,
        hDisplay,
        mDisplay,
        sDisplay,
        ch,
        cm,
        cs,
        chDisplay,
        cmDisplay,
        csDisplay
    if (audioRef.current) {
        if (audioRef.current.currentTime === undefined)
            audioRef.current.currentTime = 0

        ch = Math.floor(audioRef.current.currentTime / 3600)
        cm = Math.floor((audioRef.current.currentTime % 3600) / 60)
        cs = Math.floor((audioRef.current.currentTime % 3600) % 60)

        chDisplay = ch > 0 ? ch + (ch === 1 ? ":" : ":") : ""
        cmDisplay = cm > 0 ? cm + (cm === 1 ? ":" : ":") : "0:"
        csDisplay = cs < 10 ? "0" + cs : cs

        h = Math.floor(audioRef.current.duration / 3600)
        m = Math.floor((audioRef.current.duration % 3600) / 60)
        s = Math.floor((audioRef.current.duration % 3600) % 60)

        hDisplay = h > 0 ? h + (h === 1 ? ":" : ":") : ""
        mDisplay = m > 0 ? m + (m === 1 ? ":" : ":") : "0:"
        sDisplay = s > 0 ? s + (s === 1 ? "" : "") : "00"
    }

    const displayTime = `${chDisplay}${cmDisplay}${csDisplay}`

    const endTime = `${hDisplay}${mDisplay}${sDisplay}`

    return (
        <div className="footer-audio-player">
            <div className="footer-track-info">
                <FooterAudioControls
                    isPlaying={isPlaying}
                    onPrevClick={toPrevTrack}
                    onNextClick={toNextTrack}
                    onPlayPauseClick={setIsPlaying}
                />
                <div className="musicianTrack">
                    {title.length > 6 ? (
                        <Marquee gradient={false} delay={2}>
                            <h2 className="footer-title">
                                {title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </h2>
                        </Marquee>
                    ) : (
                        <h2 className="footer-title">{title}</h2>
                    )}

                    {title.length > 6 ? (
                        <Marquee gradient={false} delay={2}>
                            <h2 className="footer-artist">
                                {artist}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </h2>
                        </Marquee>
                    ) : (
                        <h2 className="footer-artist">{artist}</h2>
                    )}

                    {/* <h3 className="footer-artist">{artist}</h3> */}
                </div>
                <div id="startFooterTimer">{displayTime}</div>
                <input
                    type="range"
                    value={trackProgress}
                    max={duration ? duration : `${duration}`}
                    // time={currentTime}
                    className="footer-progress"
                    id="footerTimerBar"
                    onChange={(e) => onScrub(e.target.value)}
                    onMouseUp={onScrubEnd}
                    onKeyUp={onScrubEnd}
                    style={{ background: trackStyle }}
                />
                <div
                   id="endFooterTimer"
                >
                    {endTime}
                </div>
            </div>
            {/* Volume slider */}
            <div className="volContainer">
                <Stack
                    spacing={2}
                    direction="row"
                    sx={{ mb: 1, px: 1 }}
                    alignItems="center"
                >
                    <VolumeDownRounded />
                    <Slider
                        onChange={onVolumeChange}
                        aria-label="Volume"
                        defaultValue={0.25}
                        max={1}
                        min={0.1}
                        step={0.01}
                        sx={{
                            // color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                            "& .MuiSlider-track": {
                                border: "none",
                            },
                            "& .MuiSlider-thumb": {
                                width: 24,
                                height: 24,
                                backgroundColor: "#fff",
                                "&:before": {
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                                },
                                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                                    boxShadow: "none",
                                },
                            },
                        }}
                    />
                    <VolumeUpRounded />
                </Stack>
            </div>
        </div>
    )
}

export default AudioPlayer
