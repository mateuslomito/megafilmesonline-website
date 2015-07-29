closeIframeOPEC = function(iframe){
    $("."+iframe).parents(".componentesTrilhos").removeClass("patrocinado");
    $("."+iframe).remove();
}

var outTimeTrilhos = null;
var overTimeTrilhos = null;

// Função que reposiciona o componenteTrilho de acordo com a sua posição na tela
function hoverTrilhos(qualTrilho) {
    var componente = qualTrilho.children('.componentesTrilhos');
    var fnd = $(".fnd", componente);
    var top_componente = componente.offset();
    var scroll_window =$(window).scrollTop() ;
    var altura_window = $(window).height();
    var seta = $(".seta", componente);
    var descontoSombra = 15;

    // Caso o card esteja da metade da tela para baixo, aplica a classe que
    // inverte a posição do componenteTrilho
    if(top_componente.top > (scroll_window + (altura_window/2))) {
        // Abaixo da metade
        componente.addClass("trilhoTop");

        var alturaTotalTela = (scroll_window + altura_window);
        var alturaTotalComponente = (fnd.offset().top + fnd.outerHeight());

        if(alturaTotalTela < alturaTotalComponente) {
            var diferencaAltura = (alturaTotalComponente - alturaTotalTela);

            var bottomFnd = parseInt(fnd.css("bottom"), 10);
            var newBottomFnd = bottomFnd + diferencaAltura - descontoSombra;

            var topSeta = parseInt(seta.css("top"), 10);
            var newTopSeta = topSeta - diferencaAltura + descontoSombra;

            fnd.css("bottom", newBottomFnd);
            seta.css("top", newTopSeta);
        }

    }else {
        // Acima da metade
        //console.log("// Acima da metade");
        componente.removeClass("trilhoTop");

        if(scroll_window > fnd.offset().top) {
            var diferencaAltura = scroll_window - fnd.offset().top;

            var topFnd = parseInt(fnd.css("top"), 10);
            var newTopFnd = topFnd + diferencaAltura;

            var topSeta = parseInt(seta.css("top"), 10);
            var newTopSeta = topSeta + diferencaAltura;

            fnd.css("top", newTopFnd);
            seta.css("top", newTopSeta);
        }

    }
}

