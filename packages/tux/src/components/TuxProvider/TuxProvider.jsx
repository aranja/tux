var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from 'react';
import ModalContainer, { openModal } from '../TuxModalContainer';
import TuxSidebar from '../TuxSidebar';
import TuxModal from '../TuxModal';
class TuxProvider extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            isEditing: false,
            overlayIsActive: false,
        };
        this.editModel = (model) => __awaiter(this, void 0, void 0, function* () {
            // Modal has been opened.
            this.setState({
                overlayIsActive: true
            });
            yield openModal(<TuxModal model={model}/>);
            // Wait for openModal promise to resolve,
            // which means that the modal has been closed.
            this.setState({
                overlayIsActive: false
            });
        });
        this.onClickEdit = () => {
            const { isEditing } = this.state;
            this.setState({
                isEditing: !isEditing
            });
        };
    }
    getChildContext() {
        return {
            tux: {
                isEditing: this.state.isEditing,
                editModel: this.editModel,
                adapter: this.props.adapter,
            },
        };
    }
    render() {
        const { isEditing, overlayIsActive } = this.state;
        return (<div className="TuxProvider">
        <TuxSidebar isEditing={isEditing} overlayIsActive={overlayIsActive} onClickEdit={this.onClickEdit}/>
        {this.props.children}
        <ModalContainer />
      </div>);
    }
}
TuxProvider.childContextTypes = {
    tux: React.PropTypes.shape({
        isEditing: React.PropTypes.bool.isRequired,
        editModel: React.PropTypes.func.isRequired,
        adapter: React.PropTypes.object.isRequired,
    }),
};
export default TuxProvider;
//# sourceMappingURL=TuxProvider.jsx.map