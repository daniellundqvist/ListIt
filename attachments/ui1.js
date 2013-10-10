$(function () {
	var createDate1 = function () {
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth() + 1; //Months are zero based
		var curr_year = d.getFullYear();
		var curr_hour = d.getHours();
		var curr_min = d.getMinutes();
		if (curr_min < 10) {
			curr_min = "0" + curr_min;
		}
		var currentTime = (curr_year + "-" + curr_month + "-" + curr_date + ", " + curr_hour + ":" + curr_min);
		return currentTime;
	};
	var updateList1 = function () {
			couchDb.getList("shoppingitems", "created", function (error, items) {
				if (error === null) {
					var list = $("#list1");
					list.html("");
					var createListItem1 = function (obj) {
							var listItem = $("<li>"),
								listText = $("<span>"),
								deleteItemButton = $("<i>");
							listText.text(obj.name);
							deleteItemButton.addClass("icon-remove");
							deleteItemButton.click(function () {
								couchDb.items.remove(obj, function(error, response){
									updateList1();
								});
							});
							listItem.append(listText);
							listItem.append(deleteItemButton);
							return listItem;
						};
					for (var i = 0; i < items.length; i = i + 1) {
						if (items[i].list === 1) {
							list.prepend(createListItem1(items[i]));
						}
					}
				}
			});
		};
	$("#addButton1").click(function () {
		var obj = {};
		obj.name = $("#input1").val();
		obj.list = 1;
		obj.dateCreated = createDate1();
		$("#input1").val("");
		couchDb.items.create(obj, function (error, response) {
			if (error === null) {
				updateList1();
			}
		});
	});
	/* setInterval(function(){
		updateList();
	}, 3000); */
	updateList1();
});
