import React from "react"
import { ReactComponent as Play } from "./assets/play.svg"
import { ReactComponent as Pause } from "./assets/pause.svg"
import { ReactComponent as Next } from "./assets/next.svg"
import { ReactComponent as Prev } from "./assets/prev.svg"

const DashAudioControlOne = ({
    isPlaying,
    onPlayPauseClick,
    onPrevClick,
    onNextClick,
    genreBool,
    getOne,
    isOnePlaying,
    setCurrent,
    setChanged,
    getSongInfo,
    songInfo,
}) => (
    <div className="audio-ctrls">
        <button
            type="button"
            className="previous"
            aria-label="Previous"
            onClick={onPrevClick}
        >
            <Prev />
        </button>
        {isPlaying && isOnePlaying && !genreBool ? (
            <button
                type="button"
                className="pause-btn"
                onClick={() => {
                    setCurrent(document.getElementById("one"))
                    onPlayPauseClick(false)
                    getOne(false)
                }}
                aria-label="Pause"
            >
                <Pause />
            </button>
        ) : (
            <button
                type="button"
                className="play-btn"
                onClick={() => {
                    getSongInfo(songInfo)
                    setChanged(true)
                    setCurrent(document.getElementById("one"))
                    onPlayPauseClick(true)
                    getOne(true)
                }}
                aria-label="Play"
            >
                <Play />
            </button>
        )}
        <button
            type="button"
            className="next-btn"
            aria-label="Next"
            onClick={onNextClick}
        >
            <Next />
        </button>
    </div>
)

export default DashAudioControlOne
