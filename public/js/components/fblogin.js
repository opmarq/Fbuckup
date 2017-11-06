class FbLogin extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(name) {

        if (name == "Login") {
            FB.login((response) => {

                if (response.authResponse) {

                    this.props.getUserInfo(response);

                    // User is signed-in Facebook.
                    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
                        unsubscribe();
                        // Check if we are already signed-in Firebase with the correct user.
                        // Build Firebase credential with the Facebook auth token.
                        var credential = firebase.auth.FacebookAuthProvider.credential(
                            response.authResponse.accessToken);
                        // Sign in with the credential from the Facebook user.
                        firebase.auth().signInWithCredential(credential).catch(function (error) {
                            // Handle Errors here.
                            console.log(error);
                        });
                    });
                } else {
                    // User is signed-out of Facebook.
                    firebase.auth().signOut();
                    this.props.getUserInfo(false);

                }

            }, { scope: 'email,user_photos' });

        } else {

            FB.logout(() => { document.location.reload() });

        }

    }

    render() {

        return <button className="btn btn-primary" onClick={this.handleClick.bind(this, this.props.name)}>
            <i className="fa fa-facebook" aria-hidden="true"></i> {this.props.name}
        </button>;
    }

}