// monta a navegação do trilho
// se recomendacao_big_data == true monta somente para o trilho big data
// senão monta para todos os trilhos
function navegacao_trilho(recomendacao_big_data){
    if (recomendacao_big_data) {
        var $trilhosNavegacao = $(".BoxTrilhos.navegacao").first();
    } else{
        var $trilhosNavegacao = $(".BoxTrilhos.navegacao");
    };

    $trilhosNavegacao.find(".agrupador").jcarousel({
        scroll: 5,
        buttonPrevHTML: "<a href=\"javascript:;\" class=\"anterior\"</a>",
        buttonNextHTML: "<a href=\"javascript:;\" class=\"proximo\"></a>",
        itemLastInCallback:function (a, c, first, last, prevFirst, prevLast){
            //remove todas as classes left, do carrousel
            $(c).parent().find("li article").removeClass("left");
            //add a class left sempre no ultimo
            $(c).find("article").addClass("left")
            //add a class left no penultimo
            $(c).parent().find("li[jcarouselindex="+( $(c).attr("jcarouselindex") - 1)+"]").find("article").addClass("left");
        },
        animationStepCallback: function () {
            if(typeof(outTimeTrilhos) != 'undefined'){
            clearTimeout(outTimeTrilhos);
            }
            // Zera o timeout que atrasa o fadeIn do box
            if(typeof(overTimeTrilhos) != 'undefined'){
                clearTimeout(overTimeTrilhos);
            }
            $trilhosNavegacao.addClass('desabilitado');
            setTimeout(function() {
                $trilhosNavegacao.removeClass('desabilitado');
            }, 500);

        }
    });

    if ($trilhosNavegacao.hasClass('desabilitado')) {
        $(this).off('mouseenter');
    }

    $trilhosNavegacao.each(function() {
        if ($(this).find('.item').length <= 5) {
            $(this).find('.proximo, .anterior').hide();
        }
    });

    $trilhosNavegacao.find("article").on("mouseenter", function() {
        var $this = $(this);
        var $janela = $(window);
        var $tooltip = $this.find(".componentesTrilhos");
        var topoTooltip = $this.offset().top + 5;
        var leftTooltip = $this.offset().left + 1;
        var rolagemJanela = $janela.scrollTop();

        // Zera o timeout que atrasa o fadeOut do box
        if(typeof(outTimeTrilhos) != 'undefined'){
            clearTimeout(outTimeTrilhos);
        }
        // Zera o timeout que atrasa o fadeIn do box
        if(typeof(overTimeTrilhos) != 'undefined'){
            clearTimeout(overTimeTrilhos);
        }

        $('.BoxTrilhos article .componentesTrilhos').removeAttr('style').fadeOut(300);
        $(".BoxTrilhos article .componentesTrilhos .fnd, .BoxTrilhos article .componentesTrilhos .seta").removeAttr("style");

        overTimeTrilhos = setTimeout(function() {
            $('.componentesTrilhos', $this).stop().fadeIn(300);
        }, 500);

        if ($tooltip.parent("article").hasClass('left')) {
            leftTooltip -= 28;
        };

        $tooltip.css({
            top: (topoTooltip - rolagemJanela),
            left: leftTooltip
        });

        $janela.scroll(function() {
            var rolagemAtual = $(this).scrollTop();
            var topoTooltipAtual = topoTooltip - rolagemAtual;

            $tooltip.css({
                top: topoTooltipAtual
            });
        });

        // verificando sustinho patrocinado
        if($(this).parents(".BoxTrilhos").attr("data-slug-genero-patrocinado")){
            OAS_sustinho_patrocinado($(this), $(this).parents(".BoxTrilhos").attr("data-slug-genero-patrocinado"), "iframe-sustinho-selo");
        }
    });

    $trilhosNavegacao.find('article').on("mouseleave", function() {
        var $this = $(this);
        var $janela = $(window);
        var $tooltip = $this.find(".componentesTrilhos");

        $this.find(".componentesTrilhos").fadeOut(300);
        $janela.off("scroll");

        // Zera o timeout que atrasa o show do box
        if(typeof(overTimeTrilhos) != 'undefined'){
            clearTimeout(overTimeTrilhos);
        }

        var componente = $('.componentesTrilhos', this);

        // Zera e reinicia o timeout que atrasa o fadeOut do box
        if(typeof(outTimeTrilhos) != 'undefined'){
            clearTimeout(outTimeTrilhos);
        }

        $('.componentesTrilhos', this).stop().fadeOut(100, function() {
            // Remove o atributo style para zerar as alterações de posição dos componentes
            $(".fnd, .seta .componentesTrilhos").removeAttr("style");
        });
        // Oculta as mensagens do "assistir mais tarde"
        $(".fnd .opcoes-filme .msg_padrao", componente).hide();

        overTimeTrilhos = setTimeout(function() {
            $this.stop().fadeIn(300).removeAttr("style");
        }, 500);

        $janela.scroll(function() {
            var topoTooltip = $this.offset().top + 5 - $janela.scrollTop();

            $tooltip.css({
                top: topoTooltip
            });
        });
    });


    /*    Comportamento sem navegacao   */
    var trilhosSemNavegacao = ".BoxTrilhos:not(.navegacao)";// para que o live propague após a páginação ajax

    $(trilhosSemNavegacao+" article").live("mouseenter", function(){
        var box = $(this);

        // Zera o timeout que atrasa o fadeOut do box
        if(typeof(outTimeTrilhos) != 'undefined'){
            clearTimeout(outTimeTrilhos);
        }

        // Zera o timeout que atrasa o fadeIn do box
        if(typeof(overTimeTrilhos) != 'undefined'){
            clearTimeout(overTimeTrilhos);
        }

        box.find('.componentesTrilhos').fadeOut(300);
        box.find('.componentesTrilhos .fnd, .componentesTrilhos .seta').removeAttr("style");

        overTimeTrilhos = setTimeout(function() {

            $('.componentesTrilhos', box).stop().fadeIn(100);

            hoverTrilhos(box);

        }, 500);

        // verificando sustinho patrocinado
        if($(this).parents(".BoxTrilhos").attr("data-slug-genero-patrocinado")){
            OAS_sustinho_patrocinado($(this), $(this).parents(".BoxTrilhos").attr("data-slug-genero-patrocinado"), "iframe-sustinho-selo");
        }
    });

    $(trilhosSemNavegacao+" article").live("mouseleave", function(){
        var box = $(this);
        var componente = $('.componentesTrilhos', this);

        $('.componentesTrilhos').fadeOut(300);

        // Zera o timeout que atrasa o show do box
        if(typeof(overTimeTrilhos) != 'undefined'){
            clearTimeout(overTimeTrilhos);
        }

        // Zera e reinicia o timeout que atrasa o fadeOut do box
        if(typeof(outTimeTrilhos) != 'undefined'){
            clearTimeout(outTimeTrilhos);
        }

        outTimeTrilhos = setTimeout(function(){

            componente.stop().fadeOut(300, function() {
                // Remove o atributo style para zerar as alterações de posição dos componentes
                $(".fnd, .seta", componente).removeAttr("style");
            });
        }, 500);
        $(".fnd .opcoes-filme .msg_padrao", componente).hide();
    });
};

$(document).ready(function(){
    navegacao_trilho(false);
});
