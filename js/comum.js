var countTrilhos = 0;
var timeBoxLogin = 0;

function selecionarMenuCorrente() {
    var url = window.location.pathname;
    var menuSelecionou = false;
    if (!menuSelecionou) {
        // links que são equivalentes a url corrente
        var links = '.cabecalho .menu .acao[href="' + url + '"]';
        var sublinks = '.cabecalho .menu .link[href="' + url + '"]';
        $(links + ', ' + sublinks).each(function() {
            if (!menuSelecionou) {
                $(this).parents('.unidade').addClass('selecionado');
                menuSelecionou = true;
                return;
            }
        });
    }
}

function abre_pop_login(pop_url){
    $("#modal_exclusivo").hide()
    if(pop_url){
        url = pop_url;
    }else{
        url = login_url;
    }

    if ($.browser.msie) {
        var left  = ($(window).width()/2)-(830/2),
            top   = ($(window).height()/2)-(555/2),
            popup = window.open(url, 'popup', 'width=830, height=555, top='+top+', left='+left+', directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no');
    }else{
        $('#modal_lightboxlogin iframe').remove();
        $('#modal_lightboxlogin .LightboxLogin').append('<iframe src='+url+' height="555" width="830" style="border:0;"> </iframe>');
        $('#modal_lightboxlogin').show();
    };

    // data de abertura do pop up de login
    var t1_login = new Date();
    sessionStorage.setItem('t1_login', t1_login.getTime());
    // alert(sessionStorage.t1_login);

    return false;
}

function retorna_status_usuario(){
    $.ajax({
         type : "GET",
         dataType : "jsonp",
         url : OAUTH_AUTHORIZE_URL+"/oauth/usuario/?access_token="+ATOKEN+"&callback=?", // ?callback=?
         success: function(data){
            // somente no caso de ter excluido o perfil e clicado no "X" na página de configurações
            if(data.usuario.perfil.principal && typeof(OtherProfilesParser) != "undefined" ){
                $("#outros-perfis .perfil:not(.novo)").remove();
                OtherProfilesParser.init();
            }
            if(PERFIL_PEID != data.usuario.perfil.peid){
                //iniciando processo de troca de perfil."
                $.ajax({
                    type: "GET",
                    url: "/troca_perfil/",
                    data: {access: JSON.stringify(data)},
                    dataType: 'json',
                    success: function(data) {
                        if(data.success){
                            window.top.location="/";
                        }
                    }
                });
            }
         }
    });
}

$.fn.extend({
    zebrar: function(opcoes) {
        var padroes, seletor;
        padroes = {
            classeCss: "alternado",
            modo: "par"
        };
        opcoes = $.extend({}, padroes, opcoes);
        seletor = opcoes.modo === "impar" ? ":odd" : ":even";
        $(this).filter(seletor).addClass(opcoes.classeCss);
        return this.each(function() {
            return $(this);
        });
    }
});

