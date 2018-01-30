import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import NewMessageForm from '../Components/NewMessageForm.jsx';

class Messages extends Component {
  static propTypes = {
    user: PropTypes.object,
    messages: PropTypes.array,
    selectedConversation: PropTypes.object,
    onReply: PropTypes.func,
    showNewMessageForm: PropTypes.bool,
    addNewConv: PropTypes.func
  };

  handleNewConvSuccess(conv) {
    this.props.addNewConv(conv);
  }

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

    if (messages.length > 0 && !this.props.showNewMessageForm) {
      // move this out into a utils function
      let conversation = this.props.selectedConversation;
      let otherUser = (conversation.buyer.id === JSON.parse(localStorage.user).id ? conversation.seller : conversation.buyer);
      return (
        <div className="message_list">
          <h3>{otherUser.name}</h3>
          {renderedMessages}
          {this.renderMessageForm()}
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <NewMessageForm
          onNewConvSuccess={this.handleNewConvSuccess.bind(this)}
        />
      );
    }

    return '';
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
    // move this into its own component
    if (this.props.showNewMessageForm) {
      return (
        <NewMessageForm
          onNewConvSuccess={this.handleNewConvSuccess.bind(this)}
        />
      );
    }

    return '';
  }

  render() {
    return (
      <div className="messages">
        {this.renderMessages()}
        {this.renderNewMessageForm()}
      </div>
    );

  }
}

export default Messages;
