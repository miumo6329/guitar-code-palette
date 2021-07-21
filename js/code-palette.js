"use strict";

const e = React.createElement;

const MAX_PALETTE = 16;

// 配列比較用関数
const equalArray = function (a1, a2) {
  var i = a1.length;
  if (i != a2.length) return false;

  while (i--) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
};

class Code extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.position == null) return "";

    let code_name = this.props.codeName
    if (code_name == null) {
      code_name = "Unknown"
    }
    return [code_name, e("br", { key: "br" }), this.props.position];
  }
}

export class CodePalette extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_palette: 0,
      code_palette: Array(MAX_PALETTE).fill({ code_name: null, position: null }),
    };
    this.selectPalette = this.selectPalette.bind(this);
  }

  selectPalette(num) {
    this.setState({ selected_palette: num });
  }

  renderPalettes() {
    let result = [];
    for (let i = 0; i < MAX_PALETTE; i++) {
      let class_name = "palette";
      if (i == this.state.selected_palette) {
        class_name = "selected-palette";
      }
      result.push(
        e("div", { key: "palette-" + String(i), className: class_name, onClick: () => this.selectPalette(i) }, [
          e(Code, { key: "palette-code-" + String(i), codeName: this.state.code_palette[i]["code_name"], position: this.state.code_palette[i]["position"] })
        ])
      );
    }
    return result;
  }

  registerPalette(code_name, position) {
    // 全弦押弦なしの場合、処理終了
    if (equalArray(position, [-1, -1, -1, -1, -1, -1])) return;

    // 既に同じコードがパレットに登録されている場合、アラート表示
    for (let i = 0; i < MAX_PALETTE; i++) {
      if (this.state.code_palette[i]["position"] == null) continue;
      if (equalArray(position, this.state.code_palette[i]["position"])) {
        alert("パレット" + String(i + 1) + "に同じコードが登録されています。\n" +
          "コード名：" + this.state.code_palette[i]["code_name"]);
        return;
      }
    }

    // 1弦でも押弦がある場合、パレット登録
    // パレット0から順番に参照し、空いているパレットに登録する
    let new_code_palette = [...this.state.code_palette];
    let count;
    for (count = 0; count < MAX_PALETTE; count++) {
      if ((this.state.code_palette[count]["code_name"] == null) && (this.state.code_palette[count]["position"] == null)) {
        new_code_palette[count] = { code_name: code_name, position: position };
        break;
      }
    }

    // 全パレット登録済みだった場合、選択中パレットに上書きするかダイアログを表示
    if (count == MAX_PALETTE) {
      let sel_num = this.state.selected_palette;
      if (confirm("パレットに空きがありません。\n現在選択中のパレットに上書きしますか？\n選択中パレット：" + String(sel_num + 1) + "　" + String(this.state.code_palette[sel_num]["code_name"]))) {
        new_code_palette[sel_num] = { code_name: code_name, position: position };
      }
    }

    this.setState({ code_palette: new_code_palette });
  }

  render() {
    return [
      e("div", { key: "code-palette" }, ["Code Palette"]),
      e("div", { key: "palette-wrapper", className: "wrapper-flex" }, this.renderPalettes()),
    ];
  }
}