$(document).ready(function(){

    //todos os banners de publicidade que tiverem empty.gif vao sumir.
    $("img[src*='empty.gif']").parents("div:first").hide();

    var pathAtivo = document.location.pathname;
    pathAtivo = pathAtivo.slice(1); // remove a barra inicial para evitar bugs crossbrowser
    var splitMenu = pathAtivo.split("/");
    var classeAtiva = splitMenu[1];

    switch(splitMenu[0]) {

        case "":
            $("#menu ul li.pcp.home").addClass("ativo");
            break;

        case "especial":
            $("#menu ul li.pcp.especial").addClass("ativo");
            break;

        case "atores-e-diretores":
            $("#menu ul li.pcp.atores-e-diretores").addClass("ativo");
            break;

        case "generos":
            if($("#menu ul li.pcp."+ classeAtiva).length) {
                $("#menu ul li.pcp."+ classeAtiva).addClass("ativo");
            }else {
                $("#menu ul li.pcp.mais_generos").addClass("ativo");
            }
            break;

    }



    //abrirLoad();
    $("a[rel='modal']").live("click", function(){

        var tamanho = $(this).attr('data-param');

        disparaModalRequest($(this).attr("href"), tamanho);
        return false;
    });


    $("#fechar_lightbox, #close_lightbox, #mask").live("click", function(){
        fechaModal();
        if($(this).parent(".LightboxLogin").length && ATOKEN != "0"){
            retorna_status_usuario();
        }
    });


    $("#BoxLogin .box-usuario .link.user").toggle(function() {
       $(this).parents(".box-usuario").addClass("ativo");
       $("#header").css("z-index","99999");
    },function(){
        $(this).parents(".box-usuario").removeClass("ativo");
        $("#header").removeAttr("style");
    });

    $("#BoxLogin .box-usuario").mouseleave(function(){
        if($(this).is(".ativo")) {
            setTimeout(function(){
                $("#BoxLogin .box-usuario .link.user").trigger("click");
                $("#header").removeAttr("style");
            }, 200)
        }
    });

    $("#menu").hover(function(){
        $(this).css("z-index","99999");
    }, function(){
        $(this).removeAttr("style");
    });

    selecionarMenuCorrente();

    /*
        MUDAR O VALOR DO INPUT
    */

    // VALIDA O CAMPO DE BUSCA

    var buscaInterval = null;

    $("form#FormBuscaSuggest").submit(function(){
        var campo = $("#campo_busca", this).val().length;
        var box = $(".minimo-caracteres", this);

        if($(this).children("#campo_busca").attr('value') == $(this).children("#campo_busca").attr('defaultValue') ){
            return false;
        };

        if(campo < 2) {
            box.show();
            return false;
        }
    });

    // quando termina de digitar valida se o campo tem pelo menos 2 caracteres
    // digitados
    $('#busca input[type="text"]').keyup(function(){
        var boxmin = $(this).parent("form").children(".minimo-caracteres");
        var valorCampo = $(this).val();
        var suggest = $(this).parent("form").children("#auto_suggest");

        if(valorCampo.length >= 2) {
            suggest.html('<p>Carregando...</p>');

            $('#busca input[type="text"]').keydown();

            buscaInterval = setTimeout(function(value){
                // loads filtered films
                $.ajax({
                    type: "GET",
                    url: "/busca/auto/?q=" + escape($.trim(valorCampo)),
                    success: function(html) {$('#auto_suggest').html(html);}
                });
            }, 1000);

            $('#auto_suggest, .icone-suggest').fadeIn("300");
            $('#help_busca').hide();
        }
    });

    $('#busca input[type="text"]').keydown(function(){
        if (buscaInterval != null) {
            clearTimeout(buscaInterval);
            buscaInterval = null;
        }

    // Apenas reseta o valor do campo, caso a string esteja no valor default.
        if( $(this).attr('value') == $(this).attr('defaultValue') ){
        $(this).val('')
    }
    });

    // oculta as divs de suggest e a de dica e volta com o texto original
    // se o usuário não estiver digitado nada.
    $('#busca input[type="text"]').blur( function(){
        var suggest = $(this).parent("form").children("#auto_suggest");
        var boxmin = $(this).parent("form").children(".minimo-caracteres");

        if( $(this).attr('value') == '' ){
            $(this).attr('value', $(this).attr('defaultValue') );
        };

        suggest.fadeOut("300");
        $('.icone-suggest').fadeOut("300");
        boxmin.fadeOut("300");

    } );

    $(document).keyup(function(e) {
      if (e.keyCode == 27 && $('.envoltorio.busca').hasClass('aberto')) {
            $(".fechar-busca-dropdown").click();
      }
    });

    $(".abrir-busca").click(function() {
        $('.envoltorio').hide();
        $('.envoltorio.busca').addClass("aberto").css("margin-top", "-50px").show().animate({"margin-top": "15px"},200);
        $("#campo_busca").val("Encontre filmes, atores e diretores");
    $('#campo_busca').focus()
        $(".mascara-busca").height($(window).outerHeight()).width($(window).outerWidth()).show();
    });

    $('.mascara-busca').click(function() {
        $(".fechar-busca-dropdown").click();
    });

    $(".fechar-busca-dropdown").click(function() {
        $('.envoltorio.busca').animate({"margin-top": "-50px"}, 200);
        setTimeout(function() {
            $('.mascara-busca').hide();
            $('.envoltorio.busca').removeClass('aberto').hide();
            $('.envoltorio').not(".envoltorio.busca").fadeIn(200);
            if ($("#campo_busca").val() != "Encontre filmes, atores e diretores") {
                $("#auto_suggest").hide().html();
                $(".icone-suggest").hide();
                $("#campo_busca").val("").focusout();
            }
            $elemento = $(".menu");

            $elemento.find(".agrupador").each(function() {
                var $agrupador, $unidade, larguraItens, posicaoAcaoEmRelacaoGrupo, posicaoSubmenu, quantidadeItens;
                $agrupador = $(this);
                $unidade = $agrupador.parents(".unidade");

                quantidadeItens = $agrupador.find(".itens").length;
                larguraItens = (quantidadeItens * $agrupador.find(".itens").eq(0).outerWidth()) + (quantidadeItens - 1);
                posicaoAcaoEmRelacaoGrupo = $unidade.find(".acao").offset().left - $elemento.find(".grupo").offset().left;
                posicaoSubmenu = posicaoAcaoEmRelacaoGrupo + larguraItens;

                $agrupador.css({
                    left: -larguraItens/2 + $unidade.find(".acao").position().left +$unidade.outerWidth()/2,
                    top: $unidade.parent().outerHeight() + 10,
                    width: larguraItens
                });
            });
        }, 200);
    });

    $(".menu-area-logada").bind("abrirdropdown", function(e) {
        $(".menu-area-logada .unidade").addClass('sobre');
        $(".menu-area-logada").find(".submenu .agrupador").fadeIn({
            queue: false,
            duration: 500
        }).addClass('bounce');

        $(".menu-area-logada").find(".acao, .agrupador").mouseenter(function() {
            clearTimeout(intervalo);
            $('.menu-area-logada .submenu .agrupador').removeClass('bounce-out').removeClass('bounce');
        });

        var intervalo = setTimeout(function () {
            $(".menu-area-logada").find(".submenu .agrupador").fadeOut({
                queue: false,
                duration: 1000,
                complete: function () {
                    $(".menu-area-logada .unidade").removeClass('sobre');
                    $('.menu-area-logada .submenu .agrupador').removeClass('bounce-out');
                }
            }).addClass('bounce-out').removeClass('bounce');
        },3000);
    });


    $(".menu-abas li a").live('click', function(){
        var url_aba = $(this).attr('href');
        var aba_ativa = $(this);

        $(".menu-abas li a").removeClass('ativo');
        aba_ativa.addClass('ativo');
     });

    $('#conteudo-exclusivo').live('click', function(){
        $('div#lightbox').removeClass('off');
    });

    $("a[rel='static']").live("click", function(){
        var url_static = $(this).attr("href");
        $(".modal_static").hide();
        $("div#"+url_static).show();
        //$('swf, embed, object').hide();
        return false;
    });

    $(".link_login").click(function (){
        //alert("oi");
        if (window.location.pathname.indexOf("filme") >= 0){
            document.cookie="prox=" +window.location.href+ ";path=/";
        };
        abre_pop_login('');
        return false;
    });

    $(".modal_static #mask:not(.lock), .modal_static #fechar_lightbox:not(.lock)").live("click", function(){
       $(".modal_static").fadeTo("normal", 0, function(){
            $(this).hide();
            $(this).removeAttr("style");
            //$('swf, embed, object').show();
        });

    });



    $('#assistir-mais-tarde:not(.ativo)').live("click", function(){
        var url = $(this).attr('data-href');
        $(this).parents(".opcoes-filme").children('.excluir_filme').hide();
        assistirMaisTardeAjax(url, $(this));
    });

    $('#assistir-mais-tarde.ativo').live('click', function(){
        var box = $(this).parents(".opcoes-filme").children('.excluir_filme');
        $(this).parents(".opcoes-filme").children(".msg_filme_adicionado").hide();
        box.fadeTo("normal", 100, function(){
            box.show();
        });
        return false;
    });

    $('.componentesTrilhos .opcoes-filme .excluir_filme .excluir').live('click', function(){
        var url = $(this).attr('data-href');
        excluirFilmeHomeAjax(url, $('#assistir-mais-tarde.ativo'));
        return false;
    });

    $(".msg_padrao .fechar_lightbox_excluir_filme, .msg_padrao a.close").live("click" ,function(){
        $(this).parent(".msg_padrao").fadeTo("normal", 0, function(){
            $(this).hide();
            $(this).removeAttr("style");
        });

    });


    //var alturaListaFooter = $("#footer .lista.first").outerHeight(true);
    var alturaListaFooter = 0;
    $('#footer .lista').each(function(index) {
        var alturaListaFooterTemp = $(this).outerHeight(true);
        if (alturaListaFooterTemp > alturaListaFooter)
            alturaListaFooter = alturaListaFooterTemp
    });
    $("#footer .lista").height(alturaListaFooter);

    fechaAlerta();

});

