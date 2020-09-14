$(document).ready(function(){

    let newbutton = make("button.class1.class2#newbutton.class3").html("new");
    let noclass = make("button#button2.class1.class2.class3").html("no class");

    $("#warmup").after(newbutton, noclass);
});

function Lesson (name, mp, week, grade) {
    this.name = name;
    this.mp = mp;
    this.week = week;
    this.grade = grade;
    this.parts = [];

    this.parts.push(new Part("WARM UP!"));
}

function Part (name, type) {
    this.name = name;
    this.type = type;
    this.el = make("div.panel" + type);
}

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