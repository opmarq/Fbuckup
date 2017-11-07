class Photo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }

    makeFacebookPhotoURL(id, accessToken) {

        return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
    }

    toggleSelection() {

        this.setState((prevState) => ({
            selected: !prevState.selected
        }));

        // sending the selected image with its state to the parent by calling its callback function.

        this.props.handlePhotoSelection(this.makeFacebookPhotoURL(this.props.id, this.props.token), !this.state.selected);

    }

    render() {
        return <div className="col-sm-3 photo-element" onClick={this.toggleSelection.bind(this)} >
            <div>
                <img className={this.state.selected ? 'img-selected' : ''} src={this.makeFacebookPhotoURL(this.props.id, this.props.token)} />
            </div>
        </div>;
    }
}