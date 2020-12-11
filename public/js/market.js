var adata={}
$(function () {
	
	$(".my-orders").click(function () {
		var data={rq:"get-orders",url:"/market"}
		ajax_go(data,function (rst) {
			load_orders(rst.orders)
		})
	})
	$("#pay-method").change(function () {
		var pm=$("#pay-method").val()
		$(".po").hide()
		$(".mp-label").attr("class","col-md-2 mp-label")
		$(".mp-div").attr("class","col-md-4 mp-div")
		if(pm=="transpay")
			$(".tp-po").show();//transpay payment option
		else if(pm=="mobile-money")
			$(".mm-po").show();//mobile money 
		else{
			$(".mp-label").show()
			$(".mp-div").attr("class","col-md-10 mp-div")
			$(".mp-label").attr("class","col-md-2 mp-label")
		}
	})
	$("#purchase-btn").click(function () {
		var total=$("#total").val()
		var qty=$("#qty").val()
		var data={rq:"make-purchase",url:"/market"}
		data.total=total.split(",").join("");
		data.qty=qty;
		data.method=$("#pay-method").val()
		var arr=[{fn:"Quantity",val:qty},{fn:"Payment Method",val:data.method,ft:"sel"}]
		if(data.method=="transpay"){
			transpayid=$("#transpay-id").val()
			data.transpayid=transpayid
			var pmethod="Transpay"
			arr[2]={fn:"Transpay ID",val:transpayid}
			$("#phone-op").hide()
			$("#transpay-id-op").show()
			$("#confirm-transpay-id").text(transpayid)
		}
		else{
			mmphone=$("#mm-phone").val()
			data.mmphone=mmphone
			var pmethod="Mobile Money"
			arr[2]={fn:"Mobile Number",val:mmphone}
			$("#phone-op").show()
			$("#transpay-id-op").hide()
			$("#confirm-phone").text(mmphone)
		}

		var vr=check_empty(arr);//verification result
		if(qty<=0)
			return display_err("Enter a Quantity value more than 1")
		if(!vr)
			return 0;
		if(data.method=="mobile-money"){
			vr=validate_phone(mmphone)
			if(!vr)
				return 0;
		}
		$("#confirm-qty").text(qty+" Trays")
		$("#confirm-total-cost").text(cx(data.total))
		$("#confirm-pay-method").text(pmethod)

		$("#confirm-payment-div").modal("show")
		adata.data=data;
		return 0
		
	})
	$("#confirm-payment-btn").click(function () {
		var data=adata.data;
		data.return=1
		ajax_go(data,function (rst) {
			if(!rst.errmsg){
				$("#total,#qty,#mm-phone,#transpay-id").val("")
				$("#pay-method").val(0)
				display_succ("Order placed and payment made successfully<br>")
			}
			var instock=rst.instock;
			$("#no-instock").text(instock)
			$("#confirm-payment-div").modal("hide")
		})
	})
	$(".a-make-purchase").click(function () {
		$(".cd").hide()
		$("#instock-div").show()
	})

	$(".view-cart").click(function () {
		var cart=adata.cart;
		if(!cart)
			return 0;
		var tr="<tr><th></th><th>#</th> <th>Qty</th><th>Price</th><th>Total</th> <th>Supplier</th> <th>Address</th></tr>"
		for(var i=0;i<cart.length;i++){
			var price=cart[i].price;
			var cqty=cart[i].cqty
			var total=price*cqty
			var group_id=cart[i].group_id
			tr+="<tr><td><button class='btn btn-danger' onclick='add_to_cart("+group_id+")'><span class='fa fa-trash-o'></span></button></td><td>"+(i+1)+"</td><td> <input style='width:50px' class='form-control' value='"+cqty+"' onkeyup='update_cart("+group_id+",this)'></td><td>"+cx(price)+"</td><td>"+cx(total)+"</td><td>"+cart[i].group_name+"</td><td>"+cart[i].district+", "+cart[i].subcounty+"</td></tr>"
		}
		$("#cart-table").html(tr)
		$("#cart-div").modal("show")
	})
	get_defaults()
	

})

