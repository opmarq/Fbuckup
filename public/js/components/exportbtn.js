class ExportBtn extends React.Component {

    handleExportClick(){
        
        console.log(this.props.export);
        this.props.handleExportCall();      
    }

    render() {
        
        let disabled = this.props.export.length > 0 && this.props.loading == "" ? false : true;

        let display = `btn btn-success ${this.props.loading}`;

        return <button disabled={disabled} onClick={ this.handleExportClick.bind(this) } className={display} >
            <i className="fa fa-cloud" aria-hidden="true"></i> Export
        </button>
    }

}