function exibirConteudo(conteudo, tamanho) {
    $('body').append("<div id='lightbox'>"
    +"  <div id='mask'></div>"
    +       "<div class='lightbox' style='width:"+ tamanho +"px; margin-left:-"+ tamanho/2 +"px;'>"
    +"          <a href='javascript:;' class='btx rpl' title='fechar' id='fechar_lightbox'>fechar</a>"
    +"          <div id='ligbtox_content' class='fix'></div>"
    +"      </div>"
    +"  </div>");



    $('#ligbtox_content').append(conteudo);
    //$('swf, embed, object').hide();
}

/*Usado para carregar o lightbox a partir de uma url*/

function disparaModalRequest(url, tamanho) {
    $.ajax({
        url: url,
        data:'html',
        beforeSend: function(){
            $('body').append("<div id='lightbox'><div class='loading'>Carregando...</div><div id='mask2'></div></div>");
        },
        success: function(conteudo){
            $('#lightbox').remove();
            exibirConteudo(conteudo, tamanho);
        }
    });

    return false;
}


function fechaModal() {
    $("body").find("#lightbox").fadeTo("normal", 0, function(){
        // console.info(this);
        $(this).remove().hide();
        //$('swf, embed, object').show();
    });
}

function assistirMaisTardeAjax(url, elemento){
    $.ajax({
        type: "GET",
        timeout:30000,
        url: url,
        dataType: 'json',

        success: function(data) {
            if(data.sucesso){
                elemento.parents(".opcoes-filme").children(".msg_filme_adicionado").show();
                elemento.addClass('ativo');
                //alerta.show();
            } else {
                $('#padrao-alertas').show();
                $('#padrao-alertas').children('.txt_mod_def').addClass(data.tipo);
                $('#padrao-alertas').children('.txt_mod_def').children('p').text(data.mensagem);
                fechaAlerta();
            }
        }
    });
}

