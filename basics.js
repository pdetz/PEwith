const PLUS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
const X = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

function make(el) {
    let split1 = el.split(/[#]/);
    let elementSplit = split1[0];
    let element = elementSplit.split(/[.]/)[0];
    let css = parseClasses(elementSplit);

    let $el = $(document.createElement(element))
                .attr("class", css);

    if (split1.length > 1){

        let idSplit = split1[1];
        let id = idSplit.split(/[.]/)[0];
        css += " " + parseClasses(idSplit);

        $el.attr("id", id).attr("class", css);
    }

    return $el;
}

function parseClasses(str){
    let classes = str.split(/[.]/);
    let css = "";
    if (classes.length > 1) {
        css = classes[1];
        for (let i = 2; i < classes.length; i++){
            css += " " + classes[i];
        }
    }
    return css;
}