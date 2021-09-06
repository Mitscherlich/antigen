import $ from 'jquery';
import { axiosJson } from './axios';

const draw = (ctx, data) => {
  for (let i = 0; i < 140; i++) {
    for (let j = 0; j < 140; j++) {
      const n = 4 * (i * 140 + j);
      ctx.fillStyle = 'rgb(' + [data[n + 0], data[n + 1], data[n + 2]].join(',') + ')';
      ctx.fillRect(j * 1, i * 1, 1, 1);
    }
  }
};

export default class App {
  constructor(selector) {
    this.selector = selector;
    this.dom = $(this.selector);
    this.dragbox = this.dom.find('#dragbox');
    this.upload = this.dragbox.find('input');
    this.progressbar = this.dom.find('.progress-bar');
    this.input = this.dom.find('#input');
    this.output = this.dom.find('#output');
    this.result = this.dom.find('#result');
    this.btnModal = this.dom.find('#btnModal');
    this.btnClear = this.dom.find('#btnClear');
    this.btnRefresh = this.dom.find('#btnRefresh');
    this.modelACS = $('#modalACS');
    this.qrcode = this.modelACS.find('#qrcode');
  }

  init() {
    this.bindEvents();
    this.initResultTable();
  }

  bindEvents() {
    this.dragbox.on('dragenter', this.handleDragIn.bind(this));
    this.dragbox.on('dragleave', this.handleDragOut.bind(this));
    this.upload.on('change', this.handleDrop.bind(this));
    this.btnClear.on('click', this.handleClear.bind(this));
    this.btnRefresh.on('click', this.handleRefresh.bind(this));
    this.modelACS.on('shown.bs.modal', this.handleModelShown.bind(this));
    this.modelACS.on('hidden.bs.modal', this.handleModelHidden.bind(this));
  }

  handleDragIn() {
    this.dragbox.addClass('hover');
  }

  handleDragOut() {
    this.dragbox.removeClass('hover');
  }

  handleDrop() {
    const [file] = this.upload[0].files;
    const dragzone = this.dragbox;
    const reader = new FileReader();

    dragzone
      .removeClass('hover')
      .addClass('dropped')
      .find('img')
      .remove();

    reader.readAsDataURL(file);
    reader.onload = ({ target: { result } }) => {
      const thumbnail = dragzone.find('.thumbnail');
      thumbnail.html(
        $('<img />')
          .attr('src', result)
          .fadeIn()
      );
      this.drawInput(result);
    };
  }

  async handleModelShown() {
    const { data: gates } = await axiosJson.get('/gates');
    this.qrcode.removeClass('loading');
    if (gates.length < 1) {
      this.qrcode.html(`
<div class="alert alert-danger text-center" role="alert">
  暂无可用门锁
</div>
      `);
    } else {
      if (gates.length > 1) {
        const that = this;
        this.qrcode.html(
          $(`
<select class="form-control" id="selectGate">
  ${gates.map(({ id }) => `<option>${id}</option>`).join('\n')}
</select>
          `).on('change', function() {
            const id = $(this).val();
            that.renderQRCode(id);
          })
        );
      }
      const [{ id }] = gates;
      this.renderQRCode(id);
    }
  }

  handleModelHidden() {
    this.qrcode.addClass('loading').html('');
  }

  handleClear() {
    this.progressbar.width(0);
    this.upload.val('');
    this.dragbox
      .removeClass('hover')
      .removeClass('dropped')
      .find('.thumbnail')
      .html('<i class="iconfont icon-upload"></i>')
      .find('img')
      .remove();
    const inputCtx = this.input[0].getContext('2d');
    inputCtx.clearRect(0, 0, 140, 140);
    const outputCtx = this.output[0].getContext('2d');
    outputCtx.clearRect(0, 0, 140, 140);
    this.result.children('tr').each(function() {
      $(this).removeClass('success');
    });
  }

  handleRefresh() {
    this.initResultTable();
  }

  async fetchUsers() {
    const { data } = await axiosJson.get('/users');
    return data;
  }

  async initResultTable() {
    this.result.html('<td class="loading" colspan="4"></td>');
    this.users = await this.fetchUsers();
    if (this.users && this.users.length) {
      const initRes = new Array(this.users.length).fill(0);
      this.users.sort((a, b) => a.index - b.index);
      this.result.html(this.renderTable(initRes));
    } else {
      this.result.html(`
<td colspan="4">
  <div class="alert alert-warning" role="alert">
    暂无注册用户！
  </div>
</td>
      `);
    }
  }

  renderTable(similars) {
    let trs;
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      const similar = similars[i];
      trs += `
<tr>
  <td>${user.index}</td>
  <td><img src="data:image/png;base64,${user.image}" /></td>
  <td>${user.name}</td>
  <td>${similar}</td>
</tr>
      `;
    }
    const maxIndex = similars.indexOf(Math.max(...similars));
    this.result.html(trs);
    if (maxIndex > -1 && similars[maxIndex] > 0.5) {
      this.result
        .children('tr')
        .eq(maxIndex)
        .addClass('success');
    }
  }

  async renderQRCode(id) {
    const { data: base64 } = await axiosJson.get(`/qrcode?content=${id}`);
    if (this.qrcode.find('img').length > 0) {
      this.qrcode.find('img').attr('src', base64);
    } else {
      this.qrcode.append(
        $('<img />')
          .attr('src', base64)
          .fadeIn()
      );
    }
  }

  drawInput(image) {
    const inputCtx = this.input[0].getContext('2d');
    const outputCtx = this.output[0].getContext('2d');
    const raw = new Image();
    raw.onload = async () => {
      const small = document.createElement('canvas').getContext('2d');
      small.drawImage(raw, 0, 0, raw.width, raw.height, 0, 0, 140, 140);
      const { data: thumbnail } = small.getImageData(0, 0, 140, 140);
      draw(inputCtx, thumbnail);
      const {
        data: { faces, similars }
      } = await axiosJson.post('/api/face/identify', { image: image.split(',')[1] });
      this.progressbar.width('100%');
      draw(outputCtx, thumbnail);
      for (const { x, y, width, height, points } of faces) {
        const xScale = 140 / raw.width;
        const yScale = 140 / raw.height;
        outputCtx.lineWidth = 2;
        outputCtx.strokeStyle = 'blue';
        outputCtx.strokeRect(x * xScale, y * yScale, width * xScale, height * yScale);
        for (const { x: px, y: py } of points) {
          outputCtx.fillStyle = 'red';
          outputCtx.fillRect(px * xScale - 1, py * yScale - 1, 2, 2);
        }
      }
      if (!similars || similars.length < 1) {
        return;
      }
      this.renderTable(similars);
    };
    raw.src = image;
  }
}
