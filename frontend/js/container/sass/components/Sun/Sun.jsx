import React, { Component } from 'react';
import { logSpeech } from 'js/common';
import Iconfont from 'js/components/Iconfont';

class Sun extends Component {
	componentDidMount() {
		const list = [
			'Sun页面',
			{ type: 'desc', txt: 'box-shadow的使用 2.0' },
			'先说明下这个页面，设计不太好看还请谅解。页面上有类似星星的动画效果，外加一颗流星，下面的小人是图片背景。',
			'我们来继续那个问题，这个页面最少需要几个标签来实现。',
			{ type: 'desc', txt: '要不我做个庄，押上春晖下辈子的节操，感觉应该很有赚头。' },
			'line',
			'答案还是一个。实现的方法和上一个例子差不多，sass生成动画。 有什么需要问的还是直接看sass代码。'
		];

		logSpeech(list);
	}

  render() {
    return (
      <div className="page-home-sun-render" /> 
    );
  }
}

export default Sun;
