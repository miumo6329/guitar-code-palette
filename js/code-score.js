"use strict";

import { CodeIcon } from "./code-icon.js";
import { GuitarSound } from "./guitar-sound.js"

const e = React.createElement;

const PALETTE_COUNT = 32;

export class CodeScore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: Array(PALETTE_COUNT).fill({ code_name: null, position: null }),
      bpm: 120
    }
    this.getSelectedCodePalette = this.props.getSelectedCodePalette.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.setBpm = this.setBpm.bind(this);

    this.guitar_sound = new GuitarSound();
  }

  drawCode(target_num) {
    // CodePaletteクラスから選択中のパレットのコードを取得
    let selected_code_palette = this.getSelectedCodePalette();
    let update_score = [...this.state.score];
    update_score[target_num] = selected_code_palette;
    this.setState({ score: update_score });
  }

  play() {
    this.guitar_sound.play(this.state.score, this.state.bpm);
  }

  stop() {
    this.guitar_sound.stop();
  }

  setBpm(event) {
    this.setState({ bpm: event.target.value });
  }

  render() {
    let scores = [];
    for (let i = 0; i < PALETTE_COUNT; i++) {
      scores.push(
        e("div", { key: "score-code-" + String(i), className: "score-code", onClick: () => this.drawCode(i) }, [
          e(CodeIcon, { key: "code-" + String(i), codeName: this.state.score[i]["code_name"], position: this.state.score[i]["position"], })
        ]),
      );
    }

    return [
      "Code Score",
      e("div", { key: "play", className: "btn btn--green btn--cubic", onClick: this.play }, ["▶"]),
      e("div", { key: "stop", className: "btn btn--green btn--cubic", onClick: this.stop }, ["■"]),
      "BPM: ",
      e("input", { key: "bpm-input", value: this.state.bpm, onChange: this.setBpm }),
      e("div", { key: "score-line", className: "score-line" }, scores),
    ];
  }
}