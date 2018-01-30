import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class NewMessageForm extends Component {
  static propTypes = {
    onNewConvSuccess: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      body: null,
      selectedUser: '',
      users: [],
      recipient_id: 1,
      totalPages: 1,
      page: 1
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers() {
    axios.get(`/api/v1/users`)
      .then( (response) => {
        if (response.data) {
          this.setState({users: response.data.users, totalPages: response.data.paging.total_pages})
        }
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  handleNewConversation(e) {
    e.preventDefault();
    let params = {
      conversation: {
      buyer_id: JSON.parse(localStorage.user).id,
      seller_id: this.state.recipient_id,
      message_attributes: {}
      }
    }

    let messageParams = {
        body: this.state.body,
        recipient_id: this.state.recipient_id,
        sender_id: JSON.parse(localStorage.user).id
    }

    params["conversation"]["message_attributes"] = messageParams;

    // messages: {[
    //   body: this.state.body,
    //   recipient_id: this.state.recipient_id,
    //   sender_id: JSON.parse(localStorage.user).id]
    // }

    // if (this.state.recipient_id === JSON.parse(localStorage.user).id) {
    //   this.setState({errorMessage: "You cannot send a message to yourself yet!"});
    // }

    axios.post(`/api/v1/conversations/`, params)
      .then( (response) => {
        if (response.data) {
          this.props.onNewConvSuccess(response.data.conversation);
        }
      })
      .catch( (error) => {
        console.log(error);
      });
  }


  handleBodyChange(e) {
    let value = e.target.value;
    this.setState({body: value});
  }

  handleSelect(e) {
    e.preventDefault();
    let recipientId = e.target.value;
    this.setState({recipient_id: recipientId})
  }

  renderUserSelect() {
    let options = this.state.users.map((user, index) => {
      return (
        <option key={index} value={user.id}>{user.name}</option>
      );
    });

    return (
      <select
        value={this.state.recipientId}
        onChange={this.handleSelect.bind(this)}
        name="user_select"
      >
        {options}
      </select>
    );
  }

  // renderMoreUsers() {
  //   if (this.state.totalPages > 1) {
  //     return (
  //       <div onClick={this.handlePageChange.bind(this)} className="paginate_button">See More Users</div>
  //     );
  //   }
  // }

  render() {
    return (
      <div className="new_message_form">
        <h3>Send New Message</h3>
        <form onSubmit={this.handleNewConversation.bind(this)}>
          {this.renderUserSelect()}
          <input type="body" name="body" placeholder="Message" onChange={this.handleBodyChange.bind(this) } />
          <button type="submit" className="btn black_btn">
            Send Message
          </button>
        </form>
      </div>
    );
  }
}

export default NewMessageForm;
