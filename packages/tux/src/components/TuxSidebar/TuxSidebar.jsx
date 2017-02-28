var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import classNames from 'classnames';
class TuxSidebar extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            user: null,
        };
        this.login = () => {
            this.context.tux.adapter.login();
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.context.tux.adapter.currentUser();
            if (user) {
                this.setState({
                    user: {
                        name: user.firstName,
                        avatarUrl: user.avatarUrl,
                        spaceName: user.space.name,
                    }
                });
            }
        });
    }
    render() {
        const { isEditing, overlayIsActive, onClickEdit } = this.props;
        const { user } = this.state;
        return (<div className={classNames('TuxSidebar', overlayIsActive && 'has-overlay')}>
        <ul className="TuxSidebar-content">
          <div className="TuxSidebar-logo">Tux</div>
          <li>
            <button className={classNames('TuxSidebar-editButton', isEditing && 'is-active')} onClick={onClickEdit}>{isEditing ? 'Editing: on' : 'Editing: off'}</button>
          </li>
          <li><a href="/">Documentation</a></li>
          <li><a href="/">Tux on Github</a></li>
        </ul>
        {user && (<div className="TuxSidebar-user">
            <a onClick={this.login} className="TuxSidebar-signInOut">{user ? 'Sign out' : 'Sign in'}</a>
          </div>)}

        <style jsx>{`
          .TuxSidebar {
            background: #f3f5f7;
            box-sizing: border-box;
            position: fixed;
            width: 100%;
            max-width: 260px;
            height: 100%;
            min-height: 100vh;
            z-index: 100;
            box-shadow: 7px 1px 10px rgba(0, 0, 0, 0.2);
            transform: none;
            transition: transform 0.4s ease-out;
            will-change: transform;
          }
          /* When we open a *modal* for editing, we animate the sidebar out. */
          .TuxSidebar.has-overlay {
            transform: translateX(-100%);
          }
          .TuxSidebar-userAvatar {
            padding-top: 100%;
            background-repeat: no-repeat;
            background-size: cover;
          }
          .TuxSidebar-quickjump {
            display: block;
            font-size: 15px;
            margin-top: 10px;
            padding: 4px;
            width: 100%;
          }
          .TuxSidebar-content {
            display: block;
            position: relative;
            flex: 0 1 100%;
            padding: 10px;
          }
          .TuxSidebar-content li {
            font-size: 16px;
            color: #3C4858;
            display: block;
            margin: 10px 15px;
            padding: 10px 15px;
          }
          .TuxSidebar-content li a {
            text-decoration: none;
          }
          .TuxSidebar-logo {
            font-size: 24px;
            padding: 10px;
            text-align: center;
            font-size: 24px;
            border-bottom: 1px solid rgba(180, 180, 180, 0.3);
            margin-bottom: 10px;
          }
          .TuxSidebar-editButton {
            appearance: none;
            background: #473bb1;
            border: none;
            box-shadow: 0 12px 20px -10px rgba(71, 59, 177, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(71, 59, 177, 0.2);
            color: white;
            cursor: pointer;
            display: block;
            font-size: 16px;
            padding: 15px;
            width: 100%;
          }
          .TuxSidebar-editButton:hover {
            background: #4f41c7;
          }
          .TuxSidebar-editButton.is-active {
            background: #e8008a;
            box-shadow: 0px 0px 3px 2px rgba(232, 0, 138, 0.25);
          }
          .TuxSidebar-user {
            bottom: 25px;
            left: 0; right: 0;
            margin: auto;
            position: absolute;
          }
          .TuxSidebar-signInOut {
            opacity: 0.85;
            cursor: pointer;
            color: #3C4858;
            display: block;
            text-decoration: none;
            text-align: center;
            text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
          }
          .TuxSidebar-signInOut:hover {
            color: #e8008a;
          }
        `}</style>
      </div>);
    }
}
TuxSidebar.contextTypes = {
    tux: React.PropTypes.object,
};
export default TuxSidebar;
//# sourceMappingURL=TuxSidebar.jsx.map