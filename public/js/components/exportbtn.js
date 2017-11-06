class ExportBtn extends React.Component {

    handleExportClick(){

        console.log(this.props.export);
        this.props.handleExportCall();

    }

    render() {
        
        let disabled = this.props.export.length > 0 ? false : true;

        return <button disabled={disabled} onClick={ this.handleExportClick.bind(this) } className="btn btn-success"  >
            <i className="fa fa-cloud" aria-hidden="true"></i> Export
        </button>
    }

}