# React、Webpack项目框架搭建文档

## 环境

* Windows 10家庭中文版，64位操作系统，基于x86处理器
* Node
    * 中文网：[http://nodejs.cn/](http://nodejs.cn/)
    * 汉化版官网：[https://nodejs.org/zh-cn/](https://nodejs.org/zh-cn/)
    * 官网：[https://nodejs.org/en/](https://nodejs.org/en/)
    * 下载地址：[https://nodejs.org/zh-cn/download/](https://nodejs.org/zh-cn/download/)

## 工具

* yeoman：[http://yeoman.io/](http://yeoman.io/)
* generator-react-webpack：[https://github.com/react-webpack-generators/generator-react-webpack](https://github.com/react-webpack-generators/generator-react-webpack)
* Windows PowerShell

## 步骤

### 一、安装Node

* 官网下载node安装包(当前版本**node-v6.11.0-x64.msi**)
* 双击安装
* 在Windows PowerShell中输入`node -v`，显示`v6.11.0`证明安装成功
* 在Windows PowerShell中输入`npm -v`，显示`3.10.10`证明安装成功(安装node时自动安装)

### 二、安装脚手架(yeoman)及生成器(generator-react-webpack)

* 在Windows PowerShell中输入`npm i yo -g`
    * npm安装一般会慢，还会失败，可以通过一些方法来加速安装
        * `npm config set registry https://registry.npm.taobao.org -g`
        * `npm i yo -g --registry=https://registry.npm.taobao.org`
        * `npm install -g cnpm --registry=https://registry.npm.taobao.org`再`cnpm i yo -g`

* 在Windows PowerShell中输入`npm i generator-react-webpack -g`
    * 加速方法同上

### 三、生成项目

* 创建项目目录
    * 可以手动创建一个空目录，也可以在Windows PowerShell中输入命令`mkdir projectDirName`来创建空目录
* 生成项目
    * 进入第一步生成的空目录
    * 在Windows PowerShell中输入命令`yo react-webpack`
    * 在生成项目过程中会在安装`phantomjs-prebuilt`时失败（npm过慢；淘宝镜像没有库），所以可能要手动使用cnpm安装：`cnpm i phantomjs-prebuilt`
* 运行项目
    * 在Windows PowerShell中输入命令`npm start`，即可启动项目在`http://localhost:8000`即可访问页面

### 四、手动折腾

* 在使用脚手架之前，尝试手动搭建框架，因为webpack的配置在windows和Mac下有些差别(文件路径中斜杠和反斜杠)，最后没能手动搭建成功
* 在涉及到路径时会用到`path.join(__dirname, 'dirName/file')`
* 在生成项目后，根据项目需求对生成的项目做些更改
* 测试相关目录暂时保留，但并不去维护；后期需要加入自动化测试时，再去修改配置


## 项目目录结构

    │  .babelrc                                // babel配置文件，编辑es6
    │  .editorconfig                           // 代码格式规范配置文件
    │  .eslintrc                               // eslint配置文件，代码质量检测
    │  .gitignore                              // git库中要忽略的文件
    │  .yo-rc.json                             // yeoman配置文件
    │  karma.conf.js                           // karma配置文件
    │  package.json                            // npm安装包配置文件
    |  README.md                               // guide
    │  server.js                               // 项目启动文件
    │  webpack.config.js                       // webpack配置文件
    │
    ├─cfg                                      // 项目配置文件
    │      base.js                             // 基本配置
    │      defaults.js                         // 默认配置
    │      dev.js                              // 开发配置
    │      dist.js                             // 构建配置
    │      test.js                             // 测试配置
    │
    ├─node_modules                             // npm包安装目录
    ├─src                                      // 主要编码目录
    │  │  index.html                           // 页面入口文件
    │  │  index.js                             // 入口文件
    │  │  router.js                            // 路由配置文件   
    │  │
    │  ├─actions                               // actions，数据获取
    │  │      index.js                         // actions主文件
    │  │      main.js                          // main组件中的action(数据模型抽象为准）
    │  │
    │  ├─components                            // 组件目录
    │  │  └─Main                               // Main组件(一般对应一个页面)
    │  │          index.css                    // 样式文件
    │  │          index.js                     // js文件
    │  │
    │  ├─config                                // 配置文件
    │  │      base.js
    │  │      dev.js                           // 开发配置
    │  │      dist.js                          // 构建配置
    │  │      test.js                          // 测试配置
    │  │
    │  ├─images                                // 图片资源目录
    │  ├─reducers                              // reducers目录，可以视为抽象数据模型(M)
    │  │      index.js                         // reducers主文件
    │  │      main.js                          // main组件中的数据模型
    │  │
    │  ├─styles                                // 公共样式文件目录
    │  ├─subComponents                         // 子组件目录
    │  │  └─MainItem                           // MainItem子组件
    │  │          index.css                    // 样式文件
    │  │          index.js                     // js文件
    │  │
    │  └─utils                                 // 工具文件目录
    │          request.js                      // 请求封装文件
    │
    └─test                                     // 测试目录
        │  loadtests.js
        │
        ├─actions
        │      .keep
        │
        ├─components
        │      MainTest.js
        │
        ├─config
        │      ConfigTest.js
        │
        ├─helpers
        │      shallowRenderHelper.js
        │
        ├─reducers
        │      .keep
        │
        └─subComponents


## 常用React写法、方法

### 路由

    import React from 'react';
    const ReactRouter = require('react-router');
    const Router = ReactRouter.Router;
    const Route = ReactRouter.Route;
    const withRouter = ReactRouter.withRouter;
    const IndexRedirect = ReactRouter.IndexRedirect;
    const browserHistory = ReactRouter.browserHistory;

    let Main = withRouter(require('react-router!components/Main/index'));

    class App extends React.Component {       // 容器组件
        render() {
            return (
                <div>
                    {this.props.children}
                </div>
            );
        }
    }

    let router = (
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <IndexRedirect to='main' />                  // 默认进入路由main
                <Route path='main' component={Main} />       // 路由main，对应组件Main
            </Route>
        </Router>
    );

    module.exports = router;

### app渲染

    import React from 'react';
    import ReactDOM from 'react-dom';
    import {
        Provider
    } from 'react-redux';
    import store from './reducers';
    import router from './router';    // 引入配置完成的路由

    // Render the main component into the dom
    ReactDOM.render(
        <Provider store={store}>
            {router}
        </Provider>, document.getElementById('app'));


### 组件

    import React from 'react';                        // 引入React
    import actions from 'actions';                    // actions 
    const ReactRedux = require('react-redux');        // 引入ReactRedux

    class AppComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state = {};                           // 数据初始化
        }
        componentWillReceiveProps(nextProps) {}        // 接受参数回调函数
        componentWillMount() {}                        // 组件渲染前回调，通常做拉取数据操作
        componentDidMount() {}                         // 组件渲染完成回调，通常设置数据、
                                                          setInterval、setTimeout、绑定事件
        componentWillUnmount() {}                      // 组件销毁前回调，通常做清除数据、                                                    clearInterval、clearTimeout、
                                                          解除事件绑定
        handleClickEvent() {}                          // 自定义事件处理回调
        render() {                                     // 组件呈现的视图
            return (
                <div className="index"></div>          
            );
        }
    }

    let mapStateToProps = function(state) {            // map数据到组件属性
        return {
            data: state.data
        };
    };

    let mapDispatchToProps = function(dispatch) {      // map事件到组件属性
        return {
            getMainData: function({ data, before, after, success, fail }) {
                dispatch(actions.getMainData({ data, before, after, success, fail }));
            }
        };
    };
 
    // 链接model数据、actions事件到组件
    module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AppComponent);

### actions

#### 主文件

    import _merge from 'lodash/merge';

    let actions = {};

    import main from './main';            // 引入main组件的action

    _merge(                               // 合并actions
        actions,
        main
    );

    module.exports = actions;

#### 组件action

    import Request from 'utils/request';

    function setMainData(data) {             // 设置reducer(M的数据)
        return {
            type: 'SET_MAIN_DATA',
            data
        };
    }

    let Main = {
        getMainData: function({ data, before, after, success, fail } = {}) { // 请求数据方法
            return function(dispatch) {
                let url = '';
                before && before();
                Request.get({
                    url: url,                                        // 接口url
                    data: data || {},                                // 请求数据
                    success: function(body) {                        // 请求成功回调
                        dispatch(setMainData(body.data));            // 分发reducer设置事件
                        success && success(body);                    // 业务成功回调                                                
                        after && after(body);                        // 业务完成回调
                    },
                    fail: function(body) {                           // 请求失败回调
                        fail && fail();                              // 业务失败回调
                        after && after(body);　　　　　　　　　　　　　 // 业务完成回调
                    }
                });
            };
        }
    };

    module.exports = Main;

### reducers

#### 主文件

    const Redux = require('redux');
    const Thunk = require('redux-thunk').default;

    import main from './main';                    // 引入main组件对应的model

    let app = Redux.combineReducers({             // 组合所有reducer
        main
    });

    let store = Redux.createStore(app, Redux.applyMiddleware(Thunk));

    module.exports = store;

#### 组件reducer

    let DEFAULT_MAIN_DATA = {             // Model默认值
        value: '',
        list: []
    };

    let Main = function(state, action) {
        switch (action.type) {
            case 'SET_MAIN_DATA':         // 设置Model数据
                return action.data || {};
            default:
                return state || DEFAULT_MAIN_DATA;
        }
    };

    module.exports = Main;

## 详细文档

* React
    * [https://facebook.github.io/react/](https://facebook.github.io/react/)
    * [http://www.react-cn.com/](http://www.react-cn.com/)
* Redux: 
    * [http://redux.js.org/](http://redux.js.org/)
    * [http://cn.redux.js.org/](http://cn.redux.js.org/)
* Webpack
    * [https://webpack.js.org/](https://webpack.js.org/)
* Babel
    * [http://babeljs.io/](http://babeljs.io/)
* eslint
    * [http://eslint.org/](http://eslint.org/)

