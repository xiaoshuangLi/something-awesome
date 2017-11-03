import Raven from 'js/components/Raven';

import { setBuffersAndAttributes, createBufferInfoFromArrays } from '../common/webgl';

class Soul {
  update(data = {}) {
    const { normals = [], positions = [], colors = [], indices = [] } = data;

    this.data = data;

    this.colors = colors;
    this.normals = normals;
    this.positions = positions;
    this.indices = indices;

    this.calc();
  }

  render(gl, programInfo, last) {
    this.bufferInfo = this.bufferInfo || createBufferInfoFromArrays(gl, {
      position: this.positions,
      color: this.colors,
      indices: this.indices,
      normal: this.normals,
    });

    if (last !== this) {
      setBuffersAndAttributes(gl, programInfo, this.bufferInfo);
    }

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}

export default Soul;
