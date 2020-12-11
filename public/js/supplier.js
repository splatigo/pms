var adata={}
$(function () {
	get_defaults()
	$(".a-dashboard").click(function () {
		$(".cd").hide()
		get_defaults()
	})
	$(".a-profile").click(function(){
		$("#profile-div").modal("show")
	})
	
})

function get_defaults() {
	var data={url:"/supplier",rq:"get-defaults"}
	ajax_go(data,function (rst) {
		adata.settings=rst.settings
		adata.user=rst.user;
		$("#my-name").text(" "+rst.me.business_name)
		$("#business-name").text(rst.me.business_name)
		$(".user-li").show()
		var mygroups=rst.mygroups;
		load_supply_orders_sum(rst.supply_orders_sum)
		$(".cd").hide()
		$("#dashboard").show()
	})
}

function load_supply_orders_sum(stock_sum) {
	$("#db-supply-orders-out-for-delivery").html("0 Orders<hr> 0 Chicks<hr>UGX 0")
	$("#db-supply-orders-delivered").html("0 Orders<hr>0 Chicks <hr>UGX 0")
	for(var i=0;i<stock_sum.length;i++){
		var amount=cx(stock_sum[i].amount)
		var qty=cx(stock_sum[i].qty)
		var no=stock_sum[i].no
		if(stock_sum[i].status=="Out for Delivery")
			$("#db-supply-orders-out-for-delivery").html(no+" Orders <hr>"+qty+" Chicks <hr>UGX "+ amount)
		if(stock_sum[i].status=="Delivered")
			$("#db-supply-orders-delivered").html(no+" Orders <hr>"+qty+" Chicks  <hr>UGX "+ amount)
	}
}
function change_supply_orders_status(status) {
	var oid=[];var k=0; //order id ; oid
	$(".supply-orders-status-cb").each(function () {
		var val=$(this).val()
		if(this.checked==true){
			oid[k++]=val;
		}	
	})
	if(oid.length==0)
		return display_err("No order item selected",5000)
	var data={url:"/supplier",rq:"change-supply-order-status",status:status,oid:oid}
	if(status=="Out for Delivery"){
		return $("#assign-supplier-div").modal("show")
	}
	ajax_go(data,function (rst) {
		var orders=rst.orders;
		if(data.status=="Out for Delivery")
			xstatus="Pending Orders"
		else
			xstatus="Delivered"
		$("#supply-orders-curr-status").text(" "+xstatus)
		load_supply_orders(orders,status)
	})

	
}
function view_supply_orders(status){
	var data={url:"/supplier",rq:"get-supply-orders",status:status}
	ajax_go(data,function (rst) {
		if(data.status=="Out for Delivery")
			xstatus="Pending Orders"
		else
			xstatus="Delivered"
		$("#supply-orders-curr-status").text(" "+xstatus)
		var orders=rst.orders;
		load_supply_orders(orders,status)
		
	})
}
function load_supply_orders(orders,status) {
	$(".cd").hide()
	$("#supply-orders-div").show()
	if(orders.length==0){
		$("#supply-orders-table").hide()
		$("#no-supply-orders").show()
		$("#chx-status-btn").hide()
	}
	else{
		$("#no-supply-orders").hide()
		$("#supply-orders-table").show()
		$("#chx-status-btn").show()
	}
	if(status=="Delivered"){
		$("#chx-status-btn").hide()
	}
	var tr="<thead><tr><th></th><th>Order No.</th> <th>Group</th> <th>Customer</th><th>Contact</th><th>Quantity</th><th>Amount</th><th>Ordered on</th></tr></thead><tbody>"
	for(var i=0;i<orders.length;i++){
		var order_no=orders[i].order_no
		var id=orders[i].id;
		var group_name=orders[i].group_name
		var qty=orders[i].qty
		var amount=orders[i].amount;
		order_time=orders[i].order_time;
		var member_name=orders[i].member_name;
		var member_phone=orders[i].member_phone
		tr+="<tr><td><input type='checkbox' value="+id+" class='tb supply-orders-status-cb'></td></td> <td>"+order_no+"</td> <td>"+group_name+"</td><td>"+member_name+"</td> <td>"+member_phone+"</td><td>"+qty+" Chicks</td><td>"+cx(amount)+"</td><td>"+order_time+"</td></tr>"
	}
	tr+="</tbody>"
	$("#supply-orders-table").html(tr)
}
