import React, { Component } from 'react';
import classnames from 'classnames';

import SvgFilter from './filter_inline.svg';

const data = [
	{ name: '灰度', type: 'grayscale' },
	{ name: '褐色', type: 'sepia' },
	{ name: '饱和度', type: 'saturate' },
	{ name: '色相旋转', type: 'hue-rotate' },
	{ name: '反色', type: 'invert' },
	{ name: '透明度', type: 'opacity' },
	{ name: '亮度', type: 'brightness' },
	{ name: '对比度', type: 'contrast' },
	{ name: '模糊', type: 'blur' },
	{ name: '阴影', type: 'drop-shadow' },
];

class Filter extends Component {
	render() {
		const list = data.map((item, i) => {
			const cls = classnames({
				imgs: true,
				[item.type]: true,
			});

			return (
				<div className={cls} key={i}>
					<div className="img" data-before={item.name}></div>
					<div className="img" data-before={'css'}></div>
					<div className="img" data-before={'svg'}></div>
				</div>
			);
		});
		return (
			<div className="page-svg-filter-render">
				<SvgFilter className="ng-hide" />
				{ list }
			</div>
		);
	}
}

export default Filter;