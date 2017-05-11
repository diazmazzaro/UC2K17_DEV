window.onload = function(){
	$('#btn-credito').on('click', function(){
		$(".modal-body").empty();
		$(".modal-header").empty();
		$(".modal-body").load("./partials/pagos_con_tarjeta.html"); 
		$(".modal-header").html('<h2>Pago Online con Tarjeta de Crédito/Débito</h2>');
	});
	$('#btn-bancaria').on('click', function(){
		$(".modal-body").empty();
		$(".modal-header").empty();
		$(".modal-body").html('<div class="bancaria">Aeroterra S.A.<br>CTA CTE PESOS 3077-5 099-9<br>SUCURSAL 099<br>CBU 0070099320000003077597<br><br><span class="bancaria-confirm">Recuerde confirmar su transferencia bancaria enviándonos el comprobante por e-mail <a href="mailto:uc@aeroterra.com">aqui</a></span></div>'); 
		$(".modal-header").html('<h2>Transferencia Bancaria</h2>');
	});
	$('.btn-registrar').on('click', function(){
		$(".modal-body").empty();
		$(".modal-header").empty();
		$(".modal-body").load("./partials/registro_form.html"); 
		$(".modal-header").html('<h2>Formulario de Solicitud de Registros UC2017</h2><p style="font-weight:bolder;">Incluye Sesi&oacute;n Plenaria y Tracks por Industria – 11 de Mayo 2017</p>');
	});
};
