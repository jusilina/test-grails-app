var proxy = new Ext.data.HttpProxy({
    url : 'http://localhostGrailsApp/company/read'
//    api: {
//        read : 'company/read',
//        create : 'save',
//        update: 'save',
//        destroy: 'delete'
//    }
});

var reader = new Ext.data.JsonReader({
    totalProperty: 'totalCount',
    successProperty: 'success',
    idProperty: 'id',
    root: 'data',
    messageProperty: 'message'
}, [
    {name: 'id'},
    {name: 'name', type:'string',  allowBlank: false},
    {name: 'description', type:'string'}
]);

var writer = new Ext.data.JsonWriter({
    encode: true,
    writeAllFields: false
});

var store = new Ext.data.Store({
    proxy: proxy,
    reader: reader,
    writer: writer,
    autoSave: false,
    remoteSort: true
});

Ext.onReady(function() {
    Ext.QuickTips.init();

    var contactGrid = new Ext.grid.EditorGridPanel({
        width: 700,
        height: 300,
        title: 'Company',
        renderTo: 'contact-grid',
        frame: true,
        store: store,
        columns : [
            {header: "ID", width: 40, sortable: true, dataIndex: 'id'},
            {header: "name", width: 100, sortable: true, dataIndex: 'name'},
            {header: "description", width: 100, sortable: true, dataIndex: 'description'}

        ],
        viewConfig : {
            forceFit: true
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 5,
            store: this.store,
            displayInfo: true,
            displayMsg: 'Displaying contact {0} - {1} of {2}',
            emptyMsg: "No contact to display"
        })
    });

    store.load({params:{start:0, limit:5}});
});