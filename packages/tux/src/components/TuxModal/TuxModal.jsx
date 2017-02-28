var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
const MarkdownField = ({ id, value, label, helpText, onChange }) => (<div>
    <input className="InputField" label={label} id={id} value={value} onChange={onChange}/>
      <style jsx>{`
        .InputField {
          border-radius: 3px;
          border: 1px solid #cbcbcb;
          color: #313132;
          margin: 5px 0;
          padding: 10px;
          width: 100%;
        }
      `}</style>
  </div>);
const TextField = ({ id, value, label, helpText, onChange }) => (<div>
    <input className="InputField" label={label} id={id} value={value} onChange={onChange}/>
    <style jsx>{`
      .InputField {
        border-radius: 3px;
        border: 1px solid #cbcbcb;
        color: #313132;
        margin: 5px 0;
        padding: 10px;
        width: 100%;
      }
      `}</style>
  </div>);
function componentForField({ id, type, control: { widgetId } }) {
    if (type === 'Array')
        return null;
    if (widgetId === 'markdown') {
        return MarkdownField;
    }
    else {
        return TextField;
    }
}
class TuxModal extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            fullModel: null,
            typeMeta: null,
        };
        this.onCancel = () => {
            this.props.onClose();
        };
        this.onSubmit = (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const { fullModel } = this.state;
            yield this.context.tux.adapter.save(fullModel);
            this.props.onClose(true);
        });
        this.renderField = (type) => {
            const helpText = type.control.settings && type.control.settings.helpText;
            const InputComponent = componentForField(type);
            const field = this.state.fullModel.fields[type.id];
            const value = field && field['en-US'];
            if (!InputComponent) {
                return null;
            }
            return (<div key={type.id}>
        <InputComponent id={type.id} value={value} label={type.name} helpText={helpText} onChange={event => this.onChange(event, type)}/>
      </div>);
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const { model } = this.props;
            const [fullModel, typeMeta,] = yield Promise.all([
                this.context.tux.adapter.load(model),
                this.context.tux.adapter.getSchema(model),
            ]);
            this.setState({
                fullModel,
                typeMeta,
            });
        });
    }
    onChange(event, type) {
        const { fullModel } = this.state;
        const field = fullModel.fields[type.id];
        field['en-US'] = event.target.value;
        this.setState({ fullModel });
    }
    render() {
        const { fullModel, typeMeta } = this.state;
        return (<div className="TuxModal">
        {fullModel ? (<form onSubmit={this.onSubmit}>
            <div className="TuxModal-topBar">
              <h1 className="TuxModal-title">Editing component <strong className="TuxModal-componentName">{typeMeta.name}</strong></h1>
              <div className="TuxModal-buttons">
                <button className="TuxModal-button" label="Cancel" onClick={this.onCancel}>Cancel</button>
                <button className="TuxModal-button TuxModal-button--green" type="submit" label="Save">Save</button>
              </div>
            </div>
            <div className="TuxModal-content">
              {typeMeta.fields.map(this.renderField)}
            </div>
          </form>) : ('Loading')}
        <style jsx>{`

          .TuxModal {
            background: #F3F5F7;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            max-width: 60%;
            height: 100%;
            padding: 30px;
          }

          .TuxModal-topBar {
            display: flex;
            justify-content: space-between;
            padding-bottom: 20px;
          }

          .TuxModal-title {
            color: rgba(0, 0, 0, 0.8);
            font-size: 1.6em;
            font-weight: 400;
            margin: 0;
          }

          .TuxModal-componentName {
            text-transform: capitalize;
          }

          .TuxModal-buttons {
            display: flex;
            justify-content: flex-end;
          }

          .TuxModal-button {
            background: #E5EBED;
            border-radius: 2px;
            border: 1px solid #C3CFD5;
            color: #536171;
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.3;
            margin: 0;
            padding: 10px 24px;
            text-align: center;
            vertical-align: baseline;
          }

          .TuxModal-button + .TuxModal-button {
            margin-left: 10px;
          }

          .TuxModal-button.TuxModal-button--green {
            color: #FFF;
            background: #3BB172;
            border-color: #188e18;
          }
        `}</style>
      </div>);
    }
}
TuxModal.contextTypes = {
    tux: React.PropTypes.object,
};
export default TuxModal;
//# sourceMappingURL=TuxModal.jsx.map