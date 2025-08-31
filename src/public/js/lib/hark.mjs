// original source code is taken from:
// https://github.com/SimpleWebRTC/hark
// copyright goes to &yet team
// edited by Muaz Khan for RTCMultiConnection.js


export default class Hark {
	static #AudioContext = window.webkitAudioContext || window.AudioContext;
	#events = new Map();
	#analyser;
	#sourceNode;
	#running = true;
	#speaking = false;
	#speakingHistory;

	constructor(stream, options = {}) {
		if (!Hark.#AudioContext) return this;

		const {
			smoothing = 0.1,
			interval = 50,
			threshold = -50,
			play = false,
			history = 10
		} = options;

		// Initialize speaking history
		this.#speakingHistory = new Array(history).fill(0);

		// Setup Audio Context (singleton pattern)
		if (!window.audioContext00) {
			window.audioContext00 = new Hark.#AudioContext();
		}

		this.#initializeAudioNodes(stream, smoothing, play, threshold);
		this.#startLooper(interval, threshold);
	}

	#initializeAudioNodes(stream, smoothing, play, threshold) {
		// Create and configure analyser
		this.#analyser = window.audioContext00.createAnalyser();
		this.#analyser.fftSize = 512;
		this.#analyser.smoothingTimeConstant = smoothing;

		// Create and configure source
		this.#sourceNode = window.audioContext00.createMediaStreamSource(stream);

		// Connect nodes
		this.#sourceNode.connect(this.#analyser);

		if (play) {
			const gainNode = window.audioContext00.createGain();
			gainNode.connect(window.audioContext00.destination);
			gainNode.gain.value = 0; // don't play for self
			this.#analyser.connect(window.audioContext00.destination);
		}
	}

	on(event, callback) {
		this.#events.set(event, callback);
	}

	emit(event, ...args) {
		const callback = this.#events.get(event);
		if (callback) callback(...args);
	}

	setThreshold(threshold) {
		this.threshold = threshold;
	}

	setInterval(interval) {
		this.interval = interval;
	}

	stop() {
		this.#running = false;
		this.emit('volume_change', -100, this.threshold);
		if (this.#speaking) {
			this.#speaking = false;
			this.emit('stopped_speaking');
		}
	}

	#startLooper(interval, threshold) {
		const fftBins = new Float32Array(this.#analyser.fftSize);

		const looper = () => {
			if (!this.#running) return;

			const currentVolume = this.#getMaxVolume(fftBins);
			this.emit('volume_change', currentVolume, threshold);

			this.#updateSpeakingState(currentVolume, threshold);

			setTimeout(() => looper(), interval);
		};

		looper();
	}

	#updateSpeakingState(currentVolume, threshold) {
		const history = this.#speakingHistory.reduce((sum, val) => sum + val, 0);

		if (currentVolume > threshold && !this.#speaking) {
			// Check recent history (last 3 entries)
			const recentHistory = this.#speakingHistory
				.slice(-3)
				.reduce((sum, val) => sum + val, 0);

			if (recentHistory >= 2) {
				this.#speaking = true;
				this.emit('speaking');
			}
		} else if (currentVolume < threshold && this.#speaking && history === 0) {
			this.#speaking = false;
			this.emit('stopped_speaking');
		}

		// Update speaking history
		this.#speakingHistory.shift();
		this.#speakingHistory.push(Number(currentVolume > threshold));
	}

	#getMaxVolume(fftBins) {
		this.#analyser.getFloatFrequencyData(fftBins);
		return Math.max(...fftBins.slice(4).filter(val => val < 0));
	}
}

// Export as module
// export default function hark(stream, options) {
// 	return new Hark(stream, options);
// }
