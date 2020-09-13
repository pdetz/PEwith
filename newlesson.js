$(document).ready(function(){

    make("button.class1.class2#id.class3");
    make("button.class1.class2.class3");

});

function make(el) {
    let split1 = el.split(/[#]/);
    let elementSplit = split1[0];
    let idSplit = split1[1];
    
    let element = elementSplit.split(/[.]/)[0];
    let id = idSplit.split(/[.]/)[0];

    let css = parseClasses(elementSplit) + " " + parseClasses(idSplit);

    let $el = $(document.createElement(element));

    
    //return $el;
}

function parseClasses(str){
    let classes = str.split(/[.]/);
    console.log(classes);
    let css = "";
    if (classes.length > 1) {
        css = classes[1];
        for (let i = 2; i < classes.length; i++){
            css += " " + classes[i];
        }
    }
    return css;
}