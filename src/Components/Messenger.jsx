import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Conversations from '../Components/Conversations.jsx';
import Messages from '../Components/Messages.jsx';

import axios from 'axios';
import _ from 'lodash';

import '../Styles/Messenger.css';

class Messenger extends Component {
  static propTypes = {
    conversations: PropTypes.array,
    messages: PropTypes.array,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.messages,
      selectedConversation: null,
      showNewMessageForm: false
    };
  }

  createNewMessage() {
    this.setState({showNewMessageForm: true});
  }

  addMessageSuccess(message) {
    let newMessages = _.clone(this.state.messages);
    if (newMessages) {
      // add the new item
      newMessages.unshift(message);
      // pop off the last item if it is longer than 9
      if (newMessages.length > 5) {
        newMessages.pop();
      }
    }

    this.setState({messages: newMessages});
  }

  loadMessages(conv) {
    this.setState({selectedConversation: conv});
    axios.get(`/api/v1/conversations/${conv.id}/messages`)
      .then( (response) => {
        if (response.data) {
          this.setState({messages: response.data.messages})
        }
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  handleReply(body, e) {
    e.preventDefault();

    let params = {message : {
        sender_id: this.props.user.id,
        body: body
      }
    }

    axios.post(`/api/v1/conversations/${this.state.selectedConversation.id}/reply`, params)
      .then( (response) => {
        if (response.data) {
          let message = response.data.message;
          this.addMessageSuccess(message);
        }
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  renderConversations() {
    if (this.props.conversations.length > 0) {
      return (
        <div className="messenger_left">
          <Conversations
            conversations={this.props.conversations}
            onSelectConv={this.loadMessages.bind(this)}
            onNewMessage={this.createNewMessage.bind(this)}
          />
        </div>
      );
    }

    return '';
  }

  renderMessages() {
    return (
      <div className="messenger_right">
        <Messages
          user={this.props.user}
          selectedConversation={this.state.selectedConversation}
          messages={this.state.messages}
          onReply={this.handleReply.bind(this)}
          showNewMessageForm={this.state.showNewMessageForm}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="messenger flex_row">
        {this.renderConversations()}
        {this.renderMessages()}
      </div>
    );
  }
}

export default Messenger;
