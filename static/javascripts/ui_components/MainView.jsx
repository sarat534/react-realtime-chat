var MainView = React.createClass({

  getInitialState: function() {
    return {
      messages: []
    };
  },

  componentWillMount: function() {
  },

  componentDidMount: function() {
    
    this.pusher = new Pusher(PUSHER_CHAT_APP_KEY);
    this.chatRoom = this.pusher.subscribe('messages');
    this.chatRoom.bind('pusher:subscription_succeeded', this.retrieveHistory, this);

    this.chatRoom.bind('new_message', this.addMessage, this);

    $(document).ready(function(){
      $('#msg-input').emojiPicker({
        height: '150px',
        width: '200px',
        button: false
      }); 

    });

  },
  
  /**
   * Add the given message to the UI.
   */  
  addMessage: function(message){
    this.setState({messages: this.state.messages.concat(message)})

    $("#message-list").scrollTop($("#message-list")[0].scrollHeight);
  },

  /**
   * Fetch existing messages from a `/messages` endpoint
   * using a `GET` request.
   */  
  retrieveHistory: function() {
    var self = this;
    $.get('/messages').success(function(response) {
      response.results.forEach(self.addMessage, self);
    });
  },

  sendMessage: function(text){
    var message = {
      name: this.props.name,
      text: text,
      time: new Date()
    }

    $.post('/messages', message).success(function(){
      var input = document.getElementById('msg-input');
      input.value = ""
    });
  },

  _onClick: function(e){
    var input = document.getElementById('msg-input');
    var text = input.value;
    if (text === "") return;
    this.sendMessage(text);
  },

  _onEnter: function(e){
    if (e.nativeEvent.keyCode != 13) return;
    e.preventDefault();
    var input = e.target;
    var text = input.value;

    if (text === "") return;
    this.sendMessage(text);
  },

  toggleEmoji: function(evt){
      $('#msg-input').emojiPicker('toggle');
  },

  render: function() {

    if (!this.props.name) var style = {display:'none'}

    var body = (
      <div className="light-grey-blue-background chat-app">
        <Messages messages={this.state.messages}  />

        <div className="action-bar">
          <div className="option col-xs-1 white-background">
            <span id="emoji" onClick={this.toggleEmoji} className="fa fa-smile-o light-grey"></span>
          </div>
          <textarea id="msg-input" className="input-message col-xs-10" placeholder="Your message" onKeyPress={this._onEnter}></textarea>
          <div className="option col-xs-1 green-background send-message" onClick={this._onClick}>
            <span className="white light fa fa-paper-plane-o"></span>
          </div>
        </div>
      </div>
    );

    return (
      <div style={style} className="text-center">
        <div className="marvel-device iphone6 silver">
            <div className="top-bar"></div>
            <div className="sleep"></div>
            <div className="volume"></div>
            <div className="camera"></div>
            <div className="sensor"></div>
            <div className="speaker"></div>
            <div className="screen">
                {body}
            </div>
            <div className="home"></div>
            <div className="bottom-bar"></div>
        </div>
      </div>

    );
  }

});