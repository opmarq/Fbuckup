class FbLogin extends React.Component {

    handleClick(name) {

        if (name == "Login") {
            
            FB.login((response) => {

                if (response.authResponse)

                    this.props.getUserInfo(response);
                else
                    this.props.getUserInfo(false);

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
