/*jslint browser:true */
/*global alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
var couchDb = (function () {
	var url = "http://daniellundqvist.cloudant.com/",
		db = "listit/",
		publicApi = {};
	publicApi.getAll = function (callback) {
		request({
			url: url + db + "_all_docs?include_docs=true",
			method: "GET",
			json: true
		}, function (error, response, body) {
			var allObjs = [];
			if (error === null) {
				for (var i = 0; i < body.rows.length; i = i + 1) {
					if (body.rows[i].doc._id !== "_design/app") {
						allObjs.push(body.rows[i].doc);
					}
				}
				callback(null, allObjs);
			}
		});
	};
	publicApi.getList = function (list, view, callback) {
		//gör en get-request till ex: http://localhost:5984/shoppinglist/_design/app/_list/shoppingitemsname/shoppingitem
		request({
			url: url + db + "_design/app/_list/" + list + "/" + view,
			method: "GET",
			json: true
		}, function (error, response, body) {
			var allObjs = [];
			if (error === null) {
				for (var i = 0; i < body.length; i = i + 1) {
						allObjs.push(body[i]);
				}
				callback(null, allObjs);
			}
		});
	};
	publicApi.items = {};
	publicApi.items.get = function (id, callback) {
		request({
			url: url + db + id,
			method: "GET",
			json: true
		}, function (error, response, body) {
			if (error === null) {
				callback(null, body);
			}
		});
	};
	publicApi.items.create = function (obj, callback) {
		request({
			url: url + db,
			method: "POST",
			body: JSON.stringify(obj),
			json: true
		}, function (error, response, body) {
			if (error === null) {
				callback(null, body);
			}
		});
	};
	publicApi.items.update = function (obj, callback) {
		request({
			url: url + db + obj._id,
			method: "PUT",
			body: JSON.stringify(obj),
			json: true
		}, function (error, response, body) {
			if (error === null) {
				callback(null, body);
			}
		});
	};
	publicApi.items.remove = function (obj, callback) {
		request({
			url: url + db + obj._id + "?rev=" + obj._rev,
			method: "DELETE",
			json: true
		}, function (error, response, body) {
			if (error === null) {
				callback(null, body);
			}
		});
	};
	return publicApi;
}());