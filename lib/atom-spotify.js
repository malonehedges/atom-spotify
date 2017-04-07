'use babel'

import {
  SpotifyApplicationClient,
  PlayerState,
} from 'spotify-application-client'

import State from './state'

import {
  formatTime,
} from './utils'

const PLAYING_ICON = '►'
const PAUSED_ICON = '▌▌'
const STOPPED_ICON = '■'

export default {

  activate(state) {
    this.ready = false

    // Create the element
    this.element = document.createElement('atom-spotify')
    this.element.style.display = 'none'

    // Start the loop
    this.intervalId = setInterval(this.poll.bind(this), 1000)
  },

  deactivate() {
    this.ready = false

    this.element.remove()
    this.element = null

    clearInterval(this.intervalId)
    this.intervalId = null
  },

  consumeStatusBar(statusBar) {
    // nom
    statusBar.addRightTile({
      item: this.element,
      priority: 50,
    })
    // Remove the display: 'none' property from the element
    this.element.style.display = null

    this.ready = true
  },

  poll() {
    if (!this.ready) {
      return
    }

    this.getState()
      .then((state) => {
        this.updateElement(state)
      })
  },

  updateElement(state) {
    if (state.isSpotifyRunning) {
      this.element.style.display = null
      this.element.innerHTML = this.getElementText(state)
    } else {
      this.element.style.display = 'none'
    }
  },

  getElementText(state) {
    let icon = ''
    switch (state.playerState) {
      case PlayerState.PLAYING:
        icon = PLAYING_ICON
        break

      case PlayerState.PAUSED:
        icon = PAUSED_ICON
        break

      case PlayerState.STOPPED:
        icon = STOPPED_ICON
        break

      default:
        break
    }

    const time = `${formatTime(state.songPosition)} / ${formatTime(state.songDuration)}`
    return `${icon} ${state.songName} · ${state.artistName} (${time})`
  },

  getState() {
    return SpotifyApplicationClient.isSpotifyRunning()
      .then((isRunning) => {
        if (isRunning) {
          return Promise.all([
            SpotifyApplicationClient.getPlayerDetails(),
            SpotifyApplicationClient.getTrackDetails(),
          ])
        } else {
          return Promise.all([])
        }
      })
      .then(([stateDetails, trackDetails]) => {
        if (!stateDetails || !trackDetails) {
          return new State({
            isSpotifyRunning: false,
          })
        } else {
          return new State({
            songName: trackDetails.name,
            artistName: trackDetails.artistName,
            playerState: stateDetails.state,
            songPosition: Math.ceil(stateDetails.positionInSeconds),
            songDuration: Math.ceil(trackDetails.durationInMilliseconds / 1000),
            isShuffling: stateDetails.isShuffling,
            isRepeating: stateDetails.isRepeating,
            isSpotifyRunning: stateDetails.isSpotifyRunning,
          })
        }
      })
      .catch((error) => {
        // We made it here, so let's give the default null state
        return new State({
          isSpotifyRunning: false,
        })
      })
  },
}
