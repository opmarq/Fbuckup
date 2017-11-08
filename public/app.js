class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "Login",
            token: "",
            profileImg: "img/profile.png",
            profileCover: "img/cover.jpg",
            username: "",
            albums: null,
            fullAlbums: null,
            listPhotos: null,
            exported: []
        };
    }

    // this is a callback function, will will be fired when the user clicks the login button
    // we check if the user did complet the login if yes we request the user informations from facebook api

    handleLogin(infos) {

        if (!infos)
            return false;

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


    // handling the response and getting the albums of the user to display them later.

    handleResponse(response) {

        // populating the Album component

        var albums = response.albums.data.map((album) => {

            return <Album key={album.id} id={album.id} name={album.name} displayAlbumPhotos={this.getSelectedAlbum.bind(this)} />;

        });

        // changing the state which will triggers component to render and change the view

        this.setState({
            profileImg: response.picture.data.url,
            profileCover: response.cover.source,
            username: response.name,
            albums: albums,
            fullAlbums: response.albums.data
        });

    }


    // callback for selecting the album which will show photos of the selected album based on its ID

    getSelectedAlbum(id) {

        // get the selected album
        var selectedAlbum = this.state.fullAlbums.find((album) => album.id == id);

        // getting the photos of the selected album 

        var photosList = selectedAlbum.photos.data.map((photo) => {

            return <Photo key={photo.id} id={photo.id} handlePhotoSelection={this.handlePhotoSelection.bind(this)} token={this.state.token} />

        });

        this.setState({
            listPhotos: photosList
        });

    }


    handlePhotoSelection(url, state) {

        // delete or push the new url!

        if (state) {

            this.setState({
                exported: [...this.state.exported, url]
            })

        } else {

            let tmpExported = this.state.exported;
            tmpExported.splice(tmpExported.indexOf(url), 1);

            this.setState({
                exported: tmpExported
            });
        }

    }

    handleExportCall() {

        let payload = {
            urls: JSON.stringify(this.state.exported),
            fbtoken: this.state.token
        }

        // calling sending the image urls to the server 

        $.post( "http://localhost:8000/backup",payload ,function(data){

            console.log(data);

        });
    }

    render() {
        return <div>
            <ProfileSection src={this.state.profileImg} cover={this.state.profileCover} username={this.state.username} />
            <FbLogin name={this.state.name} getUserInfo={this.handleLogin.bind(this)} />
            <ExportBtn export={this.state.exported} handleExportCall={this.handleExportCall.bind(this)} />
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