function compute_tcost(el) {
	var val=check_whole_number(el,4)
	var price=adata.price;
	var total=val*price
	$("#total").val(cx(total))

}
function get_defaults() {
	// body...
	var data={rq:"get-defaults",url:"/market"}
	ajax_go(data,function (rst) {
		var mygroups=rst.mygroups;
		load_mygroups(mygroups)
		var instock=rst.instock;
		$("#no-instock").text(instock)
		$("#price-per-tray").val(cx(rst.price*30))
		$("#confirm-price").text(cx(rst.price*30))
		$("#my-name").text(" "+rst.me.name)
		$(".user-li").show()
		if(rst.me.priv=="admin")
			$("#li-admin").show()
		else
			$("#li-admin").hide()
		adata.price=rst.price*30;
		
	})
}
function load_orders(orders) {
	$(".cd").hide()
	$("#orders-div").show()
	if(orders.length==0){
		$("#orders-table").hide()
		$("#no-orders").show()
		return 0
	}
	else{
		$("#orders-table").show()
		$("#no-oders").hide()
	}

	var tbo=[{th:"Order No",key:"order_no"},{th:"Qty",key:"trays"},{th:"Amount",key:"amount",ft:"money"},{th:"Payment Type",key:"method",ft:"FL"},{th:"Order Status",key:"status"},{th:"Order Time",key:"order_time"}]
	create_table(orders,tbo,"orders-table",1)

	
}
function create_table(arr,flds,tbid,serial) {
	var th=""
	if(serial)
		th="<th>#</th>"

	for(var i=0;i<flds.length;i++){
		
			th+="<th>"+flds[i].th+"</th>"
	}
	var thead="<thead><tr>"+th+"</tr></thead>"

	var tr=thead+"<tbody>"
	for(var i=0;i<arr.length;i++){
		if(serial)
			tr+="<tr><td>"+(i+1)+"</td>"
		else
			tr+="<tr>"
		for(var j=0;j<flds.length;j++){
			key=flds[j].key
			val=arr[i][key]
			if(flds[j].ft=="money")
				val=cx(val)
			if(flds[j].ft=="FL"){
				if(val=="mobile-money")
					val="Mobile Money"
				else
					val=capitalizeFLetter(val)
			}
			tr+="<td>"+val+"</td>"
		}
		tr+="</tr>"
		
	}

	table=tr+"<tbody>"

	$("#"+tbid).html(table)
}
function load_instock(instock) {
	
	var cl=""
	for(var i=0;i<instock.length;i++){
		dr=""
		if(i%3==0||i==0)
			dr="<div class='row'>"
		cl=dr+cl;
		cl+="<div class='col-sm-4' style='margin-top:10px'>"

		var group_name=instock[i].group_name
		var address=instock[i].district+", "+instock[i].subcounty
		var stock=instock[i].stock;
		var orders=instock[i].orders
		var price=instock[i].price
		var group_id=instock[i].group_id
		if(orders==null){
			orders=0
			
		}
		qty=stock-orders;
		instock[i].qty=qty
		cl+="<div class='card' style=';text-align:center'> <div class='card-header  text-white bg-primary '> <h5> <i class='fa fa-codepen'></i> "+qty+" Trays</h5></div><div class='card-body'><h5 class='card-title'> UGX "+cx(price)+" per tray</h5><p><i class='fa fa-group'></i> "+group_name+"</p><p><i class='fa fa-map-marker'></i> "+address+"</p><button class='btn btn-primary' ><input style='width:50px;text-align:center;display:none' value="+qty+" id='cart-qty-"+group_id+"' onkeyup='update_cart("+group_id+",this)'> <span onclick='add_to_cart("+group_id+")'><span id='cart-txt-"+group_id+"'><i class='fa fa-cart-plus'></i> Add to Cart</span> </span></button></div></div></div>"
		
	}
	adata.instock=instock
	$("#instock-div").html(cl)
}
function update_cart(group_id,el) {
	val=el.value;
	for(var i=0;i<adata.instock.length;i++){
		if(adata.instock[i].group_id==group_id){
			var stock=adata.instock[i]
			break
		}
	}
	var cart=adata.cart
	if(cart){
		var cqty=0
		for(var k=0;k<cart.length;k++){
			
			if(cart[k].group_id==group_id){

				if(val>cart[k].qty)
					{
						el.value=cart[k].cqty
					}
				else
					cart[k].cqty=val
				
			}
			cqty+=Number(cart[k].cqty)

		}
	}
	adata.cqty=Number(cqty)
	if(adata.cqty)
		$("#cart-badge").text(adata.cqty)
	else
		$("#cart-badge").text("")
	adata.cart=cart;
	
}
function add_to_cart(group_id) {
	for(var i=0;i<adata.instock.length;i++){
		if(adata.instock[i].group_id==group_id){
			var stock=adata.instock[i]
			break
		}
	}
	var cqty=$("#cart-qty-"+group_id).val()
	stock.cqty=cqty;
	var cart=adata.cart;
	
	var rm=0
	if(!cart||cart.length==0){
		var ncart=[stock]
		adata.cqty=0
	}
	else{
		var ncart=[]
		var n=0;
		var rm=0

		for(var k=0;k<cart.length;k++){
			cart[k].rm=0
			if(cart[k].group_id==group_id){
				rm=1
				cart[k].rm=1
			}
			
		}
		if(rm==0)
		{
			//added to stock
			ncart=cart;
			ncart[cart.length]=stock
			
		}
		else{
			
			//removed from stock
			for(var k=0;k<cart.length;k++){
				if(cart[k].rm==0)
					ncart[n++]=cart[k]
			}
		}
	}
	adata.cart=ncart;
	
	if(rm){
		$("#cart-qty-"+group_id).hide()
		$("#cart-txt-"+group_id).html("<i class='fa fa-trash-o'></i> Add to Cart</span>")
		adata.cqty=adata.cqty-cqty;
	}
	else{
		$("#cart-qty-"+group_id).show()
		$("#cart-txt-"+group_id).html("<i class='fa fa-trash-o'></i> Remove from Cart</span>")

		adata.cqty=adata.cqty+Number(cqty);
	}
	if(adata.cqty)
		$("#cart-badge").text(adata.cqty)
	else
		$("#cart-badge").text("")
	
}