function excluirFilmeHomeAjax(url, elemento){
    $.ajax({
        type: "GET",
        timeout:30000,
        url: url,
        dataType: 'json',
        data: {},

        success: function(data) {
            $('#'+data.id).hide();
            //$('#'+data.id).remove();
            elemento.removeClass('ativo');
            fechaAlerta();
        }
    });


}

function fechaAlerta(){
    setTimeout(function(){
        $(".msg_padrao.messages:not(.not)").fadeTo("normal", 0, function(){
            $(this).hide();
            $(this).removeAttr("style","opacity");
        });
    }, 5000);
}

function alertaBox(mensagem, css_class) {
    if (typeof(css_class) == 'undefined')
        css_class = 'alert';

    var $box = $("#alertaBox");
    $("div[name=mensagemDiv]", $box).removeClass("error").removeClass("success").removeClass("warning").addClass(css_class);
    $("p[name=mensagemTxt]", $box).html(mensagem);
    $box.show();
}

function retornaTempoDeExpiracao(minutos) {
    var data = new Date();
    data.setTime(data.getTime() + (minutos * 60 * 1000));
    return data
}

function deep_link(agent, slug){
    if(slug != ''){
        slug = 'viewFilme/?slug=' + slug;
    };

    url_app = 'telecinePlay://';
    url_app += slug

    if (agent == 'ios') {
        var timeout;
        url_app_store = 'https://itunes.apple.com/us/app/telecine-play-filmes-online/id542237176?mt=8';

        function preventPopup() {
            clearTimeout(timeout);
            timeout = null;
            window.removeEventListener('pagehide', preventPopup);
        }

        function openApp() {    
            $('<iframe />').attr('src', url_app).attr('style', 'display:none;').appendTo('body');

            timeout = setTimeout(function() {
                window.location = url_app_store;
            }, 25);
            window.addEventListener('pagehide', preventPopup);
        }

        openApp();
    }else{
        url_app_store = 'https://play.google.com/store/apps/details?id=br.com.telecineplay.android&hl=en';

        setTimeout(function () {
            window.location = url_app_store;
        }, 25);
    };


};
