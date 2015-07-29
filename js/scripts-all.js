// JavaScript Document
var host = 'http://'+document.location.hostname+'/filmes/';


function fechar_alert_att(id){
	$("#alert_atualizacao_"+id).fadeOut(300);
	setTimeout( function(){ 
		$("#alert_atualizacao_"+id).remove();
	}, 300);
}


function add_lista(id){
	$("#add_lista_"+id).fadeOut(0);
	$("#remover_lista_"+id).fadeIn(0);
	$.post(host+"php/add_lista.php",{id:id},function(retorno){
		if(retorno==-1){
			alert('Você precisa estar logado');
		}else{
			$('#alertas').append(retorno);
			
			setTimeout( function(){ 
				fechar_alert_att(id);
			}, 6000);
			
		}
	});
}

function remover_lista(id){
	$("#add_lista_"+id).fadeIn(0);
	$("#remover_lista_"+id).fadeOut(0);
	$.post(host+"php/add_lista.php",{id:id},function(retorno){
		if(retorno==-1){
			alert('Você precisa estar logado');
		}else{
			$('#alertas').append(retorno);
			
			setTimeout( function(){ 
				fechar_alert_att(id);
			}, 6000);
			
		}
	});
}

$(function(){
	
	
	//ajustar conteudo pelo tamanho da tela----------------------------------------------
	resize();
	window.onresize = function(){
		resize();
	}
	
	function resize(){	
		var largura_pg = $(window).width();
		if(largura_pg>=2000){
			$('#ct_filmes').css({'width':'2000px'});
		}else if(largura_pg>=1800){
			$('#ct_filmes').css({'width':'1800px'});
		}else if(largura_pg>=1600){
			$('#ct_filmes').css({'width':'1600px'});
		}else if(largura_pg>=1400){
			$('#ct_filmes').css({'width':'1400px'});
		}else if(largura_pg>=1200){
			$('#ct_filmes').css({'width':'1200px'});
		}else{
			$('#ct_filmes').css({'width':'1000px'});
		}
		
		if(largura_pg<1000){
			$('header').css({'position':'absolute'});
		}else{
			$('header').css({'position':'fixed'});
		}
	}
	
	
	
	//menu perfil
	$(window).scroll(function () {
		var largura_pg = $(window).width();
		if(largura_pg>=1000){
			if ($(this).scrollTop() > 180) {
				$("#menu_perfil").addClass('perfil-menu-fix');
			} else {
				$("#menu_perfil").removeClass('perfil-menu-fix');
			}
			
			if ($(this).scrollTop() > 180) {
				$("#att_right").addClass('att-right-fix');
			} else {
				$("#att_right").removeClass('att-right-fix');
			}
		}
	});
	
	
	
	//mostrar/ocultar form login
	$('#bt-entrar').click(function(){
		if( $('#ct-entrar').is(':visible') ) {
			$("#ct-entrar").slideUp(300);
			$("#bt-entrar").removeClass('login_open');
		}else{
			$("#ct-entrar").slideDown(300);
			$("#bt-entrar").addClass('login_open');
		}
		return false;
	});
	
	//mostrar/ocultar opções top usuario
	$('#foto-profile').click(function(){
		if( $('#op-user').is(':visible') ) {
			$("#op-user").slideUp(300);
		}else{
			$("#op-user").slideDown(300);
		}
		return false;
	});
	
	
	$('body').click(function(){
		$("#op-user").slideUp(300);
	});
	
	
	
	
	
	
	$('li .cover .play').hover(function(){
		if($(this).offset().left < 600){
			$(this).children("#detalhes").removeClass('d-right');
		}else{
			$(this).children("#detalhes").addClass('d-right');
		}
	}, function(){
		return false;
	});
	
	
	
	$('li .play').animate({opacity:.8}, {duration:250})
	$('li .play').hover(
	function(){$(this).stop().animate({opacity:1}, {duration:250})},
	function(){$(this).stop().animate({opacity:.8}, {duration:250})});
	
	
	
	$('#nav-videos li a').click(function(){
		$(this).addClass('atual');
		var qt = $('#nav-videos').attr('value');
		var atual = $(this).attr('name');
		
		for(i=0;i<=qt;i++){
			
			if(i!=atual){
				$('#video'+i).removeClass('atual');
			}
		}
		
		var id = $(this).attr('value');
		
		$.post(host+"php/puxar_video.php",{id:id},function(retorno){
			$("#video").html(retorno);
		});
		return false;
	})
	
	$('#select_tipo_video #sel').click(function(){
		if( $("#options_tipo_video").is(':visible') ) {
			$("#options_tipo_video").slideUp(200);
		}else{
			$("#options_tipo_video").slideDown(200);
		}
		return false;
	})
	
	$('#select_temporadas #sel').click(function(){
		if( $("#options_temporadas").is(':visible') ) {
			$("#options_temporadas").slideUp(200);
		}else{
			$("#options_temporadas").slideDown(200);
		}
		return false;
	})
	
	$('body').click(function(){
		$("#options_tipo_video").slideUp(200);
		$("#options_temporadas").slideUp(200);
		$("#recebe_busca").fadeOut(0);
	})
	
	
	
	//buscar filmes
	$('#buscar_filme').keyup(function(){
		var busca = $(this).val();
		$("#loader_busca").fadeIn(0);
		$.post(host+"php/buscar_filmes.php",{busca:busca},function(retorno){
			$("#recebe_filmes").html(retorno);
			$("#loader_busca").fadeOut(0);
		});
	});
	
	
	$('#buscar_filme').click(function(){
		$("#recebe_busca").fadeIn(100);	
		return false;
	})
	//buscar filmes
	
	
	
	//----reportar erro-------------------------------------------------------
	$('#bt_reportar_erro').click(function(){
		$("#pop_reportar_erro").fadeIn(150);	
	})
	
	$('#bt_fechar_reportar_erro').click(function(){
		$("#pop_reportar_erro").fadeOut(150);	
	})
	//----reportar erro-------------------------------------------------------
	
	//----pop alterar foto perfil-------------------------------------------------------
	
	function pop_alterar_foto_perfil(){
		$("#pop_foto_perfil").fadeIn(150);	
		$('body').css('overflow','hidden');
		$('#pop_foto_perfil').css('overflow','auto');
		$('#bts_at_f_p').fadeOut(0);
		$('#bt_cancelar_foto_perfil').fadeIn(0);
		return false;
	}
	
	$('#pop_alterar_foto_perfil').click(function(){
		pop_alterar_foto_perfil();
	})
	
	function fechar_alterar_foto_perfil(){
		$("#pop_foto_perfil").fadeOut(150);	
		$('body').css('overflow','auto');	
		return false;
	}
	
	$('#bt_fechar_foto_perfil').click(function(){
		fechar_alterar_foto_perfil();
	})
	
	$('#bt_cancelar_foto_perfil').click(function(){
		fechar_alterar_foto_perfil();
	})
	//----reportar erro-------------------------------------------------------
	
})