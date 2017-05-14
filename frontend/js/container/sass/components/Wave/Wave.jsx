import React, { Component } from 'react';
import { logSpeech } from 'js/common';

class Wave extends Component {

	componentDidMount() {
		const list = [
			'Loading页面',
			{ type: 'desc', txt: 'box-shadow的使用' },
			'本次分享主题是sass使用和svg滤镜，现在就开始了。',
			'先看示例, 这是一个简单的Loading页面，正中一句话来提示用户，下方有一个类似波纹的动画效果。看不清的话我把地址发到群里面，或者我把颜色挑明显一点。',
			{ type: 'desc', txt: '问一下大家是不是明白的内容了。' },
			'让我们思考一个问题，这个页面最少只需要用到几个标签来实现。',
			{ type: 'desc', txt: '等待大家回答完毕，或者听完歌了。' },
			'line',
			'其实只用到了1个标签。',
			{ type: 'desc', txt: '唉，早知道我就应该开个盘下个注，至少亏了几个肾。' },
			'首先说明一点，一个标签，除了input这个输入的表单之外，都可以个拥有before和after伪类，所以一般来说一个标签可以看作三个标签来使用。',
			'在这个示例里面，中间这句话显而易见就是before。难点在下面，这个波纹应该怎么做。有没有同学有些可能的想法，除了最福利和i云保的，乖乖坐好不要剧透。',
			'line',
			'答案是box-shadow，这个我们平时经常用到的属性。',
			{ type: 'desc', txt: '查看代码，了解box-shadow' },
			'box-shadow其实可以重复使用，就是一个标签可以有多个阴影。多个shadow的属性可以同时作用在一个元素上，来形成这个波纹效果。',
			'也许这个效果的重点就是box-shadow, 如果真的这样想,too young啊，兄弟们.',
			'box-shadow只是一个属性，一个静态的属性，可是我们的结果是一个动态效果，总不至于要计算所有的变化结果写到keyframes里面。',
			{ type: 'desc', txt: '语气变化。' },
			'答案是的，不过不是我们计算，是sass计算。让我们打开代码看一下。',
			{ type: 'desc', txt: '查看代码，了解sass' },
			{ type: 'desc', txt: '理科男偷笑。' },
			'这里sass所体现的功能有 function， for循环， array数组储存变量， 数字与百分比的转换。',
			'同志们有什么疑问吗，没有的话我们就看下一个示例了。',
			{ type: 'desc', txt: '大家还有什么问题吗。' },
		];

		logSpeech(list);
	}

  render() {
    return (
      <div className="page-home-wave-render" /> 
    );
  }
}

export default Wave;
