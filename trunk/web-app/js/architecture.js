/**
 * Created with IntelliJ IDEA.
 * User: jusilina
 * Date: 03.10.13
 * Time: 13:43
 * To change this template use File | Settings | File Templates.
 */
Ext.require([
    'Ext.tree.Panel',
    'Ext.data.*',
    'Ext.layout.container.Border'
]);

//var updateParentValue = function(){
//    var treePanel = Ext.getCmp('mainTree');
//    var selectedNode = treePanel.selModel.selected.items;
//    var selectedTreeNode
//
//
//    if(selectedNode.length > 0)
//    {
//        selectedTreeNode = selectedNode[0].internalId;
//
//    }
//
//
//    var itemName = selectedTreeNode.substring(0, selectedTreeNode.length - 4);
//    addObjectPanel.getForm().setValues([{id:'parent', value: itemName}]);
//}

// Add the additional 'advanced' VTypes
Ext.apply(Ext.form.field.VTypes, {

    mypassword: function(val, field) {
        if (field.initialPassField) {
            var pwd = field.up('form').down('#' + field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    mypasswordText: 'Passwords do not match'
});



var showAddWindow = function(){
    console.log();

        var treePanel = Ext.getCmp('mainTree');
        var selectedNode = treePanel.selModel.selected.items;
         var selectedTreeNode


        if(selectedNode.length > 0)
        {
            selectedTreeNode = selectedNode[0].internalId;
            console.log(selectedTreeNode);
        }

        var itemId = selectedTreeNode.split("_").splice(-1, 1);
        var itemName = selectedTreeNode.substring(0, selectedTreeNode.length - 4);

        if (!this.addWin)
        {
            this.addWin = new Ext.Window({
                id: 'winAdd',
               width:700,
//                height:300,
                maximizable:true,
                region: 'center',
                closable: false,
                closeAction: 'hide',
                // title: 'Add',
                layout:'fit',
                align: 'stretch'
            })
        }

         addObjectPanel.removeAll(false);
        if (itemId=="cmp") {   //add unit
             this.addWin.title = 'Add department';
            addObjectPanel.add(addNameField);
            addObjectPanel.add(addDescription);
            displayParent.fieldLabel = 'Company';
            addObjectPanel.add(displayParent);
        }
        else if (itemId=="unt") {      //add project
            this.addWin.title = 'Add project';
            addObjectPanel.add(addNameField);
            addObjectPanel.add(addDescription);
            displayParent.fieldLabel = 'Unit';
            addObjectPanel.add(displayParent);
        }
        else if (itemId=="prj") {          //add person
            this.addWin.title = 'Add person';
            addObjectPanel.add(addNameField);
            addObjectPanel.add (addSurnameField);

            addObjectPanel.add (addBithdayField);

            addObjectPanel.add(addMailField);
            addObjectPanel.add(addLoginNameField);
          //  addPassword.applyEmptyText();
            addObjectPanel.add(addPassword);

            displayParent.fieldLabel = 'Project';
            addObjectPanel.add(displayParent);

        }
//        else if (itemId=="prs") {
//
//        }

        addObjectPanel.add(buttonsPanel) ;

        Ext.getCmp('mainTree').disable();

//        else if (this.win.disabled)
//        {
//            this.win.enable();
//        }


    this.addWin.insert(0,addObjectPanel);
    this.addWin.show();
    addObjectPanel.getForm().setValues([{id:'parent', value: itemName}]);


}

var closeWindow = function(){
    Ext.getCmp('mainTree').enable();
    Ext.getCmp('winAdd').close();

}

var buttonsPanel = Ext.create('Ext.Container', {

    border: false,
    region: 'south',

    items: [{
        xtype: 'button',
        text: 'Save',
        margin: 5,


        handler: function() {
            var form = addObjectPanel.getForm();
            var parentId =  Ext.getCmp('mainTree').selModel.selected.items[0].internalId;
            if(form.isValid())
            {
                 form.submit({
                     clientValidation: true,
                     url: 'saveObject',
                     params: {
                         newStatus: 'delivered',
                         parent: parentId
                     },
                     success: function(form, action){
                     //  closeWindow;
                         Ext.Msg.alert('Success', action.result.msg);
                         store.load();
                         Ext.getCmp('mainTree').expand();
                         Ext.getCmp('mainTree').enable();
                         Ext.getCmp('winAdd').close();
                     }
                     ,
                     failure: function(form, action) {
                         Ext.Msg.alert('Failed', action.result.msg);
                     }


                 });


            }


//            panel.getForm().load(
//                {
//                    url: 'getInfo',
//                    params: {
//                        objectId: r.data.id
//                    }
//
//                }
//            )
            console.log(addObjectPanel.getForm().isValid());
        }
    },{
        xtype: 'button',
        text: 'Cancel',
        margin: 5,

        handler: closeWindow
    }]
});



var infoCompany = Ext.create('Ext.form.Panel',{

    title: 'Company Information ',
    border: false,
    bodyPadding: 5,

    items: [{
        xtype: 'displayfield',
        name: 'title',
        fieldLabel: 'Title'
    },
        {
            xtype: 'displayfield',
            name: 'email',
            fieldLabel: 'Email'

        },
        {
            xtype: 'displayfield',
            name: 'description',
            fieldLabel: 'Description'
        }]
});

var infoProject = Ext.create('Ext.form.Panel',{

    title: 'Project Information',
    region: 'center',
    border: false,

    items: [{
        xtype: 'displayfield',
        name: 'title',
        fieldLabel: 'Title'
    },

        {
            xtype: 'displayfield',
            name: 'description',
            fieldLabel: 'Description'
        }]
});
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

var addNameField = {
    name: 'title',
    fieldLabel: 'Name',
    afterLabelTextTpl: required,
    allowBlank: false,
    tooltip: 'Enter the name'
}

var addSurnameField = {
    name: 'surname',
    fieldLabel: 'Surname',
    afterLabelTextTpl: required,
    allowBlank: false,
    tooltip: 'Enter the surname'
}

var addBithdayField = {
    xtype: 'datefield',
    name: 'birthday',
    fieldLabel: 'Date of birth'
}

var addLoginNameField = {
    name: 'loginName',
    fieldLabel: 'Login name',
    afterLabelTextTpl: required,
    allowBlank: false
}

var addMailField = {
    name: 'email',
    fieldLabel: 'Email',
    vtype:'email'

}
var addMailField = {
    name: 'phone',
    fieldLabel: 'Mobile phone',
    maxSize: 12
}




var addPassword = Ext.create('Ext.Container', {

    //frame: true,
    border: false,
//    fieldDefaults: {
//        labelWidth: 125,
//        msgTarget: 'side',
//        autoFitErrors: false
//    },
    defaults:{
        inputType: 'password',
        afterLabelTextTpl: required,
        allowBlank: false,
        minLength: 3,
        emptyText: "********",
        xtype: 'textfield'
    },
    layout: {
        type: 'hbox'
    },

    items: [{
        minSize: 3,
        id: 'pass',
        name: 'pass',
        fieldLabel: 'Password'

    },{
        fieldLabel: 'Confirm Password',
        vtype: 'mypassword',
        initialPassField: 'pass'
    }]

});

var addPhoneField = {
    name: 'phone',
    fieldLabel: 'Phone',
    vtype:'email'

}

var addDescription = {
    xtype: 'textarea',
    name: 'description',
    fieldLabel: 'Description'
}

var displayParent = {
    xtype: 'displayfield',
    name: 'parent'
   // fieldLabel: 'parentName'
}

var addObjectPanel = Ext.create('Ext.form.Panel',{
    id: 'addProjectPanel',
    region: 'center',
    border: false,
    bodyPadding: 5,
  //  layout: 'vbox',


    defaultType: 'textfield'
//    listeners:
//    {
//        reset: updateParentValue
//    }
//    items: [{   name: 'title',
//        fieldLabel: 'Name',
//        afterLabelTextTpl: required,
//        allowBlank: false,
//        tooltip: 'Enter the name of project'},
//        addDescription,
//        displayParent
//    ]
});









var showEditWindow = function(){
    console.log();
    if(!win){
        var treePanel = Ext.getCmp('mainTree');
        var selectedNode = treePanel.selModel.selected.items;
        if(selectedNode.length > 0)
        {
            var node = selectedNode[0];
            console.log(node.internalId);
        }

        Ext.getCmp('mainViewport').disable();
        var win = new Ext.Window({
            width:1000,
            height:300,

            title: 'Edit',
            // html:'<h1>Тут размещается код HTML ${node}</h2>',
            layout:'fit',
            bodyStyle:{'background-color': '#FFFFFF'},
            items: [
//                infoCompany
                ],
            listeners:{
                close:function(){
                    Ext.getCmp('mainViewport').enable();
                }
            }
        })
    }
    win.show();
}


var store = Ext.create('Ext.data.TreeStore', {
    //model: 'MyCompany',
    id: 'companyTree',
    autoLoad: true,
    root:{
        text: "Companies"
    },
    proxy:{
//        type: 'jsonp',
//        url: 'http://localhost:9999/GrailsApp/company/tree',
        type: 'ajax',
        url: 'tree',

        reader:{
            type:'json',
            root: 'data'
        }
    }


});


Architecture = function(){

    var viewInformation = function(s,r)
    {
        var itemId = r.data.id.split("_").splice(-1, 1);
        Ext.getCmp('infoPanel').remove(0, false);

        var panel;
        if (itemId=="cmp") {
            Ext.getCmp('infoPanel').insert(0,infoCompany);
            panel = infoCompany;
        }
        else if (itemId=="unt") {
            Ext.getCmp('infoPanel').insert(0,infoUnit);
            panel = infoUnit;
        }
        else if (itemId=="prj") {
            Ext.getCmp('infoPanel').insert(0,infoProject);
            panel = infoProject;
        }
        else if (itemId=="prs") {

            Ext.getCmp('infoPanel').insert(0,infoPerson);
            panel = infoPerson;
        }
        if (null == panel)
        {
            return
        }

        Ext.getCmp('infoPanel').doLayout();
        panel.getForm().load(
            {
                url: 'getInfo',
                params: {
                    objectId: r.data.id
                }

            }
        )

        Ext.getCmp('infoPanel').update();
    }


   // store.load();
//
    Ext.define('MyCompany',{extend: 'Ext.data.Model',
    fields:['id','name']

    });


    var info = Ext.create('Ext.form.Panel',{
        id:'infoPanel',
        region: 'center'
    });


    var infoProject = Ext.create('Ext.form.Panel',{

        title: 'Project Information',
        region: 'center',
        border: false,

        items: [{
            xtype: 'displayfield',
            name: 'title',
            fieldLabel: 'Title'
        },
            {
                xtype: 'displayfield',
                name: 'description',
                fieldLabel: 'Description'
            }]
    });


    var infoUnit = Ext.create('Ext.form.Panel',{

        title: 'Department Information ',
        region: 'center',
        border: false,

        items: [{
            xtype: 'displayfield',
            name: 'title',
            fieldLabel: 'Title'
        },
            {
                xtype: 'displayfield',
                name: 'description',
                fieldLabel: 'Description'
            }]
    });

    var infoPerson = Ext.create('Ext.form.Panel',{

        title: 'Person Information ',
        region: 'center',
        border: false,

        items: [{
            xtype: 'displayfield',
            name: 'title',
            fieldLabel: 'Name'
        },
            {
                xtype: 'displayfield',
                name: 'surname',
                fieldLabel: 'Surname'
            },

            {
                xtype: 'displayfield',
                name: 'loginName',
                fieldLabel: 'Login name'

            },
            {
                xtype: 'tabpanel',
                border: false,

                items:[
                    {
                        title: 'Contact information',
                        border: false,
                        items: [{
                            xtype: 'displayfield',
                            name: 'email',
                            fieldLabel: 'Email'
                        },
                         {
                             xtype: 'displayfield',
                             name: 'phone',
                             fieldLabel: 'Phone'

                         }]
                    },
                    {
                        title: 'Other information',
                        border: false,
                        items: [{
                            xtype: 'displayfield',
                            name: 'birthday',
                            fieldLabel: 'Birthday'
                        }]
                    }

                ]
            }
            ]
    });

    var tree = Ext.create('Ext.tree.Panel', {
        id:'mainTree',
       store: store,
//        root: data1,
        viewConfig: {
            plugins: {
                ptype: 'treeviewdragdrop'
            }
        },
        height: 300,
        width: 250,
        split: true, //можно двигать ширину
        region: 'west',
        collapsible: true,  //сворачивание
        title: 'Navigation',
        useArrows: true,
        viewConfig: {
            stripeRows: true,
            listeners: {

                itemclick: {
                   fn: viewInformation
                },

                itemcontextmenu: function(view, rec, node, index, e) {
//                    node.select();
                    e.stopEvent();

                    var addItem = contextMenu.getComponent('add');
                    var editItem = contextMenu.getComponent('edit');
                    var deleteItem = contextMenu.getComponent('delete');
                    var itemId = node.id.split("_").splice(-1, 1);

                    if (itemId=="cmp") {
                        addItem.setText('Add Department');
                        addItem.setVisible(true);
                        deleteItem.setVisible(false);
                        editItem.setVisible(false);
//                        editItem.setHandler(showWindow);
                    }

                    else if (itemId=="unt") {
                        addItem.setText('Add Project');
                        editItem.setText('Edit Department');
                        deleteItem.setText('Remove Department');
                        addItem.setVisible(true);
                        deleteItem.setVisible(true);
                        editItem.setVisible(true);
                   }
                   else if (itemId=="prj") {
                        addItem.setText('Add Employee');
                        editItem.setText('Edit Project');
                        deleteItem.setText('Remove Project');
                        addItem.setVisible(true);
                        deleteItem.setVisible(true);
                        editItem.setVisible(true);
                    }
                    else if (itemId=="prs") {
                        addItem.setVisible(false);
                        deleteItem.setVisible(true);
                        editItem.setVisible(true);
                        deleteItem.setText('Remove Employee');
                        editItem.setText('Edit Employee');
                    }
                    else
                    {
                        return false;
                    }


                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        dockedItems: [{
            xtype: 'toolbar',
            items: [{
                text: 'Expand All',
                handler: function(){
                    tree.expandAll();
                }
            }, {
                text: 'Collapse All',
                handler: function(){
                    tree.collapseAll();
                }
            }]
        }]
    });


    var contextMenu = Ext.create('Ext.menu.Menu', {
        plain: true,
        items: [{
            itemId: 'add',
            handler: showAddWindow
        },{
            itemId: 'edit',
            handler: showEditWindow
        },{
            itemId: 'delete'
        }]
    });



    Ext.create('Ext.container.Viewport',{
            id: 'mainViewport',

            layout: 'border',

            items : [
                tree,
                info
            ]
    }
    );
}



Ext.onReady(Architecture);