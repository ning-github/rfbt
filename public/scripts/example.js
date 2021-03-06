var CommentBox = React.createClass({
  getInitialState: function(){
    return {
      data: []
    }
  },
  loadCommentsFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      // type of ajax call is defaulted to GET
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment){
    // optimistically add comment (don't have to wait for POST req complete)
      // get current state of data
    var comments = this.state.data;
      // concat what we are just submitting now
    var newComments = comments.concat([comment]);
      // set the state with the concatted version
    this.setState({data: newComments});
    // send to server and refresh list
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data){
        console.log('this is success data: ', data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.loadCommentsFromServer();
    // reload comments from server time loop set by pollInterval property of CommentBox
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function(){
    return (
      <div className = "commentBox">
        Hello World! I am a CommentBox
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div> 
    );
  }
});


var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(eachComment){
      return (
        <Comment author={eachComment.author}>
          {eachComment.text}
        </Comment>
      );
    });
    console.log('array of nodes: ', commentNodes);
    return (
      <div>{commentNodes}</div>
    );
  }
});


// Using Props
var Comment = React.createClass({
  render: function(){
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML = {{__html: rawMarkup}}></span>
      </div>
    );
  }
});

// Hook up the data model
  // eventually this should be json that comes from the server
var data = [
  {author: 'Bruce Wayne', text: 'I am rich AND a text node so therefore a child'},
  {author: 'Clark Kent', text: 'I shoot *lasers* from my eyes. text nodes are children of their wrapping tags'},
  {author: 'Hal Jordan', text: 'In brighest day...'}
];

var CommentForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    // trim just removes the whitespace
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();

    // send info to server
    // onCommentSubmit was a property put on <CommentForm /> in CommentBox's render
    this.props.onCommentSubmit({author: author, text: text});
    // clear the fields after submission
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';    
    return;
  },
  render: function(){
    console.log('this is this.refs: ', this.refs);
    // NOTE: each ref is a reference the actual component INSTANCE (not just descr.)
    //  eg) this.refs.author 
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input placeholder="Your name" ref="author"/>
        <input placeholder="Say something" ref="text"/>
        <input type="submit" value="Post"/>
      </form>
    )
  }
});

// render last
React.render(
  <CommentBox url="comments.json" pollInterval={3000}/>,
  document.getElementById('content')
);

// /**
//  * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
//  * Facebook reserves all rights not expressly granted.
//  *
//  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
//  * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//  * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//  */

// var Comment = React.createClass({
//   render: function() {
//     var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
//     return (
//       <div className="comment">
//         <h2 className="commentAuthor">
//           {this.props.author}
//         </h2>
//         <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
//       </div>
//     );
//   }
// });

// var CommentBox = React.createClass({
//   loadCommentsFromServer: function() {
//     $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       cache: false,
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   handleCommentSubmit: function(comment) {
//     var comments = this.state.data;
//     comments.push(comment);
//     this.setState({data: comments}, function() {
//       // `setState` accepts a callback. To avoid (improbable) race condition,
//       // `we'll send the ajax request right after we optimistically set the new
//       // `state.
//       $.ajax({
//         url: this.props.url,
//         dataType: 'json',
//         type: 'POST',
//         data: comment,
//         success: function(data) {
//           this.setState({data: data});
//         }.bind(this),
//         error: function(xhr, status, err) {
//           console.error(this.props.url, status, err.toString());
//         }.bind(this)
//       });
//     });
//   },
//   getInitialState: function() {
//     return {data: []};
//   },
//   componentDidMount: function() {
//     this.loadCommentsFromServer();
//     setInterval(this.loadCommentsFromServer, this.props.pollInterval);
//   },
//   render: function() {
//     return (
//       <div className="commentBox">
//         <h1>Comments</h1>
//         <CommentList data={this.state.data} />
//         <CommentForm onCommentSubmit={this.handleCommentSubmit} />
//       </div>
//     );
//   }
// });

// var CommentList = React.createClass({
//   render: function() {
//     var commentNodes = this.props.data.map(function(comment, index) {
//       return (
//         // `key` is a React-specific concept and is not mandatory for the
//         // purpose of this tutorial. if you're curious, see more here:
//         // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
//         <Comment author={comment.author} key={index}>
//           {comment.text}
//         </Comment>
//       );
//     });
//     return (
//       <div className="commentList">
//         {commentNodes}
//       </div>
//     );
//   }
// });

// var CommentForm = React.createClass({
//   handleSubmit: function(e) {
//     e.preventDefault();
//     var author = React.findDOMNode(this.refs.author).value.trim();
//     var text = React.findDOMNode(this.refs.text).value.trim();
//     if (!text || !author) {
//       return;
//     }
//     this.props.onCommentSubmit({author: author, text: text});
//     React.findDOMNode(this.refs.author).value = '';
//     React.findDOMNode(this.refs.text).value = '';
//   },
//   render: function() {
//     return (
//       <form className="commentForm" onSubmit={this.handleSubmit}>
//         <input type="text" placeholder="Your name" ref="author" />
//         <input type="text" placeholder="Say something..." ref="text" />
//         <input type="submit" value="Post" />
//       </form>
//     );
//   }
// });

// React.render(
//   <CommentBox url="comments.json" pollInterval={2000} />,
//   document.getElementById('content')
// );
