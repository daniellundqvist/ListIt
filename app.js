var couchapp = require('couchapp'),
  path = require('path');

ddoc = {
  _id: '_design/app',
  rewrites: [{
    from: "/",
    to: 'index.html'
  }, {
    from: "/api",
    to: '../../'
  }, {
    from: "/api/*",
    to: '../../*'
  }, {
    from: "/*",
    to: '*'
  }]
};

ddoc.views = {
  alldocs: {
    map: function (doc) {
      if (doc._id !== "_design/app") {
        emit(doc._id, doc);
      }
    }
  },
  shoppingitem: {
    map: function (doc) {
      if (doc.name !== undefined) {
        emit(doc.name, doc);
      }
    }
  },
  created: {
    map: function (doc) {
      if (doc.dateCreated !== undefined) {
        emit(doc.dateCreated, doc);
      }
    }
  }
};

ddoc.lists = {
  shoppingitems: function (head, req) {
    var row, output = [];
    while (row = getRow()) {
      output.push(row.value);
    }
    send(JSON.stringify(output));
  },
  shoppingitemsname: function (head, req) {
    var row, output = [];
    while (row = getRow()) {
      output.push(row.key);
    }
    send(JSON.stringify(output));
  }
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  }
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;