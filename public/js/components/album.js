class Album extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick() {
        this.props.displayAlbumPhotos(this.props.id);
    }

    render() {
        return <div className="col-sm-3 album-element" >
            <button onClick={this.handleClick.bind(this)} className="btn btn-block btn-default" > 
                <i className="fa fa-picture-o" aria-hidden="true"></i> {this.props.name}  
            </button>
        </div>;
    }

}