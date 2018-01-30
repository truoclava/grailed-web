import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../Styles/Conversations.css';

class Conversations extends Component {
  static propTypes = {
    conversations: PropTypes.array,
    onSelectConv: PropTypes.func,
    onNewMessage: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedConversation: null
    };
  }

  handleSelectConv(conv) {
    this.setState({selectedConversation: conv});
    if (this.props.onSelectConv) {
      this.props.onSelectConv(conv);
    }
  }

  handleNewMessage() {
    this.props.onNewMessage();
  }

  renderConvList() {
    let conversations = this.props.conversations;
    let renderedConversations =
      conversations.map( (conversation, index) => {
        let lastActivity = new Date(conversation.last_activity_at);
        let lastMessage = conversation.most_recent_message ? conversation.most_recent_message.body : 'No messages yet';
        let otherUser = (conversation.buyer.id === JSON.parse(localStorage.user).id ? conversation.seller : conversation.buyer);
        return (
          <div key={index} className="flex_row conversation" onClick={this.handleSelectConv.bind(this, conversation)}>
            <img alt="profile_pic" className="default_img" src="https://d1qz9pzgo5wm5k.cloudfront.net/api/file/9uidziLNQ32OGQlk8G0w" />
            <div className="convo_info">
              <p className="convo_name">{otherUser.name}</p>
              <p className="last_message_preview">{lastMessage}</p>
            </div>
            <div className="convo_date">{lastActivity.toLocaleString().split(',')[0]}</div>
          </div>
        );
      });

    if (conversations.length > 0) {
      return (
        <div className="conversation_list">
          {renderedConversations}
        </div>
      );
    }

    return (
      <div className="conversation_list">
        No conversations yet!
      </div>
    );
  }

  renderNewConv() {
    return (
      <div className="new_conv" onClick={this.handleNewMessage.bind(this)}>New Message</div>
    );
  }

  render() {
    return (
      <div className="conversations">
        <h3>Conversations</h3>
        {this.renderNewConv()}
        {this.renderConvList()}
      </div>
    );
  }
}

export default Conversations;
