import React from 'react'

class Page extends React.Component{
	bg(url) {
		if(!url) { return {} }
		return {
			backgroundImage: `url(${url}?imageView/2/w/640)`
		}
	}


	list(num = 10) {
		let res = [];
		for(let a = 0; a < num; a++ ) {
			res.push({})
		}

		return res
	}

	render(){
		const { 
			bg = 'http://source.cloudin9.com/test/bg.jpg', 
			titleBg = 'http://source.cloudin9.com/test/title.png' 
		} = this.props;

		const list = this.list(10)

		return (
			<div className="body" style={this.bg(bg)}>
				<div className="circle">
					<div className="item-list" data-num={list.length}>
					  {list.map((item, index) => (
					  	<div className="item" key={index}>
								<div className="item-content"></div>
							</div>)
						)}
					</div>
				</div>
			</div>
		)
	}
}

export default Page