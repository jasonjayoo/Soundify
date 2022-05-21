import React, { Component, useState, useEffect, createRef, useRef } from "react"
import WaveSurfer from "wavesurfer.js"
import { BsFillPlayFill } from "react-icons/bs"
import { BsPauseFill } from "react-icons/bs"
import { PlayButton } from "./styles/Wavesurfer.styled"
import "../components/styles/Slider.css"

const formWaveSurferOptions = (ref) => ({
    container: ref,
    waveColor: "#eee",
    progressColor: "#ec994b",
    cursorColor: "#ec994b",
    barWidth: 5,
    barRadius: 3,
    responsive: true,
    height: 100,
    // If true, normalize by the maximum peak instead of 1.0.
    normalize: true,
    // Use the PeakCache to improve rendering speed of large waveforms.
    partialRender: true,
})

let duration,
    currentTime,
    hDisplay,
    mDisplay,
    sDisplay,
    chDisplay,
    cmDisplay,
    csDisplay,
    h,
    m,
    s,
    ch,
    cm,
    cs

export default function Waveform({ url }) {
    const waveformRef = useRef(null)
    const wavesurfer = useRef(null)
    const volumeSlider = useRef()
    const time = useRef()
    const [playing, setPlay] = useState(false)
    const [volume, setVolume] = useState(0.5)

    // create new WaveSurfer instance
    // On component mount and when url changes
    useEffect(() => {
        setPlay(false)

        const options = formWaveSurferOptions(waveformRef.current)
        wavesurfer.current = WaveSurfer.create(options)

        wavesurfer.current.load(url)

        wavesurfer.current.on("ready", function () {
            // https://wavesurfer-js.org/docs/methods.html
            // wavesurfer.current.play();
            // setPlay(true);

            // make sure object still available when file loaded
            if (wavesurfer.current) {
                wavesurfer.current.setVolume(volume)
                setVolume(volume)

                duration = wavesurfer.current.getDuration()
                h = Math.floor(duration / 3600)
                m = Math.floor((duration % 3600) / 60)
                s = Math.floor((duration % 3600) % 60)

                hDisplay = h > 0 ? h + (h == 1 ? "h, " : "h, ") : ""
                mDisplay = m > 0 ? m + (m == 1 ? "m, " : "m, ") : ""
                sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : ""

                time.current.innerHTML = ` 0s / ${hDisplay} ${mDisplay} ${sDisplay}`
            }
        })

        wavesurfer.current.on("audioprocess", function () {
            currentTime = wavesurfer.current.getCurrentTime()
            ch = Math.floor(currentTime / 3600)
            cm = Math.floor((currentTime % 3600) / 60)
            cs = Math.floor((wavesurfer.current.getCurrentTime() % 3600) % 60)

            chDisplay = ch > 0 ? ch + (ch == 1 ? "h, " : "h, ") : ""
            cmDisplay = cm > 0 ? cm + (cm == 1 ? "m, " : "m, ") : ""
            csDisplay = cs > 0 ? cs + (cs == 1 ? "s" : "s") : ""

            time.current.innerHTML = `${chDisplay} ${cmDisplay} ${csDisplay} / ${hDisplay} ${mDisplay} ${sDisplay}`
        })

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => wavesurfer.current.destroy()
    }, [url])

    const handlePlayPause = () => {
        setPlay(!playing)
        console.log(currentTime)
        wavesurfer.current.playPause()
    }

    const onVolumeChange = (e) => {
        const { target } = e
        const newVolume = +target.value

        if (newVolume) {
            setVolume(newVolume)
            wavesurfer.current.setVolume(newVolume || 1)
        }
    }

    return (
        <div style={{ width: "60%", display: "flex", margin: 10 }}>
            <div
                className="controls"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <PlayButton style={{ margin: 10 }} onClick={handlePlayPause}>
                    {!playing ? <BsFillPlayFill /> : <BsPauseFill />}
                </PlayButton>
                <input
                    ref={volumeSlider}
                    style={{
                        background: `linear-gradient(0deg, #ec994b ${(
                            volume * 100
                        ).toFixed(0)}%, rgb(214, 214, 214) ${(
                            volume * 100
                        ).toFixed(0)}%)`,
                    }}
                    type="range"
                    id="volume"
                    className="slider"
                    name="volume"
                    // waveSurfer recognize value of `0` same as `1`
                    //  so we need to set some zero-ish value for silence
                    min="0.01"
                    max="1"
                    step=".025"
                    onMouseMove={(event) => {
                        let color = `linear-gradient(0deg, #ec994b ${(
                            volume * 100
                        ).toFixed(0)}%, rgb(214, 214, 214) ${(
                            volume * 100
                        ).toFixed(0)}%)`
                        event.target.style.background = color
                    }}
                    orient="vertical"
                    onChange={onVolumeChange}
                    defaultValue={volume}
                />
                <p style={{ color: "white" }}>
                    Vol: <span>{(volume * 100).toFixed(0)}%</span>
                </p>
            </div>
            <div style={{ width: "100%" }}>
                <div
                    id="waveform"
                    style={{ width: "100%", marginTop: 100 }}
                    ref={waveformRef}
                />
                <p style={{ color: "white" }} ref={time}></p>
            </div>
        </div>
    )
}