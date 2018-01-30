import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Messages extends Component {
  static propTypes = {
    user: PropTypes.object,
    messages: PropTypes.array,
    selectedConversation: PropTypes.object,
    onReply: PropTypes.func,
    showNewMessageForm: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      body: null
    };
  }

  replyConversation(e) {
    this.props.onReply(this.state.body, e)
  }

  handleBodyChange(e) {
    let value = e.target.value;
    this.setState({body: value});
  }

  renderMessages() {
    let messages = this.props.messages;
    let renderedMessages =
      messages.map( (message, index) => {
        let date = new Date(message.sent_at);
        let sentMessage = (message.sender_id === this.props.user.id);
        let classes = {
          message_box: true,
          sent_message: sentMessage
        };

        return (
          <div key={index} className={classNames(classes)}>
            <div className="message_date">{date.toLocaleString()}</div>
            <div className="message_row">
              <div className="message_bubble">{message.body}</div>
            </div>
          </div>
        );
      });

    if (messages.length > 0) {
      return (
        <div className="message_list">
          {renderedMessages}
        </div>
      );
    }

    return (
      <div>No Messages yet! Say hello!</div>
    );
  }

  renderMessageForm() {
    if (this.props.selectedConversation) {
      let buttonText = this.props.messages.length > 0 ? 'Send Reply' : 'Send Message';
      return (
        <div className="message_form">
          <form onSubmit={this.replyConversation.bind(this)}>
            <input type="body" name="body" placeholder="Message" onChange={this.handleBodyChange.bind(this) } />
            <button type="submit" className="btn black_btn">
              {buttonText}
            </button>
          </form>
        </div>
      );
    }

    return '';

  }

  renderNewMessageForm() {
    if (this.props.showNewMessageForm) {
      return (
        <div>New Message Form</div>
      );
    }

    return '';
  }

  render() {
    return (
      <div className="messages">
        {this.renderMessages()}
        {this.renderMessageForm()}
        {this.renderNewMessageForm()}
      </div>
    );

  }
}

export default Messages;
