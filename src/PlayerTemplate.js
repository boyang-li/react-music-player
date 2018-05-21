import React from "react";
import { render } from "react-dom";
import ReactPlayer from 'react-player'

/*
The goal is to create an audio player, similar to what you'd find at the bottom of the Spotify app.
All our media files are accessible via URLs, as you can see below in `this.tracks`. We're using a
library called react-player (https://www.npmjs.com/package/react-player) for the actual streaming
logic. Our MediaPlayer component encapsulates a ReactPlayer component.

The Player component should implement the following functionality (in order of priority):
1. It should have a play/pause button. Clicking on the button should play/pause the song
   accordingly.
2. It should display the track name, artist name, and artwork for the given track.
3. It should have next/previous buttons for navigating to the next/previous track in `this.tracks`.
4. Style it! The player should always appear at the bottom of the page, and should take up the full
   width of the screen.
5. A seeker for the song. It should grpahically show the amount of the song that has been played
   relative to the total length of the song. Look into progressInterval and onProgress in the
   ReactPlayer library.

Notes:
- Assume for now that we will always have a harcoded playlist in `this.tracks`.
- Feel free to add additional libraries if necessary.
- Prioritize a clean implementation.
- Launch localhost:3000 in the browser to view the result.
*/
class Player extends React.Component {
  constructor(props) {
    super(props);
    // This is the 'playlist' of tracks that we're playing/pausing, navigating through, etc.
    this.tracks = [
      {
        id: 1,
        trackName: "The Pretender",
        artistName: "Foo Fighters",
        artworkUrl: "https://images.sk-static.com/images/media/profile_images/artists/29315/huge_avatar",
        mediaUrl: "https://p.scdn.co/mp3-preview/6aba2f4e671ffe07fd60807ca5fef82d48146d4c?cid=1cef747d7bdf4c52ac981490515bda71",
        durationMilliseconds: 30000 // This track is 30 seconds long (30,000 milliseconds).
      },
      {
        id: 2,
        artistName: "Arctic Monkeys",
        trackName: "Do I Wanna Know?",
        artworkUrl: "https://cps-static.rovicorp.com/3/JPG_500/MI0003/626/MI0003626958.jpg?partner=allrovi.com",
        mediaUrl: "https://p.scdn.co/mp3-preview/9ec5fce4b39656754da750499597fcc1d2cc82e5?cid=1cef747d7bdf4c52ac981490515bda71",
        durationMilliseconds: 30000
      },
    ];

    this.launchClock()
    this.state = {
      playing: true,
      trackIdx: 0,
      currentTime: (new Date().toLocaleString())
    }
  }

  handlePlay = (e) => {
    console.log(this, e.target)
    this.setState({ playing: !this.state.playing })
  }

  handleNext = (e) => {
    console.log(this, e.target)
    var currTrackIdx = this.state.trackIdx
    if (currTrackIdx < (this.tracks.length - 1)) {
      this.setState({ trackIdx: currTrackIdx + 1 })
    } else {
      this.setState({ trackIdx: 0 })
    }
  }

  handlePrev = (e) => {
    console.log(this, e.target)
    var currTrackIdx = this.state.trackIdx
    if (currTrackIdx > 0) {
      this.setState({ trackIdx: currTrackIdx - 1 })
    } else {
      this.setState({ trackIdx: (this.tracks.length - 1) })
    }
  }

  launchClock() {
    setInterval(() => {
      // console.log('Updating time...')
      this.setState({ currentTime: (new Date()).toLocaleString() })
    }, 1000)
  }

  render() {
    let isPlaying = this.state.playing
    return (
      <div>
        <h1 className="pt-text" >{this.tracks[this.state.trackIdx].trackName}</h1>
        <h3 className="pt-text" >{this.tracks[this.state.trackIdx].artistName}</h3>
        <div className="center">
          <img
            src={this.tracks[this.state.trackIdx].artworkUrl}
            alt={this.tracks[this.state.trackIdx].trackName}
          />
          <MediaPlayer playing={this.state.playing} track={this.tracks[this.state.trackIdx]} />
        </div>
        <div className="controls">
          <i id="prev" className="fa fa-fw fa-fast-backward" onClick={this.handlePrev}></i>
          <i id={(isPlaying)?'pause':'play'} onClick={this.handlePlay}
            className={(isPlaying)?'fa fa-fw fa-pause':'fa fa-fw fa-play'}>
          </i>
          <i id="next" className="fa fa-fw fa-fast-forward" onClick={this.handleNext}></i>
        </div>
        <span className="pt-footer">Current date and time is {this.state.currentTime}.</span>
      </div>
    );
  }
}

/*
Library documentation: https://www.npmjs.com/package/react-player
*/
class MediaPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      played: 0,
      playedSeconds: 0,
      loadedSeconds: 0
    }
  }

  onProgress = state => {
    // console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  }
  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }
  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }
  ref = player => {
    this.player = player
  }
  render() {
    return (
      <div>
        <ReactPlayer
          ref={this.ref}
          playing={this.props.playing}
          height='100%'
          width='100%'
          config={{ file: { forceAudio: true } }}
          url={this.props.track.mediaUrl}
          onProgress={this.onProgress}
          onSeek={e => console.log('onSeek', e)}
        />
        <div className="seeker">
          <span>{Math.floor(this.state.playedSeconds)}s</span>
          <input
            type='range' min={0} max={1} step='any'
            value={this.state.played}
            onMouseDown={this.onSeekMouseDown}
            onChange={this.onSeekChange}
            onMouseUp={this.onSeekMouseUp}
          />
          <span>{Math.floor(this.state.loadedSeconds)}s</span>
        </div>
      </div>
    )
  }
}

export default Player;