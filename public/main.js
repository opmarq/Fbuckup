class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "login",
            token: "",
            profileImg: "img/profile.png",
            username: "",
            albums: null,
            fullAlbums: null,
            listPhotos: null
        };
    }

    handleLogin(infos) {

        if (!infos)
            return false;

        // console.log(infos);

        this.setState({
            name: "logout",
            token: infos.authResponse.accessToken
        });

        this.fbGraphRequest();
    }

    fbGraphRequest() {
        // requesting user's infos and chaging the state to render the new infos in the view.
        FB.api('/me'
            , { fields: 'id,name,picture.type(large),albums{name,photos,cover_photo.type(large)}' }
            , 'GET', this.handleResponse.bind(this));
    }

    getSelectedAlbum(id) {

        var selectedAlbum = this.state.fullAlbums.find((album) => {

            return album.id == id;

        });


        var photosList = selectedAlbum.photos.data.map((photo)=>{

            return <Photo id={photo.id} token={this.state.token} />

        });

        this.setState({
            listPhotos: photosList
        });

    }

    handleResponse(response) {

        var albums = response.albums.data.map((album) => {

            return <Album key={album.id} id={album.id} name={album.name} displayAlbumPhotos={this.getSelectedAlbum.bind(this)} />;

        });

        this.setState({
            profileImg: response.picture.data.url,
            username: response.name,
            albums: albums,
            fullAlbums: response.albums.data
        });

    }

    render() {
        return <div>
            <ProfileImg src={this.state.profileImg} username={this.state.username} />
            <FbLogin name={this.state.name} getUserInfo={this.handleLogin.bind(this)} />
            <div className="row album-section">
                {this.state.albums}
            </div>
            <div className="row photos-section">
                { this.state.listPhotos }
            </div>
        </div>;
    }

}

class FbLogin extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(name) {

        if (name == "login") {
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


function ProfileImg(props) {

    return <div>
        <img src={props.src} className="img img-profile" />
        <h4 className="profile-name">{props.username}</h4>
    </div>;
}

class Album extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick() {
        this.props.displayAlbumPhotos(this.props.id);
    }

    render() {
        return <div className="col-sm-3 album-element" >
            <button onClick={this.handleClick.bind(this)} className="btn btn-block btn-primary" > {this.props.name}  </button>
        </div>;
    }

}

class Photo extends React.Component {

    constructor(props) {
        super(props);
    }

    makeFacebookPhotoURL(id, accessToken) {

        return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
    }

    render() {
        return <div className="col-sm-3 photo-element">
            <img src={ this.makeFacebookPhotoURL(this.props.id,this.props.token) } />
        </div>;
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);