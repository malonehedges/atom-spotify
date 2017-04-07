'use babel'

import { Record } from 'immutable'
import { PlayerState } from 'spotify-application-client'

const DEFAULTS = {
  songName: '',
  artistName: '',
  playerState: PlayerState.STOPPED,
  songPosition: 0,
  songDuration: 0,
  isShuffling: false,
  isRepeating: false,
  isSpotifyRunning: false,
}

export default class State extends Record(DEFAULTS) {}
