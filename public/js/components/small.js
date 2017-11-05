function ProfileImg(props) {
    
        return <div className="cover-section" style={ { background:`url(${props.cover}) `} } >
            <img src={props.src} className="img img-profile" />
            <h4 className="profile-name">{props.username}</h4>
        </div>;
    }
    