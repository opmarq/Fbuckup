class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "Login",
            token: "",
            profileImg: "img/profile.png",
            profileCover: "",
            username: "",
            albums: null,
            fullAlbums: null,
            listPhotos: null,
            exported: []
        };
    }

    handleLogin(infos) {

        if (!infos)
            return false;

        // console.log(infos);

        this.setState({
            name: "Logout",
            token: infos.authResponse.accessToken
        });

        this.fbGraphRequest();
    }

    fbGraphRequest() {
        // requesting user's infos and chaging the state to render the new infos in the view.
        FB.api('/me'
            , { fields: 'id,name,cover,picture.type(large),albums{name,photos,cover_photo.type(large)}' }
            , 'GET', this.handleResponse.bind(this));
    }

    handlePhotoSelection(url, state) {


        // check wiether to delete or push the new url!

        if (state) {

            this.setState({
                exported: [...this.state.exported, url]
            })
            
        }else{

            let tmpExported = this.state.exported;
            tmpExported.splice(tmpExported.indexOf(url),1);

            this.setState({
                exported: tmpExported
            });
        }


    }

    getSelectedAlbum(id) {

        var selectedAlbum = this.state.fullAlbums.find((album) => {

            return album.id == id;

        });

        var photosList = selectedAlbum.photos.data.map((photo) => {

            return <Photo key={photo.id} id={photo.id} handlePhotoSelection={this.handlePhotoSelection.bind(this)} token={this.state.token} />

        });

        this.setState({
            listPhotos: photosList
        });

    }

    // handling the response and getting the albums of the user to display them later.

    handleResponse(response) {

        var albums = response.albums.data.map((album) => {

            return <Album key={album.id} id={album.id} name={album.name} displayAlbumPhotos={this.getSelectedAlbum.bind(this)} />;

        });

        this.setState({
            profileImg: response.picture.data.url,
            profileCover: response.cover.source,
            username: response.name,
            albums: albums,
            fullAlbums: response.albums.data
        });

    }

    render() {
        return <div>
            <ProfileImg src={this.state.profileImg} cover={this.state.profileCover} username={this.state.username} />
            <FbLogin name={this.state.name} getUserInfo={this.handleLogin.bind(this)} />
            <ExportBtn export={this.state.exported} />
            <div className="row album-section">
                {this.state.albums}
            </div>
            <div className="row photos-section">
                {this.state.listPhotos}
            </div>
        </div>;
    }

}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);