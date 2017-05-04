import React, { Component, PropTypes, Children } from 'react'
import { render } from 'react-dom'

import { ValidForm, ValidInput } from './ValidForm';

class App extends Component {
  render() {
    return (
       <div className="container">
        <div className="user-header">
          <i className="t-font t-font-setting setting"></i>
          <div className="avatar">
            <div className="img">
              <i className="t-font t-font-user user percenter"></i>
            </div>
          </div>
          <div className="tags">
            <div className="tag">冰与火之歌</div>
            <div className="tag">黑暗之魂</div>
            <div className="tag">Ed Sheeran</div>
            <div className="tag">Just Code</div>
          </div>
          <div className="name">晓爽</div>
          <div className="add">添加标签</div>
        </div>
        <div className="user-body">
          <div className="body-top">
            <input type="text" placeholder="搜索关键字"/>
            <div className="add">添加聊天室</div>
          </div>
        </div>
      </div>
      
      <div className="ng-hide">
        <div className="header">
          <div className="img">
            <i className="t-font t-font-setting user percenter"></i>
          </div>
          <input type="text" placeholder="搜索..."/>
        </div>
        <div className="people">
          <div className="person" data-after="朋友">
            <i className="t-font t-font-user user percenter"></i>
          </div>
          <div className="person" data-after="朋友">
            <i className="t-font t-font-user user percenter"></i>
          </div>
          <div className="person" data-after="朋友">
            <i className="t-font t-font-user user percenter"></i>
          </div>
          <div className="person" data-after="朋友">
            <i className="t-font t-font-user user percenter"></i>
          </div>
          <div className="person" data-after="朋友">
            <i className="t-font t-font-user user percenter"></i>
          </div>
          <div className="person" data-after="朋友">
            <i className="t-font t-font-user user percenter"></i>
          </div>
          <div className="person" data-after="朋友">
            <i className="t-font t-font-user user percenter"></i>
          </div>
          <div className="person" data-after="朋友">
            <i className="t-font t-font-user user percenter"></i>
          </div>
          <div className="person" data-after="朋友">
            <i className="t-font t-font-user user percenter"></i>
          </div>
        </div>
        <div className="rooms">
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
          <div className="room">
            <div className="img">
              <i className="t-font t-font-image user percenter"></i>
            </div>
            <div className="title">标题</div>
            <div className="tags">
              <div className="tag">冰与火之歌</div>
              <div className="tag">黑暗之魂</div>
              <div className="tag">Ed Sheeran</div>
              <div className="tag">Just Code</div>
            </div>
          </div>
        </div>
        <div className="side">
          <div className="avatar">
            <div className="img">
              <i className="t-font t-font-user user percenter"></i>
            </div>
          </div>
          <div className="name">晓爽</div>
          <div className="option">护眼模式</div>
          <div className="option checked">创建房间可见</div>
          <div className="option">收藏房间可见</div>
          <div className="option">个人空间作为首页</div>
          <div className="go-rooms href">查看个人空间</div>
          <div className="footer href">关于我们,晓聊</div>
          <div className="bg"></div>
        </div>
      </div>
    );
  }
}

render(
  <App />,
  document.getElementById('app')
)
