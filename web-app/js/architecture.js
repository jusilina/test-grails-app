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


// Add the additional 'advanced' VTypes
Ext.apply(Ext.form.field.VTypes, {

    mypassword: function (val, field) {
        if (field.initialPassField) {
            var pwd = field.up('form').down('#' + field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    mypasswordText: 'Passwords do not match'
});



var saveForm = function () {
    var form = addObjectPanel.getForm();
    var parentId = Ext.getCmp('mainTree').selModel.selected.items[0].internalId;
    if (form.isValid()) {
        form.submit({
            clientValidation: true,
            url: 'saveObject',
            params: {
                newStatus: 'delivered',
                parent: parentId,
                exist: false
            },
            success: function (form, action) {
                Ext.Msg.alert('Success', action.result.msg);
                store.load();
                Ext.getCmp('mainTree').expand();
                Ext.getCmp('mainTree').enable();
                Ext.getCmp('winAddEdit').close();
                addObjectPanel.getForm().reset();
            },
            failure: function (form, action) {
                Ext.Msg.alert('Failed', action.result.msg);
            }
        });
    }
    console.log(addObjectPanel.getForm().isValid());
}

var showAddWindow = function () {
    console.log();

    var treePanel = Ext.getCmp('mainTree');
    var selectedNode = treePanel.selModel.selected.items;
    var selectedTreeNode


    if (selectedNode.length > 0) {
        selectedTreeNode = selectedNode[0];
        console.log(selectedTreeNode);
    }

    var itemId = selectedTreeNode.internalId.split("_").splice(-1, 1);
    var itemName = selectedTreeNode.data.text;

      var addWin = Ext.getCmp('winAddEdit');
    addObjectPanel.removeAll(false);
    if (itemId == "cmp") {   //add unit
        addWin.setTitle('Add department');
        addObjectPanel.add(addNameField);
        addObjectPanel.add(addDescription);
        displayParent.fieldLabel = 'Company';
        addObjectPanel.add(displayParent);
    }
    else if (itemId == "unt") {      //add project
        addWin.setTitle('Add project');
        addObjectPanel.add(addNameField);
        addObjectPanel.add(addDescription);
        displayParent.fieldLabel = 'Unit';
        addObjectPanel.add(displayParent);
    }
    else if (itemId == "prj") {          //add person
        addWin.setTitle('Add person');
        addObjectPanel.add(addNameField);
        addObjectPanel.add(addSurnameField);

        addObjectPanel.add(addBirthdayField);

        addObjectPanel.add(addPhoneField);
        addObjectPanel.add(addMailField);

        addObjectPanel.add(addLoginNameField);
        //  addPassword.applyEmptyText();
        addObjectPanel.add(addPassword);

        displayParent.fieldLabel = 'Project';
        addObjectPanel.add(displayParent);

    }

    addObjectPanel.add(buttonsPanel);
    buttonsPanel.getComponent('save').setHandler(saveForm)


    Ext.getCmp('mainTree').disable();

    addWin.insert(0, addObjectPanel);
    addWin.show();
    addObjectPanel.getForm().setValues([
        {id: 'parent', value: itemName}
    ]);


}

var closeWindow = function () {
    Ext.getCmp('mainTree').enable();
    Ext.getCmp('winAddEdit').close();

    addObjectPanel.getForm().reset();

}


var updateForm = function () {
    var form = addObjectPanel.getForm();
    var idAndType =  Ext.getCmp('mainTree').selModel.selected.items[0].internalId;
    if (form.isValid()) {
        form.submit({
            clientValidation: true,
            url: 'saveObject',
            params: {
                exist: true,
                newStatus: 'delivered',
                id: idAndType
            },
            success: function (form, action) {
                Ext.Msg.alert('Success', action.result.msg);
                store.load();
                Ext.getCmp('mainTree').expand();
                Ext.getCmp('mainTree').enable();
                Ext.getCmp('winAddEdit').close();
            },
            failure: function (form, action) {
                Ext.Msg.alert('Failed', action.result.msg);
            }
        });
    }
    console.log(addObjectPanel.getForm().isValid());
}

var buttonsPanel = Ext.create('Ext.Container', {

    border: false,
    region: 'south',
    items: [
        {
            xtype: 'button',
            text: 'Save',
            itemId: 'save',
            margin: 5,
            handler: saveForm
        },
        {
            xtype: 'button',
            text: 'Cancel',
            margin: 5,

            handler: closeWindow
        }
    ]
});


var infoCompany = Ext.create('Ext.form.Panel', {

    title: 'Company Information ',
    border: false,
    bodyPadding: 5,

    items: [
        {
            xtype: 'displayfield',
            name: 'title',
            fieldLabel: 'Title'
        },
        {
            xtype: 'displayfield',
            name: 'mail',
            fieldLabel: 'Email'

        },
        {
            xtype: 'displayfield',
            name: 'description',
            fieldLabel: 'Description'
        }
    ]
});

var infoProject = Ext.create('Ext.form.Panel', {

    title: 'Project Information',
    region: 'center',
    border: false,

    items: [
        {
            xtype: 'displayfield',
            name: 'title',
            fieldLabel: 'Title'
        },

        {
            xtype: 'displayfield',
            name: 'description',
            fieldLabel: 'Description'
        }
    ]
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

var addBirthdayField = {
    xtype: 'datefield',
    format: 'd/m/Y',
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
    name: 'mail',
    fieldLabel: 'Email',
    vtype: 'email'

}
var addPhoneField = {
    name: 'phone',
    fieldLabel: 'Mobile phone',
    maxLength: 12

}


var addPassword = Ext.create('Ext.Container', {
    border: false,

    defaults: {
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

    items: [
        {
            minSize: 3,
            id: 'password',
            name: 'password',
            fieldLabel: 'Password'

        },
        {

            fieldLabel: 'Confirm Password',
            vtype: 'mypassword',
            name: 'confpass',
            padding: '-5 0 0 10',
            initialPassField: 'password'
        }
    ]

});

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

var allProjects = Ext.create('Ext.data.Store', {
   // autoLoad: true,
    fields: ['id', 'name'],
    proxy: {
        type: 'ajax',
        url: 'allProjects',

        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

var addPersonToProject = Ext.create('Ext.Container', {
    border: false,

    layout: {
        type: 'hbox'
    },

    items: [   {
         //   displayParent
        xtype: 'displayfield',
    name: 'parent',
     fieldLabel: 'parentName' }
        ,
        {

            xtype: 'combobox' ,
            fieldLabel: 'Add person to other project',
            name: 'otherProject',
            store: allProjects,
            displayField: 'name',
            padding: '0 0 0 10',
            valueField: 'id'

        }
    ]

});

var addObjectPanel = Ext.create('Ext.form.Panel', {
    id: 'addProjectPanel',
    region: 'center',
    border: false,
    bodyPadding: 5,
    //  layout: 'vbox',


    defaultType: 'textfield'

});

var deleteNode = function () {
    var remove = confirm('Do you want to remove object?');
    if (remove) {
        var parentId = Ext.getCmp('mainTree').selModel.selected.items[0].internalId;
        Ext.Ajax.request({
            url: 'removeObject',
            method: 'POST',
            params: {
                parentId: parentId
            },
            success: function () {
                Ext.Msg.alert('success');
                store.load();
            },
            failure: function () {
                Ext.Msg.alert('woops');
            }
        });

    }
}



var showEditWindow = function () {
    console.log();

    var treePanel = Ext.getCmp('mainTree');
    var selectedNode = treePanel.selModel.selected.items;
    var selectedTreeNode


    if (selectedNode.length > 0) {
        selectedTreeNode = selectedNode[0].internalId;
        console.log(selectedTreeNode);
    }

    var itemType = selectedTreeNode.split("_").splice(-1, 1);
 //   var itemId = selectedTreeNode.substring(0, selectedTreeNode.length - 4);

    var addWin = Ext.getCmp('winAddEdit');
    addObjectPanel.removeAll(false);
    if (itemType == "unt") {      //edit unit
        addWin.setTitle('Edit department');
        addObjectPanel.add(addNameField);
        addObjectPanel.add(addDescription);
        displayParent.fieldLabel = 'Company';
        addObjectPanel.add(displayParent);
    }
    else if (itemType == "prj") {          //edit project
        addWin.setTitle('Edit project');
        addObjectPanel.add(addNameField);
        addObjectPanel.add(addDescription);
        displayParent.fieldLabel = 'Department';
        addObjectPanel.add(displayParent);
    }

    else if (itemType == "prs") {   //edit person
        addWin.setTitle('Edit person');
        addObjectPanel.add(addNameField);
        addObjectPanel.add(addSurnameField);

        addObjectPanel.add(addBirthdayField);

        addObjectPanel.add(addMailField);
        addObjectPanel.add(addPhoneField);
        addObjectPanel.add(addLoginNameField);
        //  addPassword.applyEmptyText();
        addObjectPanel.add(addPassword);

        displayParent.fieldLabel = 'Projects';
      //  addObjectPanel.add(displayParent);
        allProjects.load({
            params: {
                prsId: selectedTreeNode
            }
        })
        addObjectPanel.add(addPersonToProject);
    }


    addObjectPanel.add(buttonsPanel);
    buttonsPanel.getComponent('save').setHandler(updateForm)

    Ext.getCmp('addProjectPanel').doLayout();
    addObjectPanel.getForm().load(
        {
            url: 'getInfo',
            params: {
                objectId: selectedTreeNode
            }
        }
    )

    Ext.getCmp('addProjectPanel').update();


    Ext.getCmp('mainTree').disable();

    addWin.insert(0, addObjectPanel);
    addWin.show();

}


var store = Ext.create('Ext.data.TreeStore', {
    id: 'companyTree',
    autoLoad: true,
    root: {
        text: "Companies"
    },
    proxy: {
//        type: 'jsonp',
//        url: 'http://localhost:9999/GrailsApp/company/tree',
        type: 'ajax',
        url: 'tree',

        reader: {
            type: 'json',
            root: 'data'
        }
    }
});


Architecture = function () {
  //  if (!this.addWin) {
        var addWin = new Ext.Window({
            id: 'winAddEdit',
            width: 700,
            maximizable: true,
            region: 'center',
            closable: false,
            closeAction: 'hide',
            layout: 'fit',
            align: 'stretch'
        })
   // }

    var viewInformation = function (s, r) {
        var itemId = r.data.id.split("_").splice(-1, 1);
        Ext.getCmp('infoPanel').remove(0, false);

        var panel;
        if (itemId == "cmp") {
            Ext.getCmp('infoPanel').insert(0, infoCompany);
            panel = infoCompany;
        }
        else if (itemId == "unt") {
            Ext.getCmp('infoPanel').insert(0, infoUnit);
            panel = infoUnit;
        }
        else if (itemId == "prj") {
            Ext.getCmp('infoPanel').insert(0, infoProject);
            panel = infoProject;
        }
        else if (itemId == "prs") {

            Ext.getCmp('infoPanel').insert(0, infoPerson);
            panel = infoPerson;
        }
        if (null == panel) {
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

    var info = Ext.create('Ext.form.Panel', {
        id: 'infoPanel',
        region: 'center'
    });

    var infoProject = Ext.create('Ext.form.Panel', {

        title: 'Project Information',
        region: 'center',
        border: false,

        items: [
            {
                xtype: 'displayfield',
                name: 'title',
                fieldLabel: 'Title'
            },
            {
                xtype: 'displayfield',
                name: 'description',
                fieldLabel: 'Description'
            }
        ]
    });


    var infoUnit = Ext.create('Ext.form.Panel', {

        title: 'Department Information ',
        region: 'center',
        border: false,

        items: [
            {
                xtype: 'displayfield',
                name: 'title',
                fieldLabel: 'Title'
            },
            {
                xtype: 'displayfield',
                name: 'description',
                fieldLabel: 'Description'
            }
        ]
    });

    var infoPerson = Ext.create('Ext.form.Panel', {

        title: 'Person Information ',
        region: 'center',
        border: false,

        items: [
            {
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

                items: [
                    {
                        title: 'Contact information',
                        border: false,
                        items: [
                            {
                                xtype: 'displayfield',
                                name: 'mail',
                                fieldLabel: 'Email'
                            },
                            {
                                xtype: 'displayfield',
                                name: 'phone',
                                fieldLabel: 'Phone'

                            }
                        ]
                    },
                    {
                        title: 'Other information',
                        border: false,
                        items: [
                            {
                                xtype: 'displayfield',
                                name: 'birthday',
                                fieldLabel: 'Birthday'
                            }
                        ]
                    }

                ]
            }
        ]
    });

    var tree = Ext.create('Ext.tree.Panel', {
        id: 'mainTree',
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

                itemcontextmenu: function (view, rec, node, index, e) {
//                    node.select();
                    e.stopEvent();

                    var addItem = contextMenu.getComponent('add');
                    var editItem = contextMenu.getComponent('edit');
                    var deleteItem = contextMenu.getComponent('delete');
                    var itemId = node.id.split("_").splice(-1, 1);

                    if (itemId == "cmp") {
                        addItem.setText('Add Department');
                        addItem.setVisible(true);
                        deleteItem.setVisible(false);
                        editItem.setVisible(false);
                    }

                    else if (itemId == "unt") {
                        addItem.setText('Add Project');
                        editItem.setText('Edit Department');
                        deleteItem.setText('Remove Department');
                        addItem.setVisible(true);
                        deleteItem.setVisible(true);
                        editItem.setVisible(true);
                    }
                    else if (itemId == "prj") {
                        addItem.setText('Add Employee');
                        editItem.setText('Edit Project');
                        deleteItem.setText('Remove Project');
                        addItem.setVisible(true);
                        deleteItem.setVisible(true);
                        editItem.setVisible(true);
                    }
                    else if (itemId == "prs") {
                        addItem.setVisible(false);
                        deleteItem.setVisible(true);
                        editItem.setVisible(true);
                        deleteItem.setText('Remove Employee');
                        editItem.setText('Edit Employee');
                    }
                    else {
                        return false;
                    }


                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        dockedItems: [
            {
                xtype: 'toolbar',
                items: [
                    {
                        text: 'Expand All',
                        handler: function () {
                            tree.expandAll();
                        }
                    },
                    {
                        text: 'Collapse All',
                        handler: function () {
                            tree.collapseAll();
                        }
                    }
                ]
            }
        ]
    });

    var contextMenu = Ext.create('Ext.menu.Menu', {
        plain: true,
        items: [
            {
                itemId: 'add',
                handler: showAddWindow
            },
            {
                itemId: 'edit',
                handler: showEditWindow
            },
            {
                itemId: 'delete',
                handler: deleteNode
            }
        ]
    });


    Ext.create('Ext.container.Viewport', {
            id: 'mainViewport',

            layout: 'border',

            items: [
                tree,
                info
            ]
        }
    );
}

Ext.onReady(Architecture);