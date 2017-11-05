class ExportBtn extends React.Component {

    handleExportClick(){
        console.log(this.props.export);
    }

    render() {
        
        let disabled = this.props.export.length > 0 ? false : true;

        return <button disabled={disabled} onClick={ this.handleExportClick.bind(this) } className="btn btn-warning"  >
            <i className="fa fa-cloud" aria-hidden="true"></i> Export
        </button>
    }